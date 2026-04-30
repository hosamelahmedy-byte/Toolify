'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hash, FileText, Upload, RefreshCw, ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Hash Engine ────────────────────────────────────────────

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// MD5 — pure JS implementation (Web Crypto doesn't support MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff)
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  const str = unescape(encodeURIComponent(input))
  const x: number[] = []
  for (let i = 0; i < str.length * 8; i += 8) x[i >> 5] = (x[i >> 5] || 0) | ((str.charCodeAt(i / 8) & 0xff) << (i % 32))
  const strLen = str.length * 8
  x[strLen >> 5] = (x[strLen >> 5] || 0) | (0x80 << (strLen % 32))
  x[(((strLen + 64) >>> 9) << 4) + 14] = strLen

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < x.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d]
    a = md5ff(a, b, c, d, x[i],    7, -680876936); d = md5ff(d, a, b, c, x[i+1],  12, -389564586); c = md5ff(c, d, a, b, x[i+2],  17, 606105819)
    b = md5ff(b, c, d, a, x[i+3],  22, -1044525330); a = md5ff(a, b, c, d, x[i+4],  7, -176418897); d = md5ff(d, a, b, c, x[i+5],  12, 1200080426)
    c = md5ff(c, d, a, b, x[i+6],  17, -1473231341); b = md5ff(b, c, d, a, x[i+7],  22, -45705983); a = md5ff(a, b, c, d, x[i+8],   7, 1770035416)
    d = md5ff(d, a, b, c, x[i+9],  12, -1958414417); c = md5ff(c, d, a, b, x[i+10], 17, -42063); b = md5ff(b, c, d, a, x[i+11], 22, -1990404162)
    a = md5ff(a, b, c, d, x[i+12],  7, 1804603682); d = md5ff(d, a, b, c, x[i+13], 12, -40341101); c = md5ff(c, d, a, b, x[i+14], 17, -1502002290)
    b = md5ff(b, c, d, a, x[i+15], 22, 1236535329)
    a = md5gg(a, b, c, d, x[i+1],   5, -165796510); d = md5gg(d, a, b, c, x[i+6],   9, -1069501632); c = md5gg(c, d, a, b, x[i+11], 14, 643717713)
    b = md5gg(b, c, d, a, x[i],    20, -373897302); a = md5gg(a, b, c, d, x[i+5],   5, -701558691); d = md5gg(d, a, b, c, x[i+10],  9, 38016083)
    c = md5gg(c, d, a, b, x[i+15], 14, -660478335); b = md5gg(b, c, d, a, x[i+4],  20, -405537848); a = md5gg(a, b, c, d, x[i+9],   5, 568446438)
    d = md5gg(d, a, b, c, x[i+14],  9, -1019803690); c = md5gg(c, d, a, b, x[i+3],  14, -187363961); b = md5gg(b, c, d, a, x[i+8],  20, 1163531501)
    a = md5gg(a, b, c, d, x[i+13],  5, -1444681467); d = md5gg(d, a, b, c, x[i+2],   9, -51403784); c = md5gg(c, d, a, b, x[i+7],  14, 1735328473)
    b = md5gg(b, c, d, a, x[i+12], 20, -1926607734)
    a = md5hh(a, b, c, d, x[i+5],   4, -378558); d = md5hh(d, a, b, c, x[i+8],  11, -2022574463); c = md5hh(c, d, a, b, x[i+11], 16, 1839030562)
    b = md5hh(b, c, d, a, x[i+14], 23, -35309556); a = md5hh(a, b, c, d, x[i+1],   4, -1530992060); d = md5hh(d, a, b, c, x[i+4],  11, 1272893353)
    c = md5hh(c, d, a, b, x[i+7],  16, -155497632); b = md5hh(b, c, d, a, x[i+10], 23, -1094730640); a = md5hh(a, b, c, d, x[i+13],  4, 681279174)
    d = md5hh(d, a, b, c, x[i],    11, -358537222); c = md5hh(c, d, a, b, x[i+3],  16, -722521979); b = md5hh(b, c, d, a, x[i+6],  23, 76029189)
    a = md5hh(a, b, c, d, x[i+9],   4, -640364487); d = md5hh(d, a, b, c, x[i+12], 11, -421815835); c = md5hh(c, d, a, b, x[i+15], 16, 530742520)
    b = md5hh(b, c, d, a, x[i+2],  23, -995338651)
    a = md5ii(a, b, c, d, x[i],     6, -198630844); d = md5ii(d, a, b, c, x[i+7],  10, 1126891415); c = md5ii(c, d, a, b, x[i+14], 15, -1416354905)
    b = md5ii(b, c, d, a, x[i+5],  21, -57434055); a = md5ii(a, b, c, d, x[i+12],  6, 1700485571); d = md5ii(d, a, b, c, x[i+3],  10, -1894986606)
    c = md5ii(c, d, a, b, x[i+10], 15, -1051523); b = md5ii(b, c, d, a, x[i+1],  21, -2054922799); a = md5ii(a, b, c, d, x[i+8],   6, 1873313359)
    d = md5ii(d, a, b, c, x[i+15], 10, -30611744); c = md5ii(c, d, a, b, x[i+6],  15, -1560198380); b = md5ii(b, c, d, a, x[i+13], 21, 1309151649)
    a = md5ii(a, b, c, d, x[i+4],   6, -145523070); d = md5ii(d, a, b, c, x[i+11], 10, -1120210379); c = md5ii(c, d, a, b, x[i+2],  15, 718787259)
    b = md5ii(b, c, d, a, x[i+9],  21, -343485551)
    a = safeAdd(a, oa); b = safeAdd(b, ob); c = safeAdd(c, oc); d = safeAdd(d, od)
  }

  return [a, b, c, d].map(n => {
    const hex = (n >>> 0).toString(16).padStart(8, '0')
    return hex.match(/.{2}/g)!.map(b => parseInt(b, 16).toString(16).padStart(2, '0')).join('')
  }).join('')
}

// ── Component ──────────────────────────────────────────────

const ALGORITHMS = [
  { key: 'MD5',     label: 'MD5',     bits: 128, note: 'Fast, NOT cryptographically secure' },
  { key: 'SHA-1',   label: 'SHA-1',   bits: 160, note: 'Deprecated for security use' },
  { key: 'SHA-256', label: 'SHA-256', bits: 256, note: 'Recommended for most uses' },
  { key: 'SHA-512', label: 'SHA-512', bits: 512, note: 'Maximum security' },
]

export function HashGeneratorTool() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'text' | 'file'>('text')

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) { setHashes({}); return }
    setLoading(true)
    try {
      const results: Record<string, string> = {}
      results['MD5'] = md5(text)
      for (const algo of ['SHA-1', 'SHA-256', 'SHA-512']) {
        results[algo] = await hashText(text, algo)
      }
      setHashes(results)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleText = (val: string) => {
    setInput(val)
    generate(val)
  }

  const handleFile = async (file: File) => {
    setInput(`[File: ${file.name} — ${(file.size / 1024).toFixed(1)} KB]`)
    setLoading(true)
    try {
      const buf = await file.arrayBuffer()
      const results: Record<string, string> = {}
      const fileBytes = new Uint8Array(buf)
      const fileStr = Array.from(fileBytes).map(b => String.fromCharCode(b)).join('')
      results['MD5'] = md5(fileStr)
      for (const algo of ['SHA-1', 'SHA-256', 'SHA-512']) {
        const hashBuffer = await crypto.subtle.digest(algo, buf)
        results[algo] = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
      }
      setHashes(results)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <GlassCard hover={false} className="p-2 inline-flex rounded-2xl">
        {(['text', 'file'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setInput(''); setHashes({}) }}
            className={cn('px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all',
              mode === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}>
            {m === 'text' ? '📝 Text Input' : '📁 File Upload'}
          </button>
        ))}
      </GlassCard>

      {/* Input area */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Hash size={14} className="text-primary" />
          <span className="text-sm font-medium">{mode === 'text' ? 'Input Text' : 'Upload File'}</span>
        </div>
        {mode === 'text' ? (
          <textarea value={input} onChange={e => handleText(e.target.value)}
            placeholder="Type or paste any text to generate its hash values…"
            className="w-full min-h-[160px] p-4 bg-transparent text-sm resize-y outline-none placeholder:text-muted-foreground/50 font-mono leading-relaxed"
          />
        ) : (
          <label className="flex flex-col items-center justify-center min-h-[160px] p-8 cursor-pointer hover:bg-secondary/20 transition-colors">
            <Upload size={28} className="text-muted-foreground mb-3" />
            <span className="text-sm font-medium">Drop a file or click to upload</span>
            <span className="text-xs text-muted-foreground mt-1">Any file type · Processed locally</span>
            {input && <span className="text-xs text-primary mt-3 font-medium">{input}</span>}
            <input type="file" className="sr-only" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        )}
      </GlassCard>

      {/* Hash results */}
      <AnimatePresence>
        {(Object.keys(hashes).length > 0 || loading) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {ALGORITHMS.map(algo => (
              <GlassCard key={algo.key} hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck size={13} className="text-primary shrink-0" />
                      <span className="text-sm font-bold">{algo.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{algo.bits} bits</span>
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">{algo.note}</span>
                    </div>
                    {loading ? (
                      <div className="h-5 bg-secondary animate-pulse rounded-lg w-full" />
                    ) : (
                      <div className="font-mono text-xs break-all text-foreground/80 bg-secondary/30 p-2 rounded-lg leading-relaxed">
                        {hashes[algo.key]}
                      </div>
                    )}
                  </div>
                  {hashes[algo.key] && <CopyButton text={hashes[algo.key]} className="shrink-0" />}
                </div>
              </GlassCard>
            ))}

            {/* Security note */}
            <p className="text-xs text-muted-foreground px-2 leading-relaxed">
              🔒 All hashing is performed <strong>entirely in your browser</strong>. No data is ever sent to any server.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

