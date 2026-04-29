'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, BarChart2, Smile, Frown, Meh,
  BookOpen, TrendingUp, AlignLeft, Hash
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Analysis Engine ────────────────────────────────────────

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','is',
  'are','was','were','be','been','being','it','its','this','that','as','by',
  'from','up','about','into','through','i','you','he','she','we','they','me',
  'him','her','us','them','my','your','his','our','their','what','which','who',
  'how','all','each','more','also','than','then','so','if','do','did','does',
  'have','has','had','not','no','can','will','just','would','could','should',
])

const POSITIVE_WORDS = new Set([
  'great','good','excellent','amazing','wonderful','fantastic','love','happy',
  'best','perfect','beautiful','awesome','outstanding','positive','success',
  'helpful','easy','fast','powerful','clean','smart','innovative','effective',
  'brilliant','superb','impressive','pleasant','enjoy','excited','proud',
  'grateful','confident','motivated','inspired','passionate','creative',
])

const NEGATIVE_WORDS = new Set([
  'bad','terrible','awful','hate','worst','horrible','poor','fail','wrong',
  'broken','ugly','slow','difficult','problem','error','issue','bug','pain',
  'frustrated','annoying','useless','waste','boring','disappointing','confusing',
  'complicated','hard','struggle','negative','failed','crash','dead','loss',
])

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!word) return 0
  if (word.length <= 3) return 1
  const matches = word.match(/[aeiouy]+/g)
  let count = matches ? matches.length : 1
  if (word.endsWith('e') && count > 1) count--
  return Math.max(1, count)
}

interface AnalysisResult {
  // Counts
  chars: number
  charsNoSpace: number
  words: number
  sentences: number
  paragraphs: number
  syllables: number
  uniqueWords: number

  // Readability grades
  fleschEase: number
  fleschLabel: string
  fleschColor: string
  gradeLevel: number
  gradeName: string
  smogIndex: number
  automatedIndex: number

  // Sentiment
  sentimentScore: number
  sentimentLabel: string
  sentimentColor: string
  positiveCount: number
  negativeCount: number
  positiveWords: string[]
  negativeWords: string[]

  // Vocabulary
  topWords: { word: string; count: number; pct: number }[]
  avgSentenceLen: number
  avgWordLen: number
  longestSentence: string
  shortestSentence: string

  // Density
  charFreq: { char: string; count: number }[]
}

function analyzeText(raw: string): AnalysisResult {
  const trimmed = raw.trim()
  if (!trimmed) return {} as AnalysisResult

  const wordsRaw = trimmed.match(/\b[a-zA-Z']+\b/g) || []
  const wordsLower = wordsRaw.map(w => w.toLowerCase().replace(/'/g, ''))
  const sentenceArr = trimmed.match(/[^.!?…]+[.!?…]+/g) || [trimmed]

  const chars = raw.length
  const charsNoSpace = raw.replace(/\s/g, '').length
  const words = wordsRaw.length
  const sentences = sentenceArr.length
  const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean).length || 1
  const syllables = wordsLower.reduce((s, w) => s + countSyllables(w), 0)
  const uniqueWords = new Set(wordsLower).size

  // Flesch Reading Ease
  const avgSentenceLen = words / (sentences || 1)
  const avgSyllablesPerWord = syllables / (words || 1)
  const fleschRaw = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord
  const fleschEase = Math.round(Math.max(0, Math.min(100, fleschRaw)))

  let fleschLabel = '', fleschColor = ''
  if (fleschEase >= 90)      { fleschLabel = 'Very Easy';        fleschColor = '#22c55e' }
  else if (fleschEase >= 70) { fleschLabel = 'Easy';             fleschColor = '#86efac' }
  else if (fleschEase >= 60) { fleschLabel = 'Standard';         fleschColor = '#f59e0b' }
  else if (fleschEase >= 50) { fleschLabel = 'Fairly Difficult'; fleschColor = '#f97316' }
  else if (fleschEase >= 30) { fleschLabel = 'Difficult';        fleschColor = '#ef4444' }
  else                       { fleschLabel = 'Very Difficult';   fleschColor = '#dc2626' }

  // Flesch-Kincaid Grade Level
  const gradeLevel = Math.round(Math.max(0, 0.39 * avgSentenceLen + 11.8 * avgSyllablesPerWord - 15.59))
  const gradeNames: Record<number, string> = {
    0:'Kindergarten',1:'Grade 1',2:'Grade 2',3:'Grade 3',4:'Grade 4',
    5:'Grade 5',6:'Grade 6 (Middle School)',7:'Grade 7',8:'Grade 8',
    9:'Grade 9',10:'Grade 10',11:'Grade 11',12:'Grade 12',
  }
  const gradeName = gradeNames[Math.min(gradeLevel, 12)] || `College Level`

  // SMOG Index
  const polysyllables = wordsLower.filter(w => countSyllables(w) >= 3).length
  const smogIndex = sentences >= 30
    ? Math.round(3 + Math.sqrt(polysyllables * (30 / sentences)))
    : Math.round(Math.sqrt(polysyllables * (30 / Math.max(sentences, 1))) + 3)

  // Automated Readability Index
  const automatedIndex = Math.round(4.71 * (charsNoSpace / (words || 1)) + 0.5 * (words / (sentences || 1)) - 21.43)

  // Sentiment analysis
  let positiveCount = 0, negativeCount = 0
  const foundPositive: string[] = []
  const foundNegative: string[] = []
  wordsLower.forEach(w => {
    if (POSITIVE_WORDS.has(w)) { positiveCount++; if (!foundPositive.includes(w)) foundPositive.push(w) }
    if (NEGATIVE_WORDS.has(w)) { negativeCount++; if (!foundNegative.includes(w)) foundNegative.push(w) }
  })
  const sentimentScore = words > 0
    ? Math.round(((positiveCount - negativeCount) / words) * 100 * 10)
    : 0
  const clamped = Math.max(-100, Math.min(100, sentimentScore))
  let sentimentLabel = '', sentimentColor = ''
  if (clamped > 20)       { sentimentLabel = 'Positive';          sentimentColor = '#22c55e' }
  else if (clamped > 5)   { sentimentLabel = 'Slightly Positive'; sentimentColor = '#86efac' }
  else if (clamped > -5)  { sentimentLabel = 'Neutral';           sentimentColor = '#94a3b8' }
  else if (clamped > -20) { sentimentLabel = 'Slightly Negative'; sentimentColor = '#f97316' }
  else                    { sentimentLabel = 'Negative';          sentimentColor = '#ef4444' }

  // Top keywords (no stopwords)
  const freq: Record<string, number> = {}
  wordsLower.forEach(w => { if (w.length > 2 && !STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1 })
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([word, count]) => ({ word, count, pct: Math.round((count / words) * 100 * 10) / 10 }))

  // Sentence stats
  const sentLens = sentenceArr.map(s => s.trim())
  const longest = [...sentLens].sort((a, b) => b.length - a.length)[0] || ''
  const shortest = [...sentLens].sort((a, b) => a.length - b.length)[0] || ''

  // Char frequency (top 10 letters)
  const cFreq: Record<string, number> = {}
  raw.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(c => { cFreq[c] = (cFreq[c] || 0) + 1 })
  const charFreq = Object.entries(cFreq).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([char, count]) => ({ char, count }))

  return {
    chars, charsNoSpace, words, sentences, paragraphs, syllables, uniqueWords,
    fleschEase, fleschLabel, fleschColor, gradeLevel, gradeName, smogIndex, automatedIndex,
    sentimentScore: clamped, sentimentLabel, sentimentColor, positiveCount, negativeCount,
    positiveWords: foundPositive.slice(0, 8), negativeWords: foundNegative.slice(0, 8),
    topWords, avgSentenceLen: Math.round(avgSentenceLen * 10) / 10,
    avgWordLen: Math.round((charsNoSpace / (words || 1)) * 10) / 10,
    longestSentence: longest.slice(0, 120) + (longest.length > 120 ? '…' : ''),
    shortestSentence: shortest,
    charFreq,
  }
}

// ── Component ──────────────────────────────────────────────

const TABS = ['Overview','Readability','Sentiment','Keywords'] as const
type Tab = typeof TABS[number]

export function TextAnalyzerTool() {
  const [text, setText] = useState('')
  const [tab, setTab] = useState<Tab>('Overview')
  const result = useMemo(() => text.trim() ? analyzeText(text) : null, [text])

  const SentimentIcon = result?.sentimentScore !== undefined
    ? result.sentimentScore > 5 ? Smile : result.sentimentScore < -5 ? Frown : Meh
    : Meh

  return (
    <div className="space-y-5">
      {/* Input */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Activity size={14} className="text-primary" /> Text Input
          </span>
          <div className="flex gap-2">
            {text && <CopyButton text={text} label="Copy" />}
            {text && (
              <button onClick={() => setText('')}
                className="text-xs px-3 py-1.5 rounded-lg glass-card text-muted-foreground hover:text-destructive transition-colors">
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here for deep analysis…"
          className="w-full min-h-[220px] p-4 bg-transparent text-sm resize-y outline-none placeholder:text-muted-foreground/50 leading-relaxed"
        />
        {text && (
          <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-secondary/30 text-xs text-muted-foreground">
            <span>{result?.words?.toLocaleString()} words</span>
            <span>{result?.chars?.toLocaleString()} chars</span>
            <span>{result?.sentences} sentences</span>
            <span className="ml-auto" style={{ color: result?.fleschColor }}>{result?.fleschLabel}</span>
          </div>
        )}
      </GlassCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Quick stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { label: 'Words',     value: result.words,       color: '#6366f1', icon: AlignLeft },
                { label: 'Sentences', value: result.sentences,   color: '#8b5cf6', icon: BookOpen },
                { label: 'Syllables', value: result.syllables,   color: '#a855f7', icon: Hash },
                { label: 'Unique',    value: result.uniqueWords, color: '#ec4899', icon: Hash },
                { label: 'Grade',     value: result.gradeLevel,  color: '#f59e0b', icon: TrendingUp },
                { label: 'Flesch',    value: result.fleschEase,  color: result.fleschColor, icon: BarChart2 },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value.toLocaleString()}
                  icon={s.icon} color={s.color} />
              ))}
            </div>

            {/* Tabs */}
            <GlassCard hover={false} className="p-0 overflow-hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={cn('flex-1 min-w-max py-3 px-4 text-sm font-medium transition-all whitespace-nowrap',
                      tab === t
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground'
                    )}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-5">

                {/* OVERVIEW TAB */}
                {tab === 'Overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Text Statistics</h4>
                      {[
                        ['Characters (total)', result.chars.toLocaleString()],
                        ['Characters (no spaces)', result.charsNoSpace.toLocaleString()],
                        ['Paragraphs', result.paragraphs],
                        ['Avg sentence length', `${result.avgSentenceLen} words`],
                        ['Avg word length', `${result.avgWordLen} chars`],
                        ['Vocabulary richness', `${Math.round((result.uniqueWords/result.words)*100)}%`],
                      ].map(([k, v]) => (
                        <div key={String(k)} className="flex justify-between items-center py-1.5 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">{k}</span>
                          <span className="text-sm font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Reading Times</h4>
                      {[
                        ['Silent read', `${Math.ceil(result.words/238)} min`],
                        ['Aloud',       `${Math.ceil(result.words/150)} min`],
                        ['Speed-read',  `${Math.ceil(result.words/450)} min`],
                      ].map(([k,v]) => (
                        <div key={String(k)} className="flex justify-between items-center py-1.5 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">{k}</span>
                          <span className="text-sm font-semibold text-primary">{v}</span>
                        </div>
                      ))}
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Longest Sentence</h4>
                        <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded-xl leading-relaxed italic">
                          "{result.longestSentence}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* READABILITY TAB */}
                {tab === 'Readability' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {[
                      { label: 'Flesch Reading Ease', value: result.fleschEase, max: 100, color: result.fleschColor, desc: result.fleschLabel, note: 'Higher = easier to read. 60–70 is ideal for web.' },
                      { label: 'Flesch-Kincaid Grade', value: result.gradeLevel, max: 16, color: '#6366f1', desc: result.gradeName, note: 'Equivalent US school grade level.' },
                      { label: 'SMOG Index', value: result.smogIndex, max: 16, color: '#8b5cf6', desc: `Grade ${result.smogIndex}`, note: 'Years of education needed to understand the text.' },
                      { label: 'Automated Readability', value: result.automatedIndex, max: 16, color: '#ec4899', desc: `Grade ${result.automatedIndex}`, note: 'Based on characters per word and words per sentence.' },
                    ].map(metric => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${metric.color}18`, color: metric.color }}>{metric.desc}</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: metric.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (metric.value / metric.max) * 100)}%` }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{metric.note}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* SENTIMENT TAB */}
                {tab === 'Sentiment' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${result.sentimentColor}18` }}>
                        <SentimentIcon size={28} style={{ color: result.sentimentColor }} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold font-display" style={{ color: result.sentimentColor }}>{result.sentimentLabel}</div>
                        <div className="text-sm text-muted-foreground">Score: {result.sentimentScore > 0 ? '+' : ''}{result.sentimentScore}</div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>😠 Negative</span><span>😐 Neutral</span><span>😊 Positive</span>
                      </div>
                      <div className="relative h-3 bg-gradient-to-r from-red-500 via-secondary to-green-500 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 w-4 h-4 -translate-y-0.5 rounded-full bg-white shadow-lg border-2"
                          style={{ borderColor: result.sentimentColor }}
                          initial={{ left: '50%' }}
                          animate={{ left: `calc(${50 + result.sentimentScore / 2}% - 8px)` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Positive Words', words: result.positiveWords, count: result.positiveCount, color: '#22c55e' },
                        { label: 'Negative Words', words: result.negativeWords, count: result.negativeCount, color: '#ef4444' },
                      ].map(g => (
                        <div key={g.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{g.label}</span>
                            <span className="text-sm font-bold" style={{ color: g.color }}>{g.count}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {g.words.length > 0 ? g.words.map(w => (
                              <span key={w} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: `${g.color}18`, color: g.color }}>{w}</span>
                            )) : (
                              <span className="text-xs text-muted-foreground">None detected</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* KEYWORDS TAB */}
                {tab === 'Keywords' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <p className="text-xs text-muted-foreground mb-4">Top keywords by frequency (excluding common stop words)</p>
                    {result.topWords.map(({ word, count, pct }, i) => {
                      const maxCount = result.topWords[0]?.count || 1
                      return (
                        <div key={word} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{word}</span>
                              <span className="text-xs text-muted-foreground">{count}× · {pct}%</span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <motion.div className="h-full rounded-full bg-primary/70"
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / maxCount) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.04 }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Letter frequency */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <h4 className="text-sm font-semibold mb-3">Letter Frequency</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.charFreq.map(({ char, count }) => {
                          const maxC = result.charFreq[0]?.count || 1
                          const size = 28 + Math.round((count / maxC) * 20)
                          return (
                            <div key={char} className="text-center">
                              <div className="font-bold font-mono text-primary" style={{ fontSize: size }}>{char}</div>
                              <div className="text-[10px] text-muted-foreground">{count}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
