'use client'

import { useState, useCallback } from 'react'
import { Layers, Sparkles, RotateCcw, Download, ChevronLeft, ChevronRight, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type InputMode = 'topic' | 'text'

interface Flashcard {
  id: number
  question: string
  answer: string
}

interface GeneratedDeck {
  title: string
  description: string
  cards: Flashcard[]
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does the Flashcards Generator work?',
    a: 'Paste any text or enter a topic, and the AI generates a set of question/answer flashcards. Each card targets a key concept for effective active recall practice.',
  },
  {
    q: 'Can I use my own text or notes?',
    a: 'Yes. Switch to "Paste Text" mode and paste your lecture notes, book excerpts, or any content. The AI extracts the most important concepts automatically.',
  },
  {
    q: 'How many flashcards can I generate?',
    a: 'You can generate between 5 and 20 flashcards per session. For large topics, generate multiple decks focusing on different subtopics.',
  },
  {
    q: 'Can I export the flashcards?',
    a: 'Yes. Export as JSON to import into Anki, Quizlet, or your own app. The structured format includes question, answer, and card ID.',
  },
  {
    q: 'Is this good for exam preparation?',
    a: 'Absolutely. Flashcards are one of the most research-backed study methods. Active recall and spaced repetition with AI-generated cards can significantly improve retention.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-1 block">
      {children}
    </span>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="mt-16" aria-label="Frequently Asked Questions">
      <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-sky-500 inline-block" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-200 hover:text-sky-300 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-sky-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Flashcard Component ──────────────────────────────────────────────────────

function FlashCard({ card, index, total }: { card: Flashcard; index: number; total: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full" style={{ perspective: '1000px' }}>
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative w-full cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          height: '220px',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-4">
            {index + 1} / {total} · Question
          </span>
          <p className="text-zinc-100 text-base font-medium text-center leading-relaxed">
            {card.question}
          </p>
          <span className="mt-6 text-xs text-zinc-600">Tap to reveal answer</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-sky-950 border border-sky-700/50 rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs text-sky-400 font-semibold uppercase tracking-widest mb-4">
            Answer
          </span>
          <p className="text-sky-100 text-base text-center leading-relaxed">{card.answer}</p>
          <span className="mt-6 text-xs text-sky-700">Tap to flip back</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function FlashcardsGeneratorTool() {
  const [inputMode, setInputMode] = useState<InputMode>('topic')
  const [topic, setTopic] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [numCards, setNumCards] = useState(10)
  const [deck, setDeck] = useState<GeneratedDeck | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(async () => {
    const input = inputMode === 'topic' ? topic.trim() : pastedText.trim()
    if (!input) return
    setLoading(true)
    setError(null)
    setDeck(null)
    setCurrentIndex(0)

    const systemPrompt = `You are a flashcard generator. Return ONLY valid JSON — no markdown, no explanation.
Output must match this exact structure:
{
  "title": "string",
  "description": "string",
  "cards": [
    {
      "id": 1,
      "question": "string",
      "answer": "string"
    }
  ]
}
Questions should be clear and concise. Answers should be 1-3 sentences maximum.`

    const userPrompt = inputMode === 'topic'
      ? `Generate ${numCards} study flashcards about the topic: "${input}". Cover the most important concepts, definitions, and facts.`
      : `Generate ${numCards} study flashcards from the following text. Extract the most important concepts and facts:\n\n${input.slice(0, 3000)}`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
      if (!res.ok) throw new Error('API request failed')
      const data = await res.json() as any as any
      const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed: GeneratedDeck = JSON.parse(clean)
      setDeck(parsed)
    } catch {
      setError('Failed to generate flashcards. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [inputMode, topic, pastedText, numCards])

  const handleExport = () => {
    if (!deck) return
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcards-${deck.title.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    if (!deck) return
    await navigator.clipboard.writeText(JSON.stringify(deck, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const next = () => setCurrentIndex((i) => Math.min((deck?.cards.length ?? 1) - 1, i + 1))

  return (
    <>
      

      

          {/* Hero */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-sky-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Flashcards Generator</h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              Turn any topic or text into study flashcards instantly. Powered by AI, free, no signup.
            </p>
          </div>

          {/* Config */}
          {!deck && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              {/* Mode toggle */}
              <div className="flex gap-2 bg-zinc-800 rounded-xl p-1">
                {(['topic', 'text'] as InputMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInputMode(m)}
                    className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                      inputMode === m
                        ? 'bg-sky-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {m === 'topic' ? 'By Topic' : 'Paste Text'}
                  </button>
                ))}
              </div>

              {inputMode === 'topic' ? (
                <div>
                  <Label>Topic</Label>
                  <input
                    type="text"
                    placeholder="e.g. Photosynthesis, React Hooks, World War I…"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                               placeholder:text-zinc-600 focus:outline-none focus:border-sky-500
                               focus:ring-1 focus:ring-sky-500/40 transition-all"
                  />
                </div>
              ) : (
                <div>
                  <Label>Your Text</Label>
                  <textarea
                    placeholder="Paste your notes, article, or any text here…"
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    rows={6}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                               placeholder:text-zinc-600 focus:outline-none focus:border-sky-500
                               focus:ring-1 focus:ring-sky-500/40 transition-all resize-none"
                  />
                </div>
              )}

              <div>
                <Label>Number of Cards</Label>
                <select
                  value={numCards}
                  onChange={(e) => setNumCards(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                             focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/40 transition-all appearance-none"
                >
                  {[5, 8, 10, 15, 20].map((n) => (
                    <option key={n} value={n}>{n} cards</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !(inputMode === 'topic' ? topic.trim() : pastedText.trim())}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500
                           disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                           text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating flashcards…
  ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Generate Flashcards
  )}
              </button>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
          )}

          {/* Deck View */}
          {deck && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">{deck.title}</h2>
                  <p className="text-xs text-zinc-500">{deck.description}</p>
                </div>
                <button
                  onClick={() => { setDeck(null); setCurrentIndex(0) }}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-sky-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Deck
                </button>
              </div>

              {/* Card */}
              <FlashCard
                card={deck.cards[currentIndex]}
                index={currentIndex}
                total={deck.cards.length}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={prev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-sky-300 hover:border-sky-500/50
                             disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {/* Progress dots */}
                <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
                  {deck.cards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex ? 'bg-sky-500 scale-125' : 'bg-zinc-700 hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  disabled={currentIndex === deck.cards.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-sky-300 hover:border-sky-500/50
                             disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Export */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-sky-300 hover:border-sky-500/50
                             text-xs font-medium transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-sky-300 hover:border-sky-500/50
                             text-xs font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
              </div>
            </div>
          )}

          <FAQSection />
  )
}
