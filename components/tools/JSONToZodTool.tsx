'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Braces, CheckCircle2, AlertCircle, Wand2, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Zod Generation Engine ──────────────────────────────────

type OutputFormat = 'zod' | 'typebox' | 'both'

function detectStringFormat(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T[\d:.Z+-]+$/.test(value)) return 'z.string().datetime()'
  if (/^\d{4}-\d{2}-\d{2}$/.test(value))              return 'z.string().date()'
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'z.string().email()'
  if (/^https?:\/\//.test(value))                      return 'z.string().url()'
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'z.string().uuid()'
  if (/^\+?[0-9\s\-().]{7,}$/.test(value))            return 'z.string() /* phone */'
  return 'z.string()'
}

function detectStringFormatTB(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T[\d:.Z+-]+$/.test(value)) return "Type.String({ format: 'date-time' })"
  if (/^\d{4}-\d{2}-\d{2}$/.test(value))              return "Type.String({ format: 'date' })"
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return "Type.String({ format: 'email' })"
  if (/^https?:\/\//.test(value))                      return "Type.String({ format: 'uri' })"
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return "Type.String({ format: 'uuid' })"
  return 'Type.String()'
}

// ── ZOD Generator ──────────────────────────────────────────

function inferZodType(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  const inner = '  '.repeat(indent + 1)

  if (value === null)      return 'z.null()'
  if (value === undefined) return 'z.unknown()'
  if (typeof value === 'boolean') return 'z.boolean()'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'z.number().int()'
    return 'z.number()'
  }
  if (typeof value === 'string') return detectStringFormat(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return 'z.array(z.unknown())'
    // Check if all items are same type
    const types = Array.from(new Set(value.map(v => typeof v)))
    if (types.length === 1 && typeof value[0] === 'object' && value[0] !== null) {
      return `z.array(\n${inner}${inferZodType(value[0], indent + 1)}\n${pad})`
    }
    if (types.length === 1) {
      return `z.array(${inferZodType(value[0], indent)})`
    }
    // Union array
    const unionTypes = value.slice(0, 3).map(v => inferZodType(v, indent))
    return `z.array(z.union([${unionTypes.join(', ')}]))`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return 'z.object({})'
    const props = entries
      .map(([k, v]) => {
        const optional = v === null || v === undefined
        const type = inferZodType(v, indent + 1)
        return `${inner}${k}: ${optional ? `${type}.optional()` : type},`
      })
      .join('\n')
    return `z.object({\n${props}\n${pad}})`
  }

  return 'z.unknown()'
}

// ── TYPEBOX Generator ──────────────────────────────────────

function inferTypeBoxType(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  const inner = '  '.repeat(indent + 1)

  if (value === null)      return 'Type.Null()'
  if (value === undefined) return 'Type.Unknown()'
  if (typeof value === 'boolean') return 'Type.Boolean()'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'Type.Integer()'
    return 'Type.Number()'
  }
  if (typeof value === 'string') return detectStringFormatTB(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return 'Type.Array(Type.Unknown())'
    if (typeof value[0] === 'object' && value[0] !== null) {
      return `Type.Array(\n${inner}${inferTypeBoxType(value[0], indent + 1)}\n${pad})`
    }
    return `Type.Array(${inferTypeBoxType(value[0], indent)})`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return 'Type.Object({})'
    const props = entries
      .map(([k, v]) => {
        const optional = v === null || v === undefined
        const type = inferTypeBoxType(v, indent + 1)
        return `${inner}${k}: ${optional ? `Type.Optional(${type})` : type},`
      })
      .join('\n')
    return `Type.Object({\n${props}\n${pad}})`
  }

  return 'Type.Unknown()'
}

// ── Schema Generator ───────────────────────────────────────

function generateSchemas(jsonStr: string, format: OutputFormat): {
  zod: string; typebox: string; error?: string
} {
  try {
    const parsed = JSON.parse(jsonStr)

    // Handle arrays at root
    const isArray = Array.isArray(parsed)
    const target = isArray ? parsed[0] : parsed

    let zodOut = ''
    let tbOut = ''

    if (format === 'zod' || format === 'both') {
      const zodSchema = isArray
        ? `z.array(\n  ${inferZodType(target, 1)}\n)`
        : inferZodType(target)
      zodOut = [
        `import { z } from 'zod'\n`,
        `export const Schema = ${zodSchema}\n`,
        `export type SchemaType = z.infer<typeof Schema>`,
      ].join('\n')
    }

    if (format === 'typebox' || format === 'both') {
      const tbSchema = isArray
        ? `Type.Array(\n  ${inferTypeBoxType(target, 1)}\n)`
        : inferTypeBoxType(target)
      tbOut = [
        `import { Type, Static } from '@sinclair/typebox'\n`,
        `export const Schema = ${tbSchema}\n`,
        `export type SchemaType = Static<typeof Schema>`,
      ].join('\n')
    }

    return { zod: zodOut, typebox: tbOut }
  } catch (e) {
    return { zod: '', typebox: '', error: `Invalid JSON: ${(e as Error).message}` }
  }
}

// ── Examples ───────────────────────────────────────────────

const EXAMPLES: Record<string, string> = {
  'User': JSON.stringify({
    id: 1, name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://example.com/avatar.jpg",
    isActive: true, score: 98.5,
    role: "admin",
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["admin", "user"],
    address: { street: "123 Main St", city: "New York", zip: "10001" },
    metadata: null,
  }, null, 2),
  'Product': JSON.stringify({
    productId: "prod_abc123",
    title: "Wireless Headphones",
    price: 79.99, inStock: true,
    quantity: 150,
    categories: ["electronics", "audio"],
    specs: { battery: 30, wireless: true, color: "black" },
    reviews: [{ rating: 5, comment: "Great!", userId: "123" }],
  }, null, 2),
  'API Response': JSON.stringify({
    success: true,
    data: { users: [], total: 0, page: 1, perPage: 20 },
    meta: { requestId: "req_xyz", timestamp: 1700000000 },
    errors: null,
  }, null, 2),
  'Auth Token': JSON.stringify({
    accessToken: "eyJhbGci...",
    refreshToken: "dGhpcyBp...",
    expiresIn: 3600,
    tokenType: "Bearer",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    email: "user@example.com",
  }, null, 2),
}

// ── Component ──────────────────────────────────────────────

export function JSONToZodTool() {
  const [input, setInput] = useState('')
  const [format, setFormat] = useState<OutputFormat>('zod')
  const [result, setResult] = useState<ReturnType<typeof generateSchemas> | null>(null)
  const [activeTab, setActiveTab] = useState<'zod' | 'typebox'>('zod')

  const handleInput = useCallback((val: string) => {
    setInput(val)
    if (val.trim()) {
      const r = generateSchemas(val, format)
      setResult(r)
    } else {
      setResult(null)
    }
  }, [format])

  const handleFormat = (f: OutputFormat) => {
    setFormat(f)
    if (input.trim()) {
      setResult(generateSchemas(input, f))
    }
    if (f === 'typebox') setActiveTab('typebox')
    else setActiveTab('zod')
  }

  const outputText = result
    ? (activeTab === 'zod' ? result.zod : result.typebox)
    : ''

  const fieldCount = (() => {
    try {
      const p = JSON.parse(input)
      const obj = Array.isArray(p) ? p[0] : p
      return typeof obj === 'object' && obj ? Object.keys(obj).length : 0
    } catch { return 0 }
  })()

  return (
    <div className="space-y-5">
      {/* Format selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Output:</span>
        {(['zod', 'typebox', 'both'] as OutputFormat[]).map(f => (
          <button key={f} onClick={() => handleFormat(f)}
            className={cn('px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all',
              format === f
                ? 'bg-primary text-primary-foreground shadow-glow-brand'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}>
            {f === 'both' ? 'Both' : f === 'zod' ? 'Zod' : 'TypeBox'}
          </button>
        ))}

        <span className="text-muted-foreground mx-1">|</span>
        <span className="text-sm font-medium text-muted-foreground">Example:</span>
        {Object.keys(EXAMPLES).map(key => (
          <button key={key} onClick={() => handleInput(EXAMPLES[key])}
            className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all">
            {key}
          </button>
        ))}
      </div>

      {/* Editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="ml-1 text-xs text-muted-foreground font-mono">input.json</span>
            </div>
            <CopyButton text={input} label="Copy" />
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={'Paste your JSON here…\n{\n  "name": "Alice",\n  "age": 25,\n  "email": "alice@example.com"\n}'}
            className="w-full min-h-[360px] p-4 bg-transparent font-mono text-sm resize-y outline-none placeholder:text-muted-foreground/40 leading-relaxed"
            spellCheck={false}
          />
        </GlassCard>

        {/* Output */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          {/* Tab bar for both mode */}
          {format === 'both' && result && !result.error && (
            <div className="flex border-b border-border">
              {(['zod', 'typebox'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={cn('flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all',
                    activeTab === t
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground'
                  )}>
                  {t === 'zod' ? 'Zod Schema' : 'TypeBox Schema'}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="ml-1 text-xs text-muted-foreground font-mono">
                schema.{activeTab === 'zod' ? 'ts' : 'ts'}
              </span>
            </div>
            {outputText && <CopyButton text={outputText} label="Copy Schema" />}
          </div>

          <div className="min-h-[360px] p-4">
            {!result && (
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Braces size={22} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Paste JSON on the left<br />schema appears here instantly
                </p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {result?.error && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-destructive">Parse Error</div>
                    <div className="text-xs text-destructive/80 mt-0.5">{result.error}</div>
                  </div>
                </motion.div>
              )}

              {result && !result.error && outputText && (
                <motion.pre key={activeTab}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
                  {outputText}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>

      {/* Success bar */}
      <AnimatePresence>
        {result && !result.error && fieldCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard hover={false} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">Schema generated</span>
                <span className="text-xs text-muted-foreground">
                  · {fieldCount} top-level fields
                  {format === 'both' ? ' · Zod + TypeBox' : ` · ${format === 'zod' ? 'Zod' : 'TypeBox'}`}
                </span>
              </div>
              {format === 'both' && (
                <div className="flex gap-2">
                  <CopyButton text={result.zod} label="Copy Zod" />
                  <CopyButton text={result.typebox} label="Copy TypeBox" />
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supported features */}
      <GlassCard hover={false}>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Wand2 size={14} className="text-primary" />
          Smart Type Detection
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            ['🔤 Strings', 'Plain, email, URL, UUID, date, datetime'],
            ['🔢 Numbers', 'Integer vs float auto-detection'],
            ['📋 Objects', 'Nested objects with proper indentation'],
            ['📦 Arrays', 'Typed arrays + object arrays'],
            ['❓ Optional', 'null/undefined → optional fields'],
            ['🔗 Unions', 'Mixed-type arrays → z.union()'],
          ].map(([title, desc]) => (
            <div key={String(title)} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30">
              <span className="text-sm">{title}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
