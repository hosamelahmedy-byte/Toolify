'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, Copy, RotateCcw, ArrowRight,
  CheckCheck, Loader2, Sparkles, AlertCircle,
  AlignLeft, Briefcase, Scissors, Zap,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Modes ──────────────────────────────────────────────────
const MODES = [
  {
    id: 'enhance',
    label: 'Enhance',
    description: 'Fix grammar & improve flow',
    icon: Sparkles,
    gradient: 'from-violet-500 to-purple-600',
    activeClass: 'border-violet-500 bg-violet-500/10 text-violet-400',
  },
  {
    id: 'simplify',
    label: 'Simplify',
    description: 'Easy, clear language',
    icon: AlignLeft,
    gradient: 'from-sky-500 to-blue-600',
    activeClass: 'border-sky-500 bg-sky-500/10 text-sky-400',
  },
  {
    id: 'formal',
    label: 'Formal',
    description: 'Professional tone',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500',
    activeClass: 'border-amber-500 bg-amber-500/10 text-amber-400',
  },
  {
    id: 'concise',
    label: 'Concise',
    description: 'Shorter & to the point',
    icon: Scissors,
    gradient: 'from-emerald-500 to-teal-600',
    activeClass: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  },
] as const

type ModeId = (typeof MODES)[number]['id']

const MAX_CHARS = 3000

// ── Component ──────────────────────────────────────────────
export function AITextEnhancerTool() {
  const [input, setInput]   = useState('')
  const [result, setResult] = useState('')
  const [mode, setMode]     = useState<ModeId>('enhance')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const activeMode = MODES.find(m => m.id === mode)!
  const charCount  = input.length
  const overLimit  = charCount > MAX_CHARS

  async function handleEnhance() {
    if (!input.trim() || loading || overLimit) return
    setLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, mode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setResult(data.result)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setInput('')
    setResult('')
    setError('')
  }

  return (
    <div className="space-y-6">

      {/* Mode Selector */}
      <GlassCard hover={false}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Enhancement Mode
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODES.map(m => {
            const Icon = m.icon
            const isActive = mode === m.id
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200',
                  isActive
                    ? m.activeClass
                    : 'border-border/50 hover:border-border hover:bg-secondary/50 text-muted-foreground'
                )}
              >
                <Icon size={18} />
                <span className="text-xs font-semibold">{m.label}</span>
                <span className="text-[10px] opacity-70 text-center leading-tight hidden sm:block">
                  {m.description}
                </span>
              </button>
            )
          })}
        </div>
      </GlassCard>

      {/* Input Area */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <AlignLeft size={15} className="text-muted-foreground" />
            Your Text
          </label>
          <span className={cn(
            'text-xs font-mono tabular-nums',
            overLimit ? 'text-red-400' : charCount > MAX_CHARS * 0.8 ? 'text-amber-400' : 'text-muted-foreground'
          )}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste or type your text here…"
          rows={8}
          className={cn(
            'w-full resize-none rounded-xl bg-background/50 border px-4 py-3 text-sm',
            'placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-colors',
            overLimit
              ? 'border-red-500/50 focus:ring-red-500/30'
              : 'border-border/50 focus:ring-violet-500/30 focus:border-violet-500/50'
          )}
        />

        {overLimit && (
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
            <AlertCircle size={12} />
            Text exceeds {MAX_CHARS.toLocaleString()} character limit.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleEnhance}
            disabled={!input.trim() || loading || overLimit}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
              'bg-gradient-to-r text-white transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              activeMode.gradient,
              !loading && !overLimit && input.trim() && 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Enhancing…</>
            ) : (
              <><Wand2 size={15} /> {activeMode.label} Text</>
            )}
          </button>

          {(input || result) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>
      </GlassCard>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard hover={false} glow="primary">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center',
                    activeMode.gradient
                  )}>
                    <CheckCheck size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold">Enhanced Text</span>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                    activeMode.activeClass
                  )}>
                    {activeMode.label}
                  </span>
                </div>
                <CopyButton text={result} />
              </div>

              {/* Divider */}
              <div className="h-px bg-border/50 mb-4" />

              {/* Result text */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {result}
              </p>

              {/* Stats bar */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Zap size={11} className="text-violet-400" />
                  Powered by Llama 3.1 via Groq
                </span>
                <span>{result.split(/\s+/).filter(Boolean).length} words</span>
                <span>{result.length} chars</span>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
            <Wand2 size={24} className="text-violet-400" />
          </div>
          <p className="text-sm font-medium mb-1">Ready to enhance your text</p>
          <p className="text-xs opacity-60 max-w-xs">
            Choose a mode, paste your text, and let AI do the work — free, fast, no signup.
          </p>
          <div className="flex items-center gap-1.5 mt-4 text-xs opacity-50">
            <ArrowRight size={12} />
            <span>Results appear here</span>
          </div>
        </div>
      )}

    </div>
  )
}
