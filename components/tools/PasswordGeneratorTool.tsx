'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, RefreshCw, Copy, Check, Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

// ── Password Engine ────────────────────────────────────────

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar:   'iIlL1oO0',
  ambiguous: '{}[]()/\\\'"`~,;:.<>',
}

interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

function generatePassword(opts: PasswordOptions): string {
  let charset = ''
  if (opts.uppercase) charset += CHARSETS.uppercase
  if (opts.lowercase) charset += CHARSETS.lowercase
  if (opts.numbers)   charset += CHARSETS.numbers
  if (opts.symbols)   charset += CHARSETS.symbols
  if (opts.excludeSimilar)   charset = charset.split('').filter(c => !CHARSETS.similar.includes(c)).join('')
  if (opts.excludeAmbiguous) charset = charset.split('').filter(c => !CHARSETS.ambiguous.includes(c)).join('')
  if (!charset) return ''

  const arr = new Uint32Array(opts.length)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(n => charset[n % charset.length]).join('')
}

function calcEntropy(password: string, opts: PasswordOptions): number {
  let poolSize = 0
  if (opts.uppercase) poolSize += 26
  if (opts.lowercase) poolSize += 26
  if (opts.numbers)   poolSize += 10
  if (opts.symbols)   poolSize += 32
  if (!poolSize) return 0
  return Math.round(password.length * Math.log2(poolSize))
}

interface StrengthInfo {
  label: string
  color: string
  bg: string
  icon: typeof Shield
  pct: number
}

function getStrength(entropy: number): StrengthInfo {
  if (entropy < 28) return { label: 'Very Weak',  color: '#ef4444', bg: '#ef444418', icon: ShieldX,     pct: 10 }
  if (entropy < 36) return { label: 'Weak',        color: '#f97316', bg: '#f9731618', icon: ShieldAlert,  pct: 28 }
  if (entropy < 60) return { label: 'Fair',         color: '#f59e0b', bg: '#f59e0b18', icon: Shield,       pct: 50 }
  if (entropy < 80) return { label: 'Strong',       color: '#22c55e', bg: '#22c55e18', icon: ShieldCheck,  pct: 75 }
  return               { label: 'Very Strong',  color: '#10b981', bg: '#10b98118', icon: ShieldCheck,  pct: 100 }
}

const DEFAULT_OPTS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
}

// ── Component ──────────────────────────────────────────────

export function PasswordGeneratorTool() {
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_OPTS)
  const [password, setPassword] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(1)

  const generate = useCallback(() => {
    const pwd = generatePassword(opts)
    setPassword(pwd)
    if (pwd) setHistory(prev => [pwd, ...prev].slice(0, 10))
  }, [opts])

  const generateBulk = () => {
    const pwds = Array.from({ length: count }, () => generatePassword(opts))
    setHistory(prev => [...pwds, ...prev].slice(0, 10))
    setPassword(pwds[0])
  }

  useEffect(() => { generate() }, [opts])

  const entropy = password ? calcEntropy(password, opts) : 0
  const strength = getStrength(entropy)
  const StrengthIcon = strength.icon

  const handleCopy = async () => {
    await copyToClipboard(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const set = (key: keyof PasswordOptions, val: boolean | number) =>
    setOpts(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-5">
      {/* Password display */}
      <GlassCard hover={false} className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: strength.bg }}>
            <StrengthIcon size={18} style={{ color: strength.color }} />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: strength.color }}>{strength.label}</div>
            <div className="text-xs text-muted-foreground">{entropy} bits of entropy</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={generate}
              className="p-2.5 rounded-xl glass-card hover:border-primary/30 transition-all group">
              <RefreshCw size={14} className="text-muted-foreground group-hover:text-primary transition-colors group-hover:rotate-180 duration-300" />
            </button>
            <button onClick={handleCopy}
              className={cn('p-2.5 rounded-xl transition-all',
                copied ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'glass-card hover:border-primary/30 text-muted-foreground hover:text-primary'
              )}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Password text */}
        <div className="bg-secondary/50 rounded-xl p-4 font-mono text-lg tracking-[0.15em] break-all select-all cursor-text mb-4">
          {password || '—'}
        </div>

        {/* Entropy bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Entropy</span>
            <span>{entropy} / 128 bits</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: strength.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Options */}
      <GlassCard hover={false}>
        <h3 className="font-semibold text-sm mb-4">Options</h3>

        {/* Length slider */}
        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Length</span>
            <span className="font-bold text-primary">{opts.length}</span>
          </div>
          <input type="range" min={4} max={128} value={opts.length}
            onChange={e => set('length', parseInt(e.target.value))}
            className="w-full accent-primary h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>4</span><span>32</span><span>64</span><span>128</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'uppercase',        label: 'Uppercase', desc: 'A-Z' },
            { key: 'lowercase',        label: 'Lowercase', desc: 'a-z' },
            { key: 'numbers',          label: 'Numbers',   desc: '0-9' },
            { key: 'symbols',          label: 'Symbols',   desc: '!@#$…' },
            { key: 'excludeSimilar',   label: 'Exclude Similar',   desc: 'i,l,1,O,0' },
            { key: 'excludeAmbiguous', label: 'Exclude Ambiguous', desc: '{}[]()…' },
          ].map(({ key, label, desc }) => (
            <label key={key} className={cn(
              'flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all border',
              (opts as any)[key] ? 'bg-primary/8 border-primary/30' : 'border-border hover:border-primary/20 bg-secondary/30'
            )}>
              <input type="checkbox" checked={(opts as any)[key]}
                onChange={e => set(key as keyof PasswordOptions, e.target.checked)}
                className="accent-primary w-3.5 h-3.5" />
              <div>
                <div className="text-xs font-semibold">{label}</div>
                <div className="text-[10px] text-muted-foreground">{desc}</div>
              </div>
            </label>
          ))}
        </div>
      </GlassCard>

      {/* Bulk generate */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Bulk Generate</h3>
          <div className="flex items-center gap-2">
            <input type="number" value={count} onChange={e => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              min={1} max={20}
              className="w-16 px-2 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-center focus:border-primary focus:outline-none" />
            <button onClick={generateBulk}
              className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
              Generate
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
            {history.map((pwd, i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-secondary/50 group transition-colors">
                <code className="text-xs font-mono flex-1 truncate">{pwd}</code>
                <button onClick={() => copyToClipboard(pwd)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg">
                  <Copy size={11} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
