'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlignLeft, Clock, Hash, FileText,
  BarChart2, Trash2, Download
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn, debounce } from '@/lib/utils'

// ── Analysis Engine ────────────────────────────────────────

function analyzeText(text: string) {
  const trimmed = text.trim()

  if (!trimmed) {
    return {
      words: 0, chars: 0, charsNoSpace: 0,
      sentences: 0, paragraphs: 0, lines: 0,
      readingTime: '0 sec', speakingTime: '0 sec',
      avgWordLength: 0, uniqueWords: 0,
      longestWord: '', mostFrequent: [],
      readabilityScore: 0, readabilityLabel: '—',
      density: [],
    }
  }

  const words = trimmed.match(/\b\w+\b/g) || []
  const wordCount = words.length
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = (trimmed.match(/[^.!?]*[.!?]+/g) || []).length || (trimmed ? 1 : 0)
  const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean).length || (trimmed ? 1 : 0)
  const lines = text.split('\n').length

  // Reading times
  const readMs = (wordCount / 238) * 60 * 1000
  const speakMs = (wordCount / 150) * 60 * 1000
  const formatTime = (ms: number) => {
    const sec = Math.round(ms / 1000)
    if (sec < 60) return `${sec} sec`
    return `${Math.floor(sec / 60)} min ${sec % 60} sec`
  }

  // Word stats
  const avgWordLength = wordCount
    ? parseFloat((words.reduce((s, w) => s + w.length, 0) / wordCount).toFixed(1))
    : 0
  const lowerWords = words.map(w => w.toLowerCase())
  const uniqueWords = new Set(lowerWords).size
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0] || ''

  // Top keywords (exclude stop words)
  const STOP = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with',
    'is','are','was','were','be','been','being','it','its','this','that',
    'as','by','from','up','about','into','through','during','i','you','he',
    'she','we','they','me','him','her','us','them','my','your','his','our',
    'their','what','which','who','how','all','each','more','also','than','then',
    'so','if','do','did','does','have','has','had','not','no','can','will',
  ])
  const freq: Record<string, number> = {}
  lowerWords.forEach(w => {
    if (w.length > 2 && !STOP.has(w)) freq[w] = (freq[w] || 0) + 1
  })
  const mostFrequent = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count, pct: Math.round((count / wordCount) * 100) }))

  // Flesch Reading Ease (approximate)
  const syllableCount = words.reduce((acc, w) => acc + countSyllables(w), 0)
  const avgSyllables = wordCount ? syllableCount / wordCount : 0
  const avgSentenceLen = sentences ? wordCount / sentences : wordCount
  const flesch = Math.round(206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllables)
  const clampedFlesch = Math.max(0, Math.min(100, flesch))

  let readabilityLabel = ''
  if (clampedFlesch >= 90) readabilityLabel = 'Very Easy'
  else if (clampedFlesch >= 70) readabilityLabel = 'Easy'
  else if (clampedFlesch >= 60) readabilityLabel = 'Standard'
  else if (clampedFlesch >= 50) readabilityLabel = 'Fairly Difficult'
  else if (clampedFlesch >= 30) readabilityLabel = 'Difficult'
  else readabilityLabel = 'Very Difficult'

  return {
    words: wordCount, chars, charsNoSpace,
    sentences, paragraphs, lines,
    readingTime: formatTime(readMs),
    speakingTime: formatTime(speakMs),
    avgWordLength, uniqueWords, longestWord,
    mostFrequent, readabilityScore: clampedFlesch,
    readabilityLabel, density: mostFrequent,
  }
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  const vowels = word.match(/[aeiouy]+/g)
  return vowels ? vowels.length : 1
}

// ── Component ──────────────────────────────────────────────

export function WordCounterTool() {
  const [text, setText] = useState('')
  const stats = useMemo(() => analyzeText(text), [text])

  const PRIMARY_STATS = [
    { label: 'Words', value: stats.words, icon: AlignLeft, color: '#6366f1' },
    { label: 'Characters', value: stats.chars, icon: Hash, color: '#8b5cf6' },
    { label: 'No Spaces', value: stats.charsNoSpace, icon: Hash, color: '#a855f7' },
    { label: 'Sentences', value: stats.sentences, icon: FileText, color: '#ec4899' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: AlignLeft, color: '#f59e0b' },
    { label: 'Lines', value: stats.lines, icon: AlignLeft, color: '#10b981' },
  ]

  const handleDownload = () => {
    const report = `WORD COUNTER REPORT
Generated: ${new Date().toLocaleString()}
${'─'.repeat(40)}
Words:          ${stats.words}
Characters:     ${stats.chars}
No Spaces:      ${stats.charsNoSpace}
Sentences:      ${stats.sentences}
Paragraphs:     ${stats.paragraphs}
Lines:          ${stats.lines}
Reading Time:   ${stats.readingTime}
Speaking Time:  ${stats.speakingTime}
Unique Words:   ${stats.uniqueWords}
Avg Word Len:   ${stats.avgWordLength}
Longest Word:   ${stats.longestWord}
Readability:    ${stats.readabilityLabel} (${stats.readabilityScore}/100)
${'─'.repeat(40)}
TOP KEYWORDS:
${stats.mostFrequent.map(k => `  ${k.word.padEnd(20)} ${k.count}x`).join('\n')}
${'─'.repeat(40)}
ORIGINAL TEXT:
${text}`
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'word-count-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Readability color
  const readColor =
    stats.readabilityScore >= 70 ? '#22c55e' :
    stats.readabilityScore >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlignLeft size={15} className="text-primary" />
            Your Text
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={text} label="Copy text" />
            {text && (
              <button
                onClick={() => setText('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium glass-card text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here… analysis updates in real-time."
          className="w-full min-h-[280px] p-4 bg-transparent text-base resize-y outline-none placeholder:text-muted-foreground/50 font-sans leading-relaxed"
          spellCheck
        />
        {/* Live word count bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-secondary/30">
          <span className="text-xs text-muted-foreground">
            {stats.words.toLocaleString()} words · {stats.chars.toLocaleString()} characters
          </span>
          <span className="text-xs text-muted-foreground">
            {stats.readingTime} reading · {stats.speakingTime} speaking
          </span>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <AnimatePresence>
        {text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 md:grid-cols-6 gap-3"
          >
            {PRIMARY_STATS.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value.toLocaleString()}
                icon={s.icon}
                color={s.color}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Stats Row */}
      <AnimatePresence>
        {text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Readability */}
            <GlassCard className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <BarChart2 size={15} className="text-primary" />
                Readability Score
              </div>
              <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: readColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.readabilityScore}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold" style={{ color: readColor }}>
                  {stats.readabilityScore}
                  <span className="text-sm font-normal text-muted-foreground">/100</span>
                </span>
                <span className="text-sm font-medium" style={{ color: readColor }}>
                  {stats.readabilityLabel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Flesch Reading Ease score. Higher = easier to read.</p>
            </GlassCard>

            {/* Time stats */}
            <GlassCard className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Clock size={15} className="text-primary" />
                Time Estimates
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Reading Time', value: stats.readingTime, note: 'avg. 238 wpm' },
                  { label: 'Speaking Time', value: stats.speakingTime, note: 'avg. 150 wpm' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{row.label}</div>
                      <div className="text-xs text-muted-foreground">{row.note}</div>
                    </div>
                    <span className="text-base font-bold text-primary">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <div className="text-sm font-medium">Unique Words</div>
                    <div className="text-xs text-muted-foreground">of {stats.words} total</div>
                  </div>
                  <span className="text-base font-bold text-purple-500">{stats.uniqueWords}</span>
                </div>
              </div>
            </GlassCard>

            {/* Longest word */}
            <GlassCard className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <FileText size={15} className="text-primary" />
                Word Insights
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Avg Word Length', value: `${stats.avgWordLength} chars` },
                  { label: 'Avg Sentence', value: stats.sentences ? `${Math.round(stats.words / stats.sentences)} words` : '—' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-semibold">{row.value}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3">
                  <div className="text-xs text-muted-foreground mb-1">Longest word</div>
                  <div className="font-mono font-semibold text-primary truncate">
                    {stats.longestWord || '—'}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyword Density */}
      <AnimatePresence>
        {text && stats.mostFrequent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart2 size={15} className="text-primary" />
                  Top Keywords & Density
                </h3>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium glass-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download size={13} />
                  Export Report
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stats.mostFrequent.map(({ word, count, pct }, i) => (
                  <div key={word} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{word}</span>
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">
                          {count}× · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary/70"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct * 5, 100)}%` }}
                          transition={{ duration: 0.4, delay: i * 0.04 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
