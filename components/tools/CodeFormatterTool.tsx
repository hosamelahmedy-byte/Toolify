'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2, Play, Copy, Trash2, Download, Upload,
  ChevronDown, CheckCircle2, AlertCircle, Sparkles,
  Minimize2, Maximize2, FileCode2,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Language definitions ────────────────────────────────────

type Language = {
  id: string
  label: string
  icon: string
  color: string
  example: string
}

const LANGUAGES: Language[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    icon: 'JS',
    color: 'from-yellow-400 to-amber-500',
    example: `function greet(name){return "Hello, "+name+"!"}\nconst result=greet("World")\nconsole.log(result)`,
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    icon: 'TS',
    color: 'from-blue-500 to-blue-600',
    example: `interface User{id:number;name:string;email:string}\nfunction getUser(id:number):Promise<User>{return fetch("/api/users/"+id).then(r=>r.json())}`,
  },
  {
    id: 'json',
    label: 'JSON',
    icon: '{ }',
    color: 'from-emerald-400 to-teal-500',
    example: `{"user":{"id":1,"name":"Alice","roles":["admin","editor"],"meta":{"created":"2024-01-01","active":true}}}`,
  },
  {
    id: 'html',
    label: 'HTML',
    icon: 'HTM',
    color: 'from-orange-400 to-red-500',
    example: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Page</title></head><body><h1>Hello World</h1><p>This is a paragraph.</p></body></html>`,
  },
  {
    id: 'css',
    label: 'CSS',
    icon: 'CSS',
    color: 'from-sky-400 to-blue-500',
    example: `.container{display:flex;flex-direction:column;align-items:center;padding:16px 24px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}.title{font-size:1.5rem;font-weight:700;color:#1a1a2e;margin-bottom:8px}`,
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: 'SQL',
    color: 'from-violet-500 to-purple-600',
    example: `SELECT u.id,u.name,u.email,COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 GROUP BY u.id,u.name,u.email ORDER BY order_count DESC LIMIT 10`,
  },
  {
    id: 'xml',
    label: 'XML',
    icon: 'XML',
    color: 'from-rose-400 to-pink-500',
    example: `<?xml version="1.0" encoding="UTF-8"?><root><user id="1"><name>Alice</name><email>alice@example.com</email><roles><role>admin</role><role>editor</role></roles></user></root>`,
  },
  {
    id: 'markdown',
    label: 'Markdown',
    icon: 'MD',
    color: 'from-slate-500 to-zinc-600',
    example: `# Heading 1\n## Heading 2\nThis is **bold** and *italic* text.\n- Item one\n- Item two\n\`\`\`js\nconsole.log('code')\n\`\`\``,
  },
]

// ── Indent style options ────────────────────────────────────

type IndentStyle = '2' | '4' | 'tab'
const INDENT_OPTIONS: { value: IndentStyle; label: string }[] = [
  { value: '2', label: '2 Spaces' },
  { value: '4', label: '4 Spaces' },
  { value: 'tab', label: 'Tabs' },
]

// ── Pure JS formatters ──────────────────────────────────────

function getIndent(style: IndentStyle): string {
  return style === 'tab' ? '\t' : ' '.repeat(Number(style))
}

function formatJSON(raw: string, indent: IndentStyle): { output: string; error?: string } {
  try {
    const parsed = JSON.parse(raw)
    return { output: JSON.stringify(parsed, null, getIndent(indent)) }
  } catch (e: unknown) {
    return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON' }
  }
}

function formatHTML(raw: string, indent: IndentStyle): { output: string; error?: string } {
  const ind = getIndent(indent)
  let level = 0
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
  
  // Tokenise the HTML into opening tags, closing tags, and text
  const tokens = raw
    .replace(/>\s+</g, '><')
    .replace(/<!--[\s\S]*?-->/g, m => `<!--${m.slice(4,-3).trim()}-->`)
    .split(/(<[^>]+>)/)
    .filter(t => t.trim())

  const lines: string[] = []

  for (const token of tokens) {
    if (token.startsWith('</')) {
      level = Math.max(0, level - 1)
      lines.push(ind.repeat(level) + token)
    } else if (token.startsWith('<') && !token.startsWith('<!--')) {
      lines.push(ind.repeat(level) + token)
      const tagName = (token.match(/<([a-z0-9-]+)/i)?.[1] || '').toLowerCase()
      if (!voidTags.has(tagName) && !token.endsWith('/>')) level++
    } else if (token.startsWith('<!--')) {
      lines.push(ind.repeat(level) + token)
    } else {
      if (token.trim()) lines.push(ind.repeat(level) + token.trim())
    }
  }

  return { output: lines.join('\n') }
}

function formatCSS(raw: string, indent: IndentStyle): { output: string; error?: string } {
  const ind = getIndent(indent)
  // Remove extra whitespace then re-structure
  const cleaned = raw
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const lines = cleaned.split('\n')
  let level = 0
  const output: string[] = []

  for (let raw of lines) {
    const line = raw.trim()
    if (!line) { output.push(''); continue }
    if (line === '}') {
      level = Math.max(0, level - 1)
      output.push(ind.repeat(level) + line)
    } else if (line.endsWith('{')) {
      output.push(ind.repeat(level) + line)
      level++
    } else {
      output.push(ind.repeat(level) + line)
    }
  }

  return { output: output.join('\n').replace(/\n{3,}/g, '\n\n').trim() }
}

function formatSQL(raw: string, _indent: IndentStyle): { output: string; error?: string } {
  const keywords = [
    'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN',
    'ON','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES',
    'UPDATE','SET','DELETE FROM','CREATE TABLE','ALTER TABLE','DROP TABLE',
    'AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS NULL','IS NOT NULL',
    'UNION','UNION ALL','EXCEPT','INTERSECT','WITH','AS','DISTINCT','COUNT',
    'SUM','AVG','MIN','MAX','CASE','WHEN','THEN','ELSE','END',
  ]

  let result = raw.trim()
  // Normalize whitespace
  result = result.replace(/\s+/g, ' ')

  // Line-break before major keywords
  const breakers = ['SELECT','FROM','WHERE','LEFT JOIN','RIGHT JOIN','INNER JOIN',
    'JOIN','ON','GROUP BY','ORDER BY','HAVING','LIMIT','UNION ALL','UNION',
    'INSERT INTO','VALUES','UPDATE','SET','DELETE FROM']

  for (const kw of breakers) {
    const re = new RegExp(`\\b(${kw})\\b`, 'gi')
    result = result.replace(re, `\n$1`)
  }

  // Uppercase all keywords
  for (const kw of keywords) {
    const re = new RegExp(`\\b${kw}\\b`, 'gi')
    result = result.replace(re, kw)
  }

  return { output: result.split('\n').map(l => l.trim()).filter(Boolean).join('\n') }
}

function formatXML(raw: string, indent: IndentStyle): { output: string; error?: string } {
  const ind = getIndent(indent)
  // Use same approach as HTML but always increment
  const tokens = raw
    .replace(/>\s+</g, '><')
    .split(/(<[^>]+>)/)
    .filter(t => t.trim())

  let level = 0
  const lines: string[] = []

  for (const token of tokens) {
    if (token.startsWith('</')) {
      level = Math.max(0, level - 1)
      lines.push(ind.repeat(level) + token)
    } else if (token.startsWith('<?') || token.startsWith('<!')) {
      lines.push(ind.repeat(level) + token)
    } else if (token.startsWith('<') && !token.endsWith('/>')) {
      lines.push(ind.repeat(level) + token)
      level++
    } else if (token.startsWith('<')) {
      lines.push(ind.repeat(level) + token)
    } else {
      if (token.trim()) lines.push(ind.repeat(level) + token.trim())
    }
  }

  return { output: lines.join('\n') }
}

function formatJavaScript(raw: string, indent: IndentStyle): { output: string; error?: string } {
  // Basic JS formatter: normalize spacing around operators, add newlines after ;/{/}
  const ind = getIndent(indent)
  
  // We'll do a simplified line-based reformat
  let result = raw
    .replace(/;(?!\s*\n)/g, ';\n')
    .replace(/\{(?!\s*\n)/g, ' {\n')
    .replace(/\}(?!\s*[\n;,)])/g, '\n}\n')
    .replace(/\n{3,}/g, '\n\n')

  const lines = result.split('\n')
  let level = 0
  const output: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) { output.push(''); continue }

    const closes = (line.match(/}/g) || []).length
    const opens = (line.match(/{/g) || []).length

    if (line.startsWith('}') || line.startsWith(')')) {
      level = Math.max(0, level - 1)
    }

    output.push(ind.repeat(level) + line)

    const net = opens - closes
    if (net > 0) level += net
    else if (!line.startsWith('}') && closes > opens) {
      level = Math.max(0, level - (closes - opens))
    }
  }

  return { output: output.join('\n').replace(/\n{3,}/g, '\n\n').trim() }
}

function formatMarkdown(raw: string, _indent: IndentStyle): { output: string; error?: string } {
  const lines = raw.split('\n')
  const output: string[] = []
  let prevBlank = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isBlank = !line.trim()
    const isHeading = /^#{1,6}\s/.test(line)
    const nextLine = lines[i + 1]

    if (isHeading && i > 0 && !prevBlank) output.push('')
    output.push(line)
    if (isHeading && nextLine && nextLine.trim()) output.push('')

    prevBlank = isBlank
  }

  return { output: output.join('\n').replace(/\n{3,}/g, '\n\n').trim() }
}

function formatCode(
  code: string,
  lang: string,
  indent: IndentStyle
): { output: string; error?: string } {
  if (!code.trim()) return { output: '' }
  switch (lang) {
    case 'json': return formatJSON(code, indent)
    case 'html': return formatHTML(code, indent)
    case 'css': return formatCSS(code, indent)
    case 'sql': return formatSQL(code, indent)
    case 'xml': return formatXML(code, indent)
    case 'markdown': return formatMarkdown(code, indent)
    case 'javascript':
    case 'typescript':
      return formatJavaScript(code, indent)
    default: return { output: code }
  }
}

// ── Stats ───────────────────────────────────────────────────

function getCodeStats(code: string) {
  if (!code.trim()) return { lines: 0, chars: 0, size: '0 B' }
  const lines = code.split('\n').length
  const chars = code.length
  const bytes = new Blob([code]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { lines, chars, size }
}

// ── Main Component ──────────────────────────────────────────

export function CodeFormatterTool() {
  const [lang, setLang] = useState<Language>(LANGUAGES[0])
  const [indent, setIndent] = useState<IndentStyle>('2')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [formatted, setFormatted] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [indentOpen, setIndentOpen] = useState(false)
  const [outputExpanded, setOutputExpanded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const inputStats = getCodeStats(input)
  const outputStats = getCodeStats(output)

  const handleFormat = useCallback(() => {
    const result = formatCode(input, lang.id, indent)
    if (result.error) {
      setError(result.error)
      setOutput('')
      setFormatted(false)
    } else {
      setOutput(result.output)
      setError(null)
      setFormatted(true)
    }
  }, [input, lang, indent])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
    setFormatted(false)
  }

  const handleLoadExample = () => {
    setInput(lang.example)
    setOutput('')
    setError(null)
    setFormatted(false)
  }

  const handleDownload = () => {
    const ext = { javascript: 'js', typescript: 'ts', json: 'json', html: 'html', css: 'css', sql: 'sql', xml: 'xml', markdown: 'md' }[lang.id] || 'txt'
    const blob = new Blob([output], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `formatted.${ext}`
    a.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setInput(ev.target?.result as string)
      setOutput('')
      setFormatted(false)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const selectLang = (l: Language) => {
    setLang(l)
    setLangOpen(false)
    setOutput('')
    setError(null)
    setFormatted(false)
  }

  return (
    <div className="space-y-6">

      {/* ── Toolbar ── */}
      <GlassCard className="flex flex-wrap gap-4 items-center justify-between" hover={false}>
        {/* Language Picker */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(o => !o); setIndentOpen(false) }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r text-white', lang.color)}>
              {lang.icon}
            </span>
            {lang.label}
            <ChevronDown size={14} className={cn('transition-transform', langOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 top-full mt-2 left-0 glass-card p-1.5 min-w-[180px] shadow-lg"
              >
                {LANGUAGES.map(l => (
                  <button
                    key={l.id}
                    onClick={() => selectLang(l)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      lang.id === l.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                    )}
                  >
                    <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r text-white shrink-0', l.color)}>
                      {l.icon}
                    </span>
                    {l.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indent Picker */}
        <div className="relative">
          <button
            onClick={() => { setIndentOpen(o => !o); setLangOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <Code2 size={14} />
            {INDENT_OPTIONS.find(o => o.value === indent)?.label}
            <ChevronDown size={14} className={cn('transition-transform', indentOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {indentOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 top-full mt-2 left-0 glass-card p-1.5 min-w-[140px] shadow-lg"
              >
                {INDENT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setIndent(opt.value); setIndentOpen(false) }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      indent === opt.value ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleLoadExample}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Sparkles size={13} />
            Example
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Upload size={13} />
            Upload
          </button>
          <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} accept=".js,.ts,.json,.html,.css,.sql,.xml,.md,.txt" />
          <button
            onClick={handleClear}
            disabled={!input && !output}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={13} />
            Clear
          </button>
        </div>
      </GlassCard>

      {/* ── Editor Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Input */}
        <GlassCard hover={false} className="space-y-3 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-1">Input</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{inputStats.lines} lines</span>
              <span>{inputStats.chars} chars</span>
              <span>{inputStats.size}</span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setFormatted(false) }}
            placeholder={`Paste your ${lang.label} code here…`}
            className="w-full bg-transparent resize-none outline-none text-sm font-mono px-4 pb-4 min-h-[360px] placeholder:text-muted-foreground/50 leading-relaxed"
            spellCheck={false}
            autoComplete="off"
          />
        </GlassCard>

        {/* Output */}
        <GlassCard hover={false} className="space-y-3 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/40" />
              </div>
              <span className="text-xs font-medium text-muted-foreground ml-1">Output</span>
              {formatted && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-xs text-emerald-500 font-medium"
                >
                  <CheckCircle2 size={11} />
                  Formatted
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {output && (
                <>
                  <span className="text-xs text-muted-foreground">{outputStats.lines} lines · {outputStats.size}</span>
                  <button onClick={handleDownload} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Download">
                    <Download size={13} className="text-muted-foreground" />
                  </button>
                  <button onClick={() => setOutputExpanded(o => !o)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Expand">
                    {outputExpanded ? <Minimize2 size={13} className="text-muted-foreground" /> : <Maximize2 size={13} className="text-muted-foreground" />}
                  </button>
                  <CopyButton text={output} />
                </>
              )}
            </div>
          </div>

          <div className={cn('relative px-4 pb-4', outputExpanded && 'min-h-[600px]')}>
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Format Error</p>
                    <p className="text-xs opacity-80 font-mono">{error}</p>
                  </div>
                </motion.div>
              ) : output ? (
                <motion.pre
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed min-h-[360px]"
                >
                  {output}
                </motion.pre>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[360px] text-center gap-3"
                >
                  <FileCode2 size={40} className="text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground/60">Formatted code will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>

      {/* ── Format Button ── */}
      <motion.button
        onClick={handleFormat}
        disabled={!input.trim()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all',
          'bg-gradient-to-r from-slate-700 to-zinc-800 dark:from-slate-200 dark:to-zinc-100',
          'text-white dark:text-zinc-900',
          'shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        )}
      >
        <Play size={18} />
        Format {lang.label}
      </motion.button>

      {/* ── Feature Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Code2, label: '8 Languages', sub: 'JS · TS · JSON · HTML · CSS · SQL · XML · MD' },
          { icon: Sparkles, label: 'Instant Format', sub: 'Client-side, zero latency' },
          { icon: Upload, label: 'File Upload', sub: 'Drag or upload any code file' },
          { icon: Download, label: 'Download', sub: 'Save formatted output' },
        ].map(({ icon: Icon, label, sub }) => (
          <GlassCard key={label} size="sm" className="text-center" hover>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center mx-auto mb-2">
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-sm font-semibold mb-0.5">{label}</p>
            <p className="text-xs text-muted-foreground leading-tight">{sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* ── How it works ── */}
      <GlassCard hover={false}>
        <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
          <Code2 size={16} />
          How to Use
        </h2>
        <ol className="space-y-2 text-sm text-muted-foreground">
          {[
            'Select your programming language from the dropdown above.',
            'Paste your unformatted code in the left editor, or upload a file.',
            'Choose your preferred indent style (2 spaces, 4 spaces, or tabs).',
            'Click "Format" to instantly beautify your code.',
            'Copy the result or download the formatted file.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </GlassCard>

    </div>
  )
}

