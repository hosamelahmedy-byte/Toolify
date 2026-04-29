'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, AlertTriangle, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn, copyToClipboard } from '@/lib/utils'

// ── JWT Engine ─────────────────────────────────────────────

function base64UrlDecode(str: string): string {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=')
    return decodeURIComponent(
      atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
  } catch {
    return ''
  }
}

interface JWTParts {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
  isExpired: boolean
  expiresAt: string | null
  issuedAt: string | null
  algorithm: string
  claims: { key: string; value: string; type: string; description: string }[]
}

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: 'Issuer — who issued the token',
  sub: 'Subject — user or entity the token refers to',
  aud: 'Audience — intended recipients',
  exp: 'Expiration — token expiry timestamp',
  nbf: 'Not Before — token valid from this time',
  iat: 'Issued At — when the token was created',
  jti: 'JWT ID — unique identifier for this token',
  name: 'Full name of the user',
  email: 'Email address',
  role: 'User role or permission level',
  scope: 'OAuth scopes granted',
}

function parseJWT(token: string): JWTParts | null {
  const parts = token.trim().split('.')
  if (parts.length !== 3) return null

  const headerStr = base64UrlDecode(parts[0])
  const payloadStr = base64UrlDecode(parts[1])

  if (!headerStr || !payloadStr) return null

  try {
    const header = JSON.parse(headerStr) as Record<string, unknown>
    const payload = JSON.parse(payloadStr) as Record<string, unknown>

    const now = Math.floor(Date.now() / 1000)
    const exp = typeof payload.exp === 'number' ? payload.exp : null
    const iat = typeof payload.iat === 'number' ? payload.iat : null

    const isExpired = exp !== null ? exp < now : false
    const expiresAt = exp ? new Date(exp * 1000).toLocaleString() : null
    const issuedAt = iat ? new Date(iat * 1000).toLocaleString() : null
    const algorithm = typeof header.alg === 'string' ? header.alg : 'Unknown'

    const claims = Object.entries(payload).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      type: key === 'exp' || key === 'iat' || key === 'nbf' ? 'timestamp' : typeof value,
      description: CLAIM_DESCRIPTIONS[key] || 'Custom claim',
    }))

    return { header, payload, signature: parts[2], isExpired, expiresAt, issuedAt, algorithm, claims }
  } catch {
    return null
  }
}

// ── Component ──────────────────────────────────────────────

const EXAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJBbGljZSBKb2huc29uIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export function JWTDebuggerTool() {
  const [token, setToken] = useState('')
  const [showSig, setShowSig] = useState(false)

  const parsed = useMemo(() => token.trim() ? parseJWT(token.trim()) : null, [token])
  const isValid = token.trim().split('.').length === 3 && parsed !== null
  const isInvalid = token.trim().length > 10 && !isValid

  const parts = token.trim().split('.')
  const COLORS = ['text-rose-400', 'text-violet-400', 'text-emerald-400']

  return (
    <div className="space-y-5">
      {/* Token input */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck size={14} className="text-primary" />
            JWT Token
          </span>
          <div className="flex gap-2">
            <button onClick={() => setToken(EXAMPLE_JWT)}
              className="text-xs px-3 py-1.5 rounded-lg glass-card text-muted-foreground hover:text-foreground transition-colors">
              Load Example
            </button>
            {token && <button onClick={() => setToken('')}
              className="text-xs px-3 py-1.5 rounded-lg glass-card text-muted-foreground hover:text-destructive transition-colors">
              Clear
            </button>}
          </div>
        </div>

        {/* Color-coded token display */}
        {token && (
          <div className="px-4 pt-3 pb-1 font-mono text-xs break-all leading-relaxed">
            {parts.map((part, i) => (
              <span key={i}>
                <span className={COLORS[i]}>{part}</span>
                {i < 2 && <span className="text-muted-foreground">.</span>}
              </span>
            ))}
          </div>
        )}

        <textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Paste your JWT token here…&#10;&#10;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          className="w-full min-h-[120px] p-4 bg-transparent text-sm font-mono resize-y outline-none placeholder:text-muted-foreground/40 leading-relaxed"
          spellCheck={false}
        />

        {/* Status bar */}
        {token && (
          <div className={cn(
            'flex items-center gap-2 px-4 py-2 border-t border-border text-xs font-medium',
            isValid && !parsed?.isExpired ? 'text-emerald-500 bg-emerald-500/5' :
            parsed?.isExpired ? 'text-amber-500 bg-amber-500/5' :
            isInvalid ? 'text-red-500 bg-red-500/5' : 'text-muted-foreground'
          )}>
            {isValid && !parsed?.isExpired && <><ShieldCheck size={12} /> Valid JWT Token</>}
            {parsed?.isExpired && <><AlertTriangle size={12} /> Token Expired</>}
            {isInvalid && <><AlertTriangle size={12} /> Invalid JWT Format</>}
          </div>
        )}
      </GlassCard>

      {/* Decoded sections */}
      <AnimatePresence>
        {parsed && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Expiry info */}
            {(parsed.expiresAt || parsed.issuedAt) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Algorithm', value: parsed.algorithm, color: '#6366f1' },
                  parsed.issuedAt ? { label: 'Issued At', value: parsed.issuedAt, color: '#10b981' } : null,
                  parsed.expiresAt ? { label: 'Expires', value: parsed.expiresAt, color: parsed.isExpired ? '#ef4444' : '#f59e0b' } : null,
                ].filter(Boolean).map(s => s && (
                  <div key={s.label} className="glass-card p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Header */}
            <DecodedSection
              title="Header"
              color="text-rose-400"
              data={parsed.header}
              label="HEADER: ALGORITHM & TOKEN TYPE"
            />

            {/* Payload / Claims */}
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <span className="text-violet-400 font-mono text-xs">PAYLOAD</span>
                  <span className="text-muted-foreground font-normal">: CLAIMS</span>
                </h3>
                <CopyButton text={JSON.stringify(parsed.payload, null, 2)} label="Copy JSON" />
              </div>
              <div className="space-y-2">
                {parsed.claims.map(claim => (
                  <div key={claim.key} className="flex items-start gap-3 p-2.5 rounded-xl bg-secondary/40">
                    <span className="text-xs font-mono font-bold text-violet-400 w-12 shrink-0 mt-0.5">{claim.key}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono break-all">{claim.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{claim.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Signature */}
            <GlassCard hover={false}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">
                  <span className="text-emerald-400 font-mono text-xs">SIGNATURE</span>
                </h3>
                <button onClick={() => setShowSig(!showSig)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {showSig ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showSig ? 'Hide' : 'Show'}
                </button>
              </div>
              {showSig ? (
                <code className="text-xs font-mono text-emerald-400 break-all">{parsed.signature}</code>
              ) : (
                <div className="text-xs text-muted-foreground">
                  ⚠️ Signature verification requires the secret key and cannot be done client-side without exposing it.
                  The signature is used to verify the token hasn't been tampered with.
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DecodedSection({
  title, color, data, label,
}: {
  title: string; color: string; data: Record<string, unknown>; label: string
}) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">
          <span className={cn('font-mono text-xs', color)}>{label}</span>
        </h3>
        <CopyButton text={JSON.stringify(data, null, 2)} label="Copy" />
      </div>
      <pre className="text-xs font-mono leading-relaxed text-foreground/90 whitespace-pre-wrap break-words bg-secondary/30 rounded-xl p-3">
        {JSON.stringify(data, null, 2)}
      </pre>
    </GlassCard>
  )
}
