'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Braces, ArrowRight, AlertCircle, CheckCircle2, Wand2, ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── TypeBox Generator Engine ───────────────────────────────

const EXAMPLES = {
  'User Object': `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28,
  "isActive": true,
  "score": 98.5,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}`,
  'Product': `{
  "productId": "prod_abc123",
  "title": "Wireless Headphones",
  "price": 79.99,
  "inStock": true,
  "quantity": 150,
  "categories": ["electronics", "audio"],
  "specs": {
    "battery": 30,
    "wireless": true,
    "color": "black"
  }
}`,
  'API Response': `{
  "success": true,
  "data": {
    "users": [],
    "total": 0,
    "page": 1,
    "perPage": 20
  },
  "meta": {
    "requestId": "req_xyz",
    "timestamp": 1700000000
  }
}`,
}

function inferType(value: unknown): string {
  if (value === null) return 'Type.Null()'
  if (value === undefined) return 'Type.Unknown()'
  if (typeof value === 'boolean') return 'Type.Boolean()'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'Type.Integer()'
    return 'Type.Number()'
  }
  if (typeof value === 'string') {
    // Detect common string formats
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return 'Type.String({ format: "date-time" })'
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Type.String({ format: "date" })'
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Type.String({ format: "email" })'
    if (/^https?:\/\//.test(value)) return 'Type.String({ format: "uri" })'
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'Type.String({ format: "uuid" })'
    return 'Type.String()'
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Type.Array(Type.Unknown())'
    const itemType = inferType(value[0])
    return `Type.Array(${itemType})`
  }
  if (typeof value === 'object') {
    return generateSchema(value as Record<string, unknown>, 2)
  }
  return 'Type.Unknown()'
}

function generateSchema(obj: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  const props = Object.entries(obj)
    .map(([key, val]) => `${innerPad}${key}: ${inferType(val)},`)
    .join('\n')

  return `Type.Object({\n${props}\n${pad}})`
}

function jsonToTypeBox(jsonStr: string): { output: string; imports: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr)

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      if (Array.isArray(parsed)) {
        const itemType = parsed.length > 0 ? inferType(parsed[0]) : 'Type.Unknown()'
        const schema = `export const Schema = Type.Array(${itemType})\nexport type SchemaType = Static<typeof Schema>`
        return {
          output: schema,
          imports: "import { Type, Static } from '@sinclair/typebox'",
        }
      }
      return { output: '', imports: '', error: 'Input must be a JSON object or array' }
    }

    const schemaBody = generateSchema(parsed as Record<string, unknown>)
    const output = `export const Schema = ${schemaBody}\n\nexport type SchemaType = Static<typeof Schema>`

    return {
      output,
      imports: "import { Type, Static } from '@sinclair/typebox'",
    }
  } catch (e) {
    return { output: '', imports: '', error: `Invalid JSON: ${(e as Error).message}` }
  }
}

// ── Component ──────────────────────────────────────────────

export function JSONToTypeBoxTool() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ output: string; imports: string; error?: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleConvert = useCallback(() => {
    if (!input.trim()) return
    setResult(jsonToTypeBox(input))
  }, [input])

  const handleExample = (key: string) => {
    setInput(EXAMPLES[key as keyof typeof EXAMPLES])
    setResult(null)
  }

  const fullOutput = result && !result.error
    ? `${result.imports}\n\n${result.output}`
    : ''

  // Auto-convert on input change after small delay
  const handleInputChange = (val: string) => {
    setInput(val)
    if (val.trim()) {
      setResult(jsonToTypeBox(val))
    } else {
      setResult(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Example buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Load example:</span>
        {Object.keys(EXAMPLES).map(key => (
          <button
            key={key}
            onClick={() => handleExample(key)}
            className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
          >
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
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="ml-1 text-xs text-muted-foreground">input.json</span>
            </div>
            <CopyButton text={input} label="Copy JSON" />
          </div>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder='Paste your JSON here…\n{\n  "name": "Alice",\n  "age": 25\n}'
            className="w-full min-h-[320px] p-4 bg-transparent font-mono text-sm resize-y outline-none placeholder:text-muted-foreground/40 leading-relaxed"
            spellCheck={false}
          />
        </GlassCard>

        {/* Output */}
        <GlassCard hover={false} className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="ml-1 text-xs text-muted-foreground">schema.ts</span>
            </div>
            {fullOutput && <CopyButton text={fullOutput} label="Copy Schema" />}
          </div>

          <div className="min-h-[320px] p-4">
            {!result && (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Braces size={22} className="text-emerald-500" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Paste JSON on the left<br />and TypeBox schema appears here instantly
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {result?.error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
                >
                  <AlertCircle size={16} className="text-destructive shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-destructive">Parse Error</div>
                    <div className="text-xs text-destructive/80 mt-0.5">{result.error}</div>
                  </div>
                </motion.div>
              )}

              {result && !result.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {/* Import line */}
                  <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                    <code className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      {result.imports}
                    </code>
                  </div>

                  {/* Schema */}
                  <pre className="font-mono text-xs leading-relaxed overflow-auto text-foreground/90 whitespace-pre-wrap break-words">
                    {result.output}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>

      {/* Success badge */}
      <AnimatePresence>
        {result && !result.error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard hover={false} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-medium">Schema generated successfully</span>
                <span className="text-xs text-muted-foreground">
                  · {Object.keys(JSON.parse(input)).length} top-level properties
                </span>
              </div>
              <CopyButton text={fullOutput} label="Copy Full File" />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Usage guide */}
      <GlassCard hover={false}>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Wand2 size={14} className="text-primary" />
          How to Use in Your Project
        </h3>
        <div className="space-y-2">
          {[
            { step: '1', code: "npm install @sinclair/typebox", desc: 'Install TypeBox' },
            { step: '2', code: "import { Type, Static } from '@sinclair/typebox'", desc: 'Import in your file' },
            { step: '3', code: "const validate = TypeCompiler.Compile(Schema)", desc: 'Compile for fast validation' },
            { step: '4', code: "validate.Check(yourData) // → boolean", desc: 'Validate at runtime' },
          ].map(row => (
            <div key={row.step} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">{row.step}</span>
              <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex-1 truncate">{row.code}</code>
              <span className="text-xs text-muted-foreground hidden sm:block">{row.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

