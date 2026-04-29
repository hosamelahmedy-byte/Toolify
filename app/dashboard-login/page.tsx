'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Fingerprint, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'

// ── Biometric Auth ─────────────────────────────────────────

async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (!window.PublicKeyCredential) return false
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  } catch {
    return false
  }
}

async function registerBiometric(userId: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'Toolify Dashboard', id: window.location.hostname },
        user: {
          id: new TextEncoder().encode(userId),
          name: 'dashboard@toolify',
          displayName: 'Toolify Admin',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    })

    if (credential) {
      // Store credential ID for future auth
      localStorage.setItem('toolify_cred_id', btoa(
        String.fromCharCode(...new Uint8Array((credential as PublicKeyCredential).rawId))
      ))
      return true
    }
    return false
  } catch {
    return false
  }
}

async function authenticateBiometric(): Promise<boolean> {
  try {
    const credIdB64 = localStorage.getItem('toolify_cred_id')
    if (!credIdB64) return false

    const credIdBytes = Uint8Array.from(atob(credIdB64), c => c.charCodeAt(0))
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [{
          id: credIdBytes,
          type: 'public-key',
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    })

    return !!assertion
  } catch {
    return false
  }
}

// ── Login Page ─────────────────────────────────────────────

export default function DashboardLoginPage() {
  const router = useRouter()
  const [password, setPassword]       = useState('')
  const [showPwd, setShowPwd]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [biometricAvail, setBiometricAvail] = useState(false)
  const [biometricReg, setBiometricReg]     = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const [success, setSuccess]         = useState(false)

  useEffect(() => {
    isBiometricAvailable().then(available => {
      setBiometricAvail(available)
      setBiometricReg(!!localStorage.getItem('toolify_cred_id'))
    })
  }, [])

  const setSession = async () => {
    // Set session cookie via API route
    await fetch('/api/dashboard-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'BIOMETRIC_OK' }),
    })
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dashboard-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setSuccess(true)
        // Register biometric on first successful password login
        if (biometricAvail && !biometricReg) {
          setTimeout(async () => {
            const ok = await registerBiometric('toolify-admin')
            if (ok) setBiometricReg(true)
          }, 500)
        }
        setTimeout(() => router.push('/dashboard'), 800)
      } else {
        setError('Incorrect password. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBiometric = async () => {
    setBiometricLoading(true)
    setError('')
    try {
      const ok = await authenticateBiometric()
      if (ok) {
        // Biometric passed — set session via API
        const res = await fetch('/api/dashboard-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ biometric: true }),
        })
        if (res.ok) {
          setSuccess(true)
          setTimeout(() => router.push('/dashboard'), 600)
        } else {
          setError('Biometric auth failed. Use password instead.')
        }
      } else {
        setError('Biometric verification failed. Use password instead.')
      }
    } catch {
      setError('Biometric not available. Use password.')
    } finally {
      setBiometricLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center mesh-bg px-4">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-[80px] bg-primary animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full opacity-15 blur-[60px] bg-emerald-500 animate-float-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <div className="glass-card-heavy rounded-3xl p-8 shadow-glass-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                success ? 'bg-emerald-500/20' : 'bg-primary/10'
              }`}
              animate={success ? { scale: [1, 1.2, 1] } : {}}
            >
              {success
                ? <ShieldCheck size={28} className="text-emerald-500" />
                : <Lock size={28} className="text-primary" />
              }
            </motion.div>
            <h1 className="text-2xl font-bold font-display mb-1">
              {success ? 'Welcome back!' : 'Dashboard Access'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {success ? 'Redirecting to dashboard…' : 'Toolify Admin — Private area'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!success && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Biometric button — shown if registered */}
                {biometricAvail && biometricReg && (
                  <motion.button
                    onClick={handleBiometric}
                    disabled={biometricLoading}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex flex-col items-center gap-2 py-5 rounded-2xl glass-card hover:border-primary/40 transition-all group disabled:opacity-50"
                  >
                    <motion.div
                      animate={biometricLoading ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Fingerprint
                        size={36}
                        className={`transition-colors ${
                          biometricLoading
                            ? 'text-primary animate-pulse'
                            : 'text-muted-foreground group-hover:text-primary'
                        }`}
                      />
                    </motion.div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {biometricLoading ? 'Verifying fingerprint…' : 'Use Fingerprint / Face ID'}
                    </span>
                  </motion.button>
                )}

                {/* Divider */}
                {biometricAvail && biometricReg && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">or use password</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}

                {/* Password form */}
                <form onSubmit={handlePasswordLogin} className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      placeholder="Enter password"
                      autoFocus
                      className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-xs text-red-500 px-1"
                      >
                        <AlertCircle size={12} />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading || !password.trim()}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow-brand"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying…
                      </span>
                    ) : (
                      <>
                        <Lock size={14} />
                        Access Dashboard
                      </>
                    )}
                  </button>
                </form>

                {/* Register biometric hint */}
                {biometricAvail && !biometricReg && (
                  <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                    💡 Login with password once to enable fingerprint access next time
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  )
}
