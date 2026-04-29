'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingDown, Calendar, Percent, ChevronDown, ChevronUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'

// ── Calculation Engine ─────────────────────────────────────

interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  interestRate: number
  schedule: {
    month: number; payment: number; principal: number
    interest: number; balance: number; cumInterest: number
  }[]
}

function calculateLoan(principal: number, annualRate: number, years: number): LoanResult | null {
  if (!principal || !annualRate || !years) return null
  const r = annualRate / 100 / 12
  const n = years * 12
  const monthly = r === 0
    ? principal / n
    : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const schedule = []
  let balance = principal
  let cumInterest = 0
  for (let m = 1; m <= n; m++) {
    const interest = balance * r
    const pmt = Math.min(monthly, balance + interest)
    const pct = pmt - interest
    balance = Math.max(0, balance - pct)
    cumInterest += interest
    schedule.push({
      month: m,
      payment: Math.round(pmt * 100) / 100,
      principal: Math.round(pct * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      cumInterest: Math.round(cumInterest * 100) / 100,
    })
  }

  return {
    monthlyPayment: Math.round(monthly * 100) / 100,
    totalPayment: Math.round(monthly * n * 100) / 100,
    totalInterest: Math.round((monthly * n - principal) * 100) / 100,
    interestRate: annualRate,
    schedule,
  }
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
const fmtFull = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)

const LOAN_PRESETS = [
  { label: 'Home 30yr',  principal: 350000, rate: 6.5,  years: 30 },
  { label: 'Car 5yr',    principal: 30000,  rate: 5.0,  years: 5  },
  { label: 'Personal',   principal: 10000,  rate: 11.0, years: 3  },
  { label: 'Student',    principal: 45000,  rate: 4.5,  years: 10 },
]

// ── Component ──────────────────────────────────────────────

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState('200000')
  const [rate, setRate]           = useState('6.5')
  const [years, setYears]         = useState('30')
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleLimit, setScheduleLimit] = useState(24)

  const result = useMemo(
    () => calculateLoan(parseFloat(principal), parseFloat(rate), parseFloat(years)),
    [principal, rate, years]
  )

  const principalPct = result
    ? Math.round((parseFloat(principal) / result.totalPayment) * 100)
    : 0
  const interestPct = 100 - principalPct

  const applyPreset = (p: typeof LOAN_PRESETS[0]) => {
    setPrincipal(String(p.principal))
    setRate(String(p.rate))
    setYears(String(p.years))
  }

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {LOAN_PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all">
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <GlassCard hover={false}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Loan Amount', value: principal, setter: setPrincipal, icon: DollarSign, prefix: '$', min: 1000, max: 10000000, step: 1000, placeholder: '200,000' },
            { label: 'Annual Interest Rate', value: rate, setter: setRate, icon: Percent, suffix: '%', min: 0.1, max: 30, step: 0.1, placeholder: '6.5' },
            { label: 'Loan Term', value: years, setter: setYears, icon: Calendar, suffix: 'yrs', min: 1, max: 50, step: 1, placeholder: '30' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">{field.label}</label>
              <div className="relative">
                {field.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">{field.prefix}</span>
                )}
                <field.icon size={14} className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground', field.prefix ? 'left-6' : 'left-3')} />
                <input type="number" value={field.value} onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  min={field.min} max={field.max} step={field.step}
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold"
                />
                {field.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">{field.suffix}</span>
                )}
              </div>
              {/* Range slider */}
              <input type="range" value={field.value} min={field.min} max={field.max} step={field.step}
                onChange={e => field.setter(e.target.value)}
                className="w-full mt-2 accent-primary h-1"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Main result cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Monthly Payment',  value: fmtFull(result.monthlyPayment), color: '#6366f1', icon: DollarSign, subtext: 'per month' },
                { label: 'Total Payment',    value: fmt(result.totalPayment),       color: '#8b5cf6', icon: TrendingDown },
                { label: 'Total Interest',   value: fmt(result.totalInterest),      color: '#ec4899', icon: Percent },
                { label: 'Interest Share',   value: `${interestPct}%`,              color: '#f59e0b', icon: Percent, subtext: 'of total paid' },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value}
                  icon={s.icon} color={s.color} subtext={s.subtext} />
              ))}
            </div>

            {/* Breakdown bar */}
            <GlassCard hover={false}>
              <h3 className="font-semibold text-sm mb-4">Payment Breakdown</h3>
              <div className="relative h-6 rounded-full overflow-hidden flex mb-3">
                <motion.div className="bg-primary flex items-center justify-center text-[10px] font-bold text-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${principalPct}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                  {principalPct > 15 && `${principalPct}%`}
                </motion.div>
                <motion.div className="bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${interestPct}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
                  {interestPct > 15 && `${interestPct}%`}
                </motion.div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span className="text-sm">Principal <span className="font-semibold">{fmt(parseFloat(principal))}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-rose-500" />
                  <span className="text-sm">Interest <span className="font-semibold">{fmt(result.totalInterest)}</span></span>
                </div>
              </div>
            </GlassCard>

            {/* Key milestones */}
            <GlassCard hover={false}>
              <h3 className="font-semibold text-sm mb-3">Key Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { month: Math.round(parseInt(years) * 12 * 0.25), label: '25% paid off' },
                  { month: Math.round(parseInt(years) * 12 * 0.5),  label: 'Halfway point' },
                  { month: parseInt(years) * 12,                     label: 'Loan paid off' },
                ].map(ms => {
                  const row = result.schedule[ms.month - 1]
                  return row ? (
                    <div key={ms.label} className="p-3 rounded-xl bg-secondary/40 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{ms.label}</div>
                      <div className="font-bold text-sm text-primary">Month {ms.month}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Balance: {fmt(row.balance)}</div>
                    </div>
                  ) : null
                })}
              </div>
            </GlassCard>

            {/* Amortization table toggle */}
            <GlassCard hover={false} className="p-0 overflow-hidden">
              <button onClick={() => setShowSchedule(!showSchedule)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors">
                <span className="font-semibold text-sm">
                  Amortization Schedule <span className="text-muted-foreground font-normal">({result.schedule.length} months)</span>
                </span>
                {showSchedule ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence>
                {showSchedule && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-t border-border bg-secondary/30">
                            {['Month','Payment','Principal','Interest','Balance','Cum. Interest'].map(h => (
                              <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.slice(0, scheduleLimit).map((row, i) => (
                            <tr key={row.month} className={cn('border-t border-border/50 hover:bg-secondary/20', i % 12 === 11 && 'bg-primary/3')}>
                              <td className="px-4 py-2 font-mono">{row.month}</td>
                              <td className="px-4 py-2 font-mono">{fmtFull(row.payment)}</td>
                              <td className="px-4 py-2 font-mono text-primary">{fmtFull(row.principal)}</td>
                              <td className="px-4 py-2 font-mono text-rose-500">{fmtFull(row.interest)}</td>
                              <td className="px-4 py-2 font-mono font-semibold">{fmt(row.balance)}</td>
                              <td className="px-4 py-2 font-mono text-muted-foreground">{fmt(row.cumInterest)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {scheduleLimit < result.schedule.length && (
                      <button onClick={() => setScheduleLimit(prev => prev + 24)}
                        className="w-full py-3 text-sm text-primary hover:bg-secondary/20 transition-colors border-t border-border">
                        Show more months ↓
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
