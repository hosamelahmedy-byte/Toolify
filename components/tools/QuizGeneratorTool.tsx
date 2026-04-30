'use client'

import { useState, useCallback } from 'react'
import { BookOpen, Sparkles, RotateCcw, Download, CheckCircle2, XCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionType = 'multiple-choice' | 'true-false' | 'mixed'

interface QuizConfig {
  topic: string
  numQuestions: number
  difficulty: Difficulty
  questionType: QuestionType
}

interface QuizOption {
  label: string
  text: string
}

interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
  correctAnswer: string
  explanation: string
}

interface GeneratedQuiz {
  title: string
  description: string
  questions: QuizQuestion[]
}

// ─── Schema / SEO ─────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does the AI Quiz Generator work?',
    a: 'Our Quiz Generator uses a large language model to create contextually accurate questions based on your topic, difficulty, and question type preferences. The AI generates unique questions with plausible distractors and explanations each time.',
  },
  {
    q: 'Can I use this for educational purposes?',
    a: 'Absolutely. Teachers, students, and trainers use it to create study guides, class assessments, and self-testing materials. The quiz can be exported as JSON for integration into LMS platforms.',
  },
  {
    q: 'What topics can I generate quizzes on?',
    a: 'Any topic works — history, science, programming, literature, geography, trivia, and more. The more specific your topic, the better the quality of questions.',
  },
  {
    q: 'Is there a limit on the number of questions?',
    a: 'You can generate between 3 and 15 questions per quiz. For longer assessments, simply generate multiple quizzes and combine them.',
  },
  {
    q: 'Can I export or share the quiz?',
    a: 'Yes. Use the Export JSON button to download the quiz as a structured JSON file. You can then import it into quiz platforms, Google Forms, or your own app.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1 block">
      {children}
    </span>
  )
}

function Select({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40
                 disabled:opacity-50 disabled:cursor-not-allowed transition-all appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function QuizCard({
  question,
  index,
  userAnswer,
  onAnswer,
  showResult,
}: {
  question: QuizQuestion
  index: number
  userAnswer: string | undefined
  onAnswer: (qId: number, answer: string) => void
  showResult: boolean
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div className="flex gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="text-zinc-100 text-sm leading-relaxed font-medium">{question.question}</p>
      </div>

      <div className="space-y-2 pl-10">
        {question.options.map((opt) => {
          const isSelected = userAnswer === opt.label
          const isCorrect = opt.label === question.correctAnswer
          let optionStyle =
            'border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-violet-500/60 hover:bg-violet-500/5'

          if (showResult) {
            if (isCorrect) optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
            else if (isSelected && !isCorrect)
              optionStyle = 'border-red-500 bg-red-500/10 text-red-300'
            else optionStyle = 'border-zinc-800 bg-zinc-900 text-zinc-500'
          } else if (isSelected) {
            optionStyle = 'border-violet-500 bg-violet-500/10 text-violet-200'
          }

          return (
            <button
              key={opt.label}
              onClick={() => !showResult && onAnswer(question.id, opt.label)}
              disabled={showResult}
              className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${optionStyle} disabled:cursor-not-allowed`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {opt.label}
              </span>
              <span>{opt.text}</span>
              {showResult && isCorrect && (
                <CheckCircle2 className="ml-auto w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="ml-auto w-4 h-4 text-red-400 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div className="pl-10">
          <div className="mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs text-zinc-400 leading-relaxed">
            <span className="text-violet-400 font-semibold">Explanation: </span>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="mt-16" aria-label="Frequently Asked Questions">
      <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-violet-500 inline-block" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-200 hover:text-violet-300 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-violet-400 flex-shrink-0" />
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export function QuizGeneratorTool() {
  const [config, setConfig] = useState<QuizConfig>({
    topic: '',
    numQuestions: 5,
    difficulty: 'medium',
    questionType: 'multiple-choice',
  })

  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)

  const score = quiz
    ? quiz.questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length
    : 0

  const allAnswered = quiz
    ? Object.keys(userAnswers).length === quiz.questions.length
    : false

  const handleGenerate = useCallback(async () => {
    if (!config.topic.trim()) return
    setLoading(true)
    setError(null)
    setQuiz(null)
    setUserAnswers({})
    setShowResult(false)

    const systemPrompt = `You are a quiz generator. Return ONLY valid JSON — no markdown, no explanation.
Output must match this exact structure:
{
  "title": "string",
  "description": "string",
  "questions": [
    {
      "id": 1,
      "question": "string",
      "options": [
        { "label": "A", "text": "string" },
        { "label": "B", "text": "string" },
        { "label": "C", "text": "string" },
        { "label": "D", "text": "string" }
      ],
      "correctAnswer": "A",
      "explanation": "string"
    }
  ]
}
For true/false questions, use only 2 options: A (True) and B (False).
correctAnswer must be one of the option labels.`

    const userPrompt = `Generate a ${config.difficulty} difficulty quiz about "${config.topic}".
Number of questions: ${config.numQuestions}.
Question type: ${config.questionType === 'mixed' ? 'Mix of multiple-choice and true/false' : config.questionType}.
Make questions educational, clear, and with plausible wrong answers. Explanations should be 1-2 sentences.`

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
      const parsed: GeneratedQuiz = JSON.parse(clean)
      setQuiz(parsed)
    } catch {
      setError('Failed to generate quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [config])

  const handleAnswer = useCallback((qId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }))
  }, [])

  const handleExportJSON = () => {
    if (!quiz) return
    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quiz-${config.topic.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyJSON = async () => {
    if (!quiz) return
    await navigator.clipboard.writeText(JSON.stringify(quiz, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setQuiz(null)
    setUserAnswers({})
    setShowResult(false)
    setError(null)
  }

  return (
    <>
      {/* ── SEO Head ── */}
      

      {/* ── Page Layout ── */}
      

          {/* ── Hero Header ── */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
              Quiz Generator
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              Generate custom quizzes on any topic — multiple choice or true/false — powered by AI.
              Free, instant, no signup.
            </p>
          </div>

          {/* ── Config Form ── */}
          {!quiz && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              {/* Topic */}
              <div>
                <Label>Topic</Label>
                <input
                  type="text"
                  placeholder="e.g. World War II, JavaScript Promises, Human Anatomy…"
                  value={config.topic}
                  onChange={(e) => setConfig((c) => ({ ...c, topic: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                             placeholder:text-zinc-600 focus:outline-none focus:border-violet-500
                             focus:ring-1 focus:ring-violet-500/40 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Number of Questions */}
                <div>
                  <Label>Questions</Label>
                  <Select
                    value={String(config.numQuestions)}
                    onChange={(v) => setConfig((c) => ({ ...c, numQuestions: Number(v) }))}
                    options={[3, 5, 7, 10, 15].map((n) => ({ value: String(n), label: `${n}` }))}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={config.difficulty}
                    onChange={(v) => setConfig((c) => ({ ...c, difficulty: v as Difficulty }))}
                    options={[
                      { value: 'easy', label: 'Easy' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'hard', label: 'Hard' },
                    ]}
                  />
                </div>

                {/* Type */}
                <div>
                  <Label>Type</Label>
                  <Select
                    value={config.questionType}
                    onChange={(v) =>
                      setConfig((c) => ({ ...c, questionType: v as QuestionType }))
                    }
                    options={[
                      { value: 'multiple-choice', label: 'MCQ' },
                      { value: 'true-false', label: 'True/False' },
                      { value: 'mixed', label: 'Mixed' },
                    ]}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !config.topic.trim()}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500
                           disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                           text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating quiz…
  ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Generate Quiz
  )}
              </button>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}
            </div>
          )}

          {/* ── Quiz Display ── */}
          {quiz && (
            <div className="space-y-6">
              {/* Quiz Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white mb-1">{quiz.title}</h2>
                    <p className="text-xs text-zinc-500">{quiz.description}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-violet-400 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    New Quiz
                  </button>
                </div>

                {/* Score bar (after submit) */}
                {showResult && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-400">Your Score</span>
                      <span className="text-sm font-bold text-violet-300">
                        {score} / {quiz.questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-violet-500 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${(score / quiz.questions.length) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                      {score === quiz.questions.length
                        ? '🎉 Perfect score!'
                        : score >= quiz.questions.length / 2
                        ? '👍 Good job! Review the explanations below.'
                        : '📖 Keep studying — check the explanations.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {quiz.questions.map((q, i) => (
                  <QuizCard
                    key={q.id}
                    question={q}
                    index={i}
                    userAnswer={userAnswers[q.id]}
                    onAnswer={handleAnswer}
                    showResult={showResult}
                  />
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex gap-3">
                {!showResult && (
                  <button
                    onClick={() => setShowResult(true)}
                    disabled={!allAnswered}
                    className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500
                               disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold
                               text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {allAnswered ? 'Submit Quiz' : `Answer all ${quiz.questions.length} questions`}
                  </button>
                )}

                <button
                  onClick={handleCopyJSON}
                  title="Copy JSON"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-violet-300 hover:border-violet-500/50
                             text-xs font-medium transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>

                <button
                  onClick={handleExportJSON}
                  title="Export JSON"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-violet-300 hover:border-violet-500/50
                             text-xs font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            </div>
          )}

          {/* ── FAQ ── */}
          <FAQSection />
  )
}
