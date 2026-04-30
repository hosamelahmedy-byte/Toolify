'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Type, Copy, Check, Trash2, ArrowUpDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

// ── Case Conversion Logic ────────────────────────────────────

type CaseType =
  | 'uppercase'
  | 'lowercase'
  | 'titleCase'
  | 'sentenceCase'
  | 'camelCase'
  | 'pascalCase'
  | 'snakeCase'
  | 'kebabCase'
  | 'constantCase'
  | 'dotCase'
  | 'pathCase'
  | 'invertCase'
  | 'alternatingCase'

interface CaseConfig {
  id: CaseType
  label: string
  example: string
  description: string
  convert: (text: string) => string
}

function toTitleCase(str: string): string {
  const SMALL = new Set(['a','an','and','as','at','but','by','en','for','if','in','nor','of','on','or','per','so','the','to','up','via','yet'])
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, i) => (i === 0 || !SMALL.has(word)) ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(' ')
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*|\.\s+|\?\s+|!\s+)([a-z])/g, (_, sep, char) => sep + char.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

function toSnakeCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('_')
    .toLowerCase()
}

function toKebabCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('-')
    .toLowerCase()
}

function toConstantCase(str: string): string {
  return toSnakeCase(str).toUpperCase()
}

function toDotCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('.')
    .toLowerCase()
}

function toPathCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .join('/')
    .toLowerCase()
}

function toInvertCase(str: string): string {
  return str
    .split('')
    .map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())
    .join('')
}

function toAlternatingCase(str: string): string {
  let upper = true
  return str
    .split('')
    .map((c) => {
      if (!/[a-zA-Z]/.test(c)) return c
      const result = upper ? c.toUpperCase() : c.toLowerCase()
      upper = !upper
      return result
    })
    .join('')
}

const CASES: CaseConfig[] = [
  { id: 'uppercase',       label: 'UPPER CASE',       example: 'HELLO WORLD',        description: 'All characters uppercase',         convert: (s) => s.toUpperCase() },
  { id: 'lowercase',       label: 'lower case',       example: 'hello world',        description: 'All characters lowercase',         convert: (s) => s.toLowerCase() },
  { id: 'titleCase',       label: 'Title Case',       example: 'Hello World',        description: 'Capitalize each major word',       convert: toTitleCase },
  { id: 'sentenceCase',    label: 'Sentence case',    example: 'Hello world.',       description: 'Capitalize first word of sentence', convert: toSentenceCase },
  { id: 'camelCase',       label: 'camelCase',        example: 'helloWorld',         description: 'Lowercase first, capitalize rest', convert: toCamelCase },
  { id: 'pascalCase',      label: 'PascalCase',       example: 'HelloWorld',         description: 'Capitalize every word, no spaces', convert: toPascalCase },
  { id: 'snakeCase',       label: 'snake_case',       example: 'hello_world',        description: 'Words joined with underscore',     convert: toSnakeCase },
  { id: 'kebabCase',       label: 'kebab-case',       example: 'hello-world',        description: 'Words joined with hyphen',         convert: toKebabCase },
  { id: 'constantCase',    label: 'CONSTANT_CASE',    example: 'HELLO_WORLD',        description: 'Uppercase snake_case',             convert: toConstantCase },
  { id: 'dotCase',         label: 'dot.case',         example: 'hello.world',        description: 'Words joined with dot',            convert: toDotCase },
  { id: 'pathCase',        label: 'path/case',        example: 'hello/world',        description: 'Words joined with slash',          convert: toPathCase },
  { id: 'invertCase',      label: 'iNVERT cASE',      example: 'hELLO wORLD',       description: 'Flip each character case',         convert: toInvertCase },
  { id: 'alternatingCase', label: 'AlTeRnAtInG',      example: 'HeLlO WoRlD',       description: 'Alternating upper/lowercase',      convert: toAlternatingCase },
]

// ── Stats ────────────────────────────────────────────────────

function getStats(text: string) {
  return {
    chars: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text === '' ? 0 : text.split('\n').length,
    sentences: text === '' ? 0 : (text.match(/[.!?]+/g) || []).length,
  }
}

// ── Component ────────────────────────────────────────────────

export function CaseConverterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeCase, setActiveCase] = useState<CaseType | null>(null)
  const [copiedOutput, setCopiedOutput] = useState(false)

  const applyCase = useCallback((caseId: CaseType) => {
    const cfg = CASES.find((c) => c.id === caseId)!
    setActiveCase(caseId)
    setOutput(cfg.convert(input))
  }, [input])

  const handleCopy = async () => {
    if (!output) return
    await copyToClipboard(output)
    setCopiedOutput(true)
    setTimeout(() => setCopiedOutput(false), 2000)
  }

  const handleSwap = () => {
    setInput(output)
    setOutput('')
    setActiveCase(null)
  }

  const stats = getStats(input)
  const outputStats = getStats(output)

  return (
    <div className="space-y-5">

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">Input Text</p>
            <button
              onClick={() => { setInput(''); setOutput(''); setActiveCase(null) }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setOutput(''); setActiveCase(null) }}
            placeholder="Type or paste your text here…"
            rows={8}
            className={cn(
              'w-full resize-none bg-transparent text-sm text-foreground',
              'placeholder:text-muted-foreground/40 focus:outline-none',
              'leading-relaxed'
            )}
          />
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
            <span>{stats.chars} chars</span>
            <span>{stats.words} words</span>
            <span>{stats.lines} lines</span>
          </div>
        </GlassCard>

        {/* Output */}
        <GlassCard>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted-foreground">
              {activeCase ? CASES.find((c) => c.id === activeCase)?.label : 'Output'}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                <ArrowUpDown size={12} />
                Swap
              </button>
              <button
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                {copiedOutput ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copiedOutput ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div
            className="min-h-[13rem] text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words"
          >
            {output || (
              <span className="text-muted-foreground/40">
                {input ? 'Select a case below to convert' : 'Output will appear here'}
              </span>
            )}
          </div>
          {output && (
            <div className="flex gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
              <span>{outputStats.chars} chars</span>
              <span>{outputStats.words} words</span>
              <span>{outputStats.lines} lines</span>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Case Buttons Grid */}
      <GlassCard>
        <p className="text-sm font-medium text-muted-foreground mb-4">
          <Type size={14} className="inline mr-1.5 align-middle" />
          Choose Conversion
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CASES.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => applyCase(c.id)}
              disabled={!input.trim()}
              whileHover={{ scale: input.trim() ? 1.02 : 1 }}
              whileTap={{ scale: input.trim() ? 0.97 : 1 }}
              className={cn(
                'relative flex flex-col items-start p-3 rounded-xl text-left transition-all',
                'border',
                activeCase === c.id
                  ? 'bg-primary/15 border-primary/40 shadow-sm'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
                !input.trim() && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className={cn(
                'text-sm font-semibold font-mono mb-0.5',
                activeCase === c.id ? 'text-primary' : 'text-foreground'
              )}>
                {c.label}
              </span>
              <span className="text-[10px] text-muted-foreground leading-snug">{c.description}</span>
              <span className="mt-1.5 text-[10px] font-mono text-muted-foreground/60 italic">{c.example}</span>
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          <p className="text-xs text-muted-foreground self-center mr-1">Quick actions:</p>
          {CASES.filter((c) => c.id !== activeCase).slice(0, 5).map((c) => (
            <button
              key={c.id}
              onClick={() => applyCase(c.id)}
              className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {c.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

