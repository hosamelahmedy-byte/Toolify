'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Copy, Check, RefreshCw, Sparkles, ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn, copyToClipboard } from '@/lib/utils'

const MODELS = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL·E 3', 'Stable Diffusion']

const TONES = ['Professional', 'Casual', 'Persuasive', 'Technical', 'Creative', 'Concise', 'Detailed', 'Friendly']

const FORMATS = ['Paragraph', 'Bullet points', 'Numbered list', 'Table', 'JSON', 'Markdown', 'Step-by-step', 'Q&A']

const ROLES = [
  'Expert', 'Teacher', 'Copywriter', 'Developer', 'Designer',
  'Consultant', 'Analyst', 'Coach', 'Researcher', 'Strategist',
]

const TEMPLATES: Record<string, {
  task: string; context: string; tone: string; format: string; role: string; model: string; extras: string
}> = {
  'Blog Post': {
    task: 'Write a comprehensive blog post about [TOPIC]',
    context: 'Target audience: [AUDIENCE]. Purpose: educate and engage readers about this topic.',
    tone: 'Professional',
    format: 'Markdown',
    role: 'Copywriter',
    model: 'ChatGPT',
    extras: 'Include H2/H3 headings, a compelling intro, and a CTA at the end.',
  },
  'Code Review': {
    task: 'Review the following code and suggest improvements',
    context: 'Language: [LANGUAGE]. Focus on performance, readability, and best practices.',
    tone: 'Technical',
    format: 'Bullet points',
    role: 'Developer',
    model: 'Claude',
    extras: 'Provide specific code examples for each suggestion.',
  },
  'Image Generation': {
    task: 'A photorealistic image of [SUBJECT]',
    context: 'Style: cinematic photography, golden hour lighting',
    tone: 'Creative',
    format: 'Paragraph',
    role: 'Designer',
    model: 'Midjourney',
    extras: '--ar 16:9 --v 6 --style raw',
  },
  'Email Draft': {
    task: 'Write a professional email to [RECIPIENT] about [TOPIC]',
    context: 'Relationship: [professional/friendly]. Goal: [GOAL]',
    tone: 'Professional',
    format: 'Paragraph',
    role: 'Consultant',
    model: 'ChatGPT',
    extras: 'Keep it under 150 words. End with a clear call to action.',
  },
}

function buildPrompt(state: {
  model: string; role: string; task: string; context: string
  tone: string; format: string; extras: string; chain: boolean; few_shot: boolean
}): string {
  if (!state.task.trim()) return ''

  const parts: string[] = []

  // Role assignment
  if (state.role) {
    parts.push(`You are a ${state.role.toLowerCase()} with deep expertise.`)
  }

  // Task
  parts.push(`## Task\n${state.task}`)

  // Context
  if (state.context.trim()) {
    parts.push(`## Context\n${state.context}`)
  }

  // Output requirements
  const outputLines: string[] = []
  if (state.tone) outputLines.push(`- Tone: ${state.tone}`)
  if (state.format) outputLines.push(`- Format: ${state.format}`)
  if (state.model === 'Midjourney' || state.model === 'DALL·E 3' || state.model === 'Stable Diffusion') {
    outputLines.push('- Be highly descriptive and visual')
    outputLines.push('- Use comma-separated modifiers')
  }
  if (outputLines.length > 0) {
    parts.push(`## Output Requirements\n${outputLines.join('\n')}`)
  }

  // Chain of thought
  if (state.chain) {
    parts.push(`## Instructions\nThink step by step before providing your final answer. Show your reasoning process.`)
  }

  // Few-shot
  if (state.few_shot) {
    parts.push(`## Examples\nExample 1: [ADD YOUR EXAMPLE INPUT] → [ADD EXPECTED OUTPUT]\nExample 2: [ADD YOUR EXAMPLE INPUT] → [ADD EXPECTED OUTPUT]`)
  }

  // Extras
  if (state.extras.trim()) {
    parts.push(`## Additional Notes\n${state.extras}`)
  }

  // Model-specific suffix
  if (state.model === 'Midjourney' && state.extras && !state.extras.includes('--')) {
    parts.push(`\n${state.extras}`)
  }

  return parts.join('\n\n')
}

const SCORE_WEIGHTS = { task: 30, context: 20, tone: 10, format: 10, role: 15, chain: 10, few_shot: 5 }

function calcScore(state: typeof INITIAL_STATE): number {
  let s = 0
  if (state.task.trim().length > 10) s += SCORE_WEIGHTS.task
  if (state.context.trim().length > 5) s += SCORE_WEIGHTS.context
  if (state.tone) s += SCORE_WEIGHTS.tone
  if (state.format) s += SCORE_WEIGHTS.format
  if (state.role) s += SCORE_WEIGHTS.role
  if (state.chain) s += SCORE_WEIGHTS.chain
  if (state.few_shot) s += SCORE_WEIGHTS.few_shot
  return s
}

const INITIAL_STATE = {
  model: 'ChatGPT', role: 'Expert', task: '', context: '',
  tone: 'Professional', format: 'Paragraph', extras: '',
  chain: false, few_shot: false,
}

export function PromptGeneratorTool() {
  const [state, setState] = useState(INITIAL_STATE)
  const set = (key: string, val: unknown) => setState(prev => ({ ...prev, [key]: val }))

  const prompt = buildPrompt(state)
  const score = calcScore(state)
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  const scoreLabel = score >= 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Needs more detail'

  const loadTemplate = (name: string) => {
    const t = TEMPLATES[name]
    if (t) setState(prev => ({ ...prev, ...t }))
  }

  return (
    <div className="space-y-5">
      {/* Templates */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Templates:</span>
        {Object.keys(TEMPLATES).map(t => (
          <button key={t} onClick={() => loadTemplate(t)}
            className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all">
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Builder */}
        <div className="space-y-4">
          {/* Model selector */}
          <GlassCard hover={false} className="p-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Target Model</label>
            <div className="flex flex-wrap gap-2">
              {MODELS.map(m => (
                <button key={m} onClick={() => set('model', m)}
                  className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                    state.model === m
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/20 bg-secondary/30'
                  )}>
                  {m}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">AI Role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button key={r} onClick={() => set('role', r)}
                  className={cn('px-3 py-1.5 rounded-lg text-sm transition-all',
                    state.role === r ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
                  )}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Task */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Task / Goal *</label>
            <textarea
              value={state.task}
              onChange={e => set('task', e.target.value)}
              placeholder="Describe what you want the AI to do..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
            />
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Context / Background</label>
            <textarea
              value={state.context}
              onChange={e => set('context', e.target.value)}
              placeholder="Target audience, background info, constraints..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
            />
          </div>

          {/* Tone + Format */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Tone</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.slice(0, 6).map(t => (
                  <button key={t} onClick={() => set('tone', t)}
                    className={cn('px-2.5 py-1 rounded-lg text-xs transition-all',
                      state.tone === t ? 'bg-primary/10 text-primary border border-primary/30' : 'glass-card text-muted-foreground hover:text-foreground'
                    )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Format</label>
              <div className="flex flex-wrap gap-1.5">
                {FORMATS.slice(0, 6).map(f => (
                  <button key={f} onClick={() => set('format', f)}
                    className={cn('px-2.5 py-1 rounded-lg text-xs transition-all',
                      state.format === f ? 'bg-primary/10 text-primary border border-primary/30' : 'glass-card text-muted-foreground hover:text-foreground'
                    )}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Additional Instructions</label>
            <input type="text" value={state.extras} onChange={e => set('extras', e.target.value)}
              placeholder="Word limit, specific requirements, constraints..."
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>

          {/* Advanced toggles */}
          <div className="flex gap-3">
            {[
              { key: 'chain', label: '🔗 Chain of Thought', desc: 'Step-by-step reasoning' },
              { key: 'few_shot', label: '📝 Few-Shot Examples', desc: 'Add example placeholder' },
            ].map(({ key, label, desc }) => (
              <button key={key}
                onClick={() => set(key, !(state as any)[key])}
                className={cn('flex-1 p-3 rounded-xl text-left transition-all border text-sm',
                  (state as any)[key]
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/20 bg-secondary/30'
                )}>
                <div className="font-medium text-xs">{label}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          {/* Quality score */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Prompt quality:</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: scoreColor }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-sm font-semibold" style={{ color: scoreColor }}>{score}%</span>
            <span className="text-xs text-muted-foreground hidden sm:block">{scoreLabel}</span>
          </div>

          {/* Prompt output */}
          <GlassCard hover={false} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles size={14} className="text-primary" />
                Generated Prompt
                <span className="text-xs text-muted-foreground">for {state.model}</span>
              </div>
              {prompt && <CopyButton text={prompt} label="Copy Prompt" />}
            </div>
            <div className="min-h-[400px] p-4">
              {!prompt ? (
                <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Wand2 size={22} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Fill in the task field to generate your prompt</p>
                </div>
              ) : (
                <motion.pre
                  key={prompt.slice(0, 20)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground/90"
                >
                  {prompt}
                </motion.pre>
              )}
            </div>
          </GlassCard>

          {prompt && (
            <p className="text-xs text-muted-foreground">
              {prompt.split(' ').length} words · {prompt.length} characters
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
