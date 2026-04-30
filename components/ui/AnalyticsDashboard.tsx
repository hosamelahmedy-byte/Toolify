'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, Users, Globe, DollarSign, Activity,
  Eye, MousePointer, Clock, BarChart2, Zap, ArrowUp, ArrowDown
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { useToolify } from '@/lib/store'
import { TOOLS } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

// ── Mock Analytics Engine ──────────────────────────────────
// In production: replace with Vercel Analytics API or Supabase

interface DayStats {
  date: string
  visitors: number
  pageviews: number
  toolUses: number
}

interface CountryStats {
  country: string
  flag: string
  visitors: number
  pct: number
}

interface ToolStats {
  slug: string
  name: string
  uses: number
  pct: number
  color: string
}

interface AdRevenue {
  type: string
  rpm: number
  visitors: number
  revenue: number
}

// Generate realistic demo data
function generateDemoData() {
  const days: DayStats[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const base = 800 + Math.sin(i * 0.4) * 200 + Math.random() * 300
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Math.round(base),
      pageviews: Math.round(base * 2.3),
      toolUses: Math.round(base * 1.8),
    })
  }

  const countries: CountryStats[] = [
    { country: 'United States', flag: '🇺🇸', visitors: 8420, pct: 32 },
    { country: 'India',         flag: '🇮🇳', visitors: 4200, pct: 16 },
    { country: 'United Kingdom',flag: '🇬🇧', visitors: 2100, pct: 8  },
    { country: 'Germany',       flag: '🇩🇪', visitors: 1680, pct: 6.4},
    { country: 'Brazil',        flag: '🇧🇷', visitors: 1470, pct: 5.6},
    { country: 'France',        flag: '🇫🇷', visitors: 1260, pct: 4.8},
    { country: 'Canada',        flag: '🇨🇦', visitors: 1050, pct: 4  },
    { country: 'Australia',     flag: '🇦🇺', visitors:  840, pct: 3.2},
    { country: 'Saudi Arabia',  flag: '🇸🇦', visitors:  735, pct: 2.8},
    { country: 'Others',        flag: '🌍', visitors: 4445, pct: 17  },
  ]

  const toolStats: ToolStats[] = [
    { slug: 'word-counter',      name: 'Word Counter',      uses: 4820, pct: 24, color: '#6366f1' },
    { slug: 'pdf-merge',         name: 'PDF Merge',         uses: 3640, pct: 18, color: '#ef4444' },
    { slug: 'bmi-calculator',    name: 'BMI Calculator',    uses: 2820, pct: 14, color: '#22c55e' },
    { slug: 'json-to-zod',       name: 'JSON → Zod',        uses: 2200, pct: 11, color: '#10b981' },
    { slug: 'password-generator',name: 'Password Gen',      uses: 1960, pct: 9.8,color: '#8b5cf6' },
    { slug: 'compress-pdf',      name: 'Compress PDF',      uses: 1640, pct: 8.2,color: '#f59e0b' },
    { slug: 'unit-converter',    name: 'Unit Converter',    uses: 1200, pct: 6, color: '#0ea5e9' },
    { slug: 'jwt-debugger',      name: 'JWT Debugger',      uses:  920, pct: 4.6,color: '#64748b' },
  ]

  return { days, countries, toolStats }
}

// ── Mini Chart Component ───────────────────────────────────

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 120
  const h = 40
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── Bar Chart ──────────────────────────────────────────────

function BarChart({ data, color }: { data: DayStats[]; field: keyof DayStats; color: string }) {
  const values = data.map(d => d.visitors)
  const max = Math.max(...values)

  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.slice(-30).map((d, i) => {
        const h = Math.round((d.visitors / max) * 100)
        const isToday = i === data.length - 1
        return (
          <motion.div
            key={d.date}
            title={`${d.date}: ${d.visitors.toLocaleString()} visitors`}
            className="flex-1 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: isToday ? color : `${color}60`, minWidth: 2 }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.01, duration: 0.4 }}
          />
        )
      })}
    </div>
  )
}

// ── Revenue Calculator ─────────────────────────────────────

function calcRevenue(visitors: number, adType: string): AdRevenue[] {
  const configs: AdRevenue[] = [
    { type: 'Google AdSense Display',  rpm: 2.5,  visitors, revenue: 0 },
    { type: 'AdSense Auto Ads',        rpm: 4.0,  visitors, revenue: 0 },
    { type: 'Media.net',               rpm: 3.0,  visitors, revenue: 0 },
    { type: 'Ezoic',                   rpm: 6.5,  visitors, revenue: 0 },
    { type: 'Mediavine (10k+ sessions)', rpm: 12.0, visitors, revenue: 0 },
  ]
  return configs.map(c => ({ ...c, revenue: Math.round((visitors / 1000) * c.rpm * 100) / 100 }))
}

// ── Main Dashboard Component ───────────────────────────────

const PERIODS = ['7d', '30d', '90d'] as const
type Period = typeof PERIODS[number]

export function AnalyticsDashboard() {
  const { state } = useToolify()
  const [period, setPeriod] = useState<Period>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'geo' | 'revenue'>('overview')
  const [adType, setAdType] = useState('AdSense Auto Ads')

  const data = useMemo(() => generateDemoData(), [])

  const periodDays = { '7d': 7, '30d': 30, '90d': 90 }[period]
  const slice = data.days.slice(-periodDays)

  const totalVisitors  = slice.reduce((s, d) => s + d.visitors, 0)
  const totalPageviews = slice.reduce((s, d) => s + d.pageviews, 0)
  const totalToolUses  = slice.reduce((s, d) => s + d.toolUses, 0)
  const avgDaily       = Math.round(totalVisitors / periodDays)
  const bounceRate     = 34.2
  const avgSession     = '2m 18s'

  // Week-over-week change
  const half = Math.floor(slice.length / 2)
  const firstHalf  = slice.slice(0, half).reduce((s, d) => s + d.visitors, 0)
  const secondHalf = slice.slice(half).reduce((s, d) => s + d.visitors, 0)
  const growthPct  = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0

  const revenues = calcRevenue(totalVisitors, adType)
  const selectedRevenue = revenues.find(r => r.type === adType) || revenues[1]

  // Real recent tools from store
  const recentSlugs = state.recentTools.map(t => t.slug)

  return (
    <div className="space-y-6">
      {/* Demo notice */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
        <Zap size={14} className="text-amber-500 shrink-0" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Demo Mode</strong> — Connect Vercel Analytics or Supabase to see real data.
          Recent Tools shown below are from your actual session.
        </span>
      </div>

      {/* Period selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold font-display">Analytics Overview</h2>
        <div className="flex gap-1.5">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn('px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                period === p ? 'bg-primary text-primary-foreground' : 'glass-card text-muted-foreground hover:text-foreground'
              )}>
              Last {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Visitors',    value: totalVisitors.toLocaleString(),  color: '#6366f1', icon: Users,        subtext: `+${growthPct}% vs prev` },
          { label: 'Page Views',  value: totalPageviews.toLocaleString(), color: '#8b5cf6', icon: Eye,          subtext: `${(totalPageviews/totalVisitors).toFixed(1)} per visit` },
          { label: 'Tool Uses',   value: totalToolUses.toLocaleString(),  color: '#10b981', icon: MousePointer, subtext: `${(totalToolUses/totalVisitors).toFixed(1)} per visitor` },
          { label: 'Daily Avg',   value: avgDaily.toLocaleString(),       color: '#f59e0b', icon: TrendingUp,   subtext: 'visitors/day' },
          { label: 'Bounce Rate', value: `${bounceRate}%`,                color: '#ec4899', icon: Activity,     subtext: 'below average ✓' },
          { label: 'Avg Session', value: avgSession,                      color: '#0ea5e9', icon: Clock,        subtext: 'time on site' },
        ].map(s => (
          <StatCard key={s.label} label={s.label} value={s.value}
            icon={s.icon} color={s.color} subtext={s.subtext} />
        ))}
      </div>

      {/* Growth indicator */}
      <GlassCard hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BarChart2 size={14} className="text-primary" />
            Visitor Trend — Last {period}
          </h3>
          <div className={cn('flex items-center gap-1 text-sm font-semibold',
            growthPct >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {growthPct >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(growthPct)}% vs previous period
          </div>
        </div>
        <BarChart data={slice} field="visitors" color="#6366f1" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{slice[0]?.date}</span>
          <span>{slice[slice.length - 1]?.date}</span>
        </div>
      </GlassCard>

      {/* Tabs */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'tools',    label: '🛠️ Top Tools' },
            { id: 'geo',      label: '🌍 Geography' },
            { id: 'revenue',  label: '💰 Revenue Est.' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={cn('flex-1 min-w-max py-3 px-4 text-sm font-medium transition-all whitespace-nowrap',
                activeTab === t.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Traffic sources */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Traffic Sources</h4>
                  {[
                    { label: 'Organic Search', pct: 58, color: '#22c55e' },
                    { label: 'Direct',          pct: 22, color: '#6366f1' },
                    { label: 'Social Media',    pct: 12, color: '#ec4899' },
                    { label: 'Referral',        pct:  8, color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{s.label}</span>
                        <span className="font-semibold" style={{ color: s.color }}>{s.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: s.color }}
                          initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Device breakdown */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Devices</h4>
                  {[
                    { label: 'Mobile',  pct: 62, icon: '📱', color: '#6366f1' },
                    { label: 'Desktop', pct: 31, icon: '💻', color: '#10b981' },
                    { label: 'Tablet',  pct:  7, icon: '📟', color: '#f59e0b' },
                  ].map(d => (
                    <div key={d.label} className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-secondary/30">
                      <span className="text-lg">{d.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{d.label}</span>
                          <span style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <div className="h-1 bg-secondary rounded-full">
                          <motion.div className="h-full rounded-full" style={{ background: d.color }}
                            initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.5 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your session */}
              {state.recentTools.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Clock size={13} className="text-primary" />
                    Your Session — Tools Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {state.recentTools.map(t => {
                      const tool = TOOLS.find(tool => tool.slug === t.slug)
                      if (!tool) return null
                      const Icon = tool.icon
                      return (
                        <div key={t.slug} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-card text-xs">
                          <div className={cn('w-4 h-4 rounded-md bg-gradient-to-br flex items-center justify-center', tool.color)}>
                            <Icon size={9} className="text-white" />
                          </div>
                          {t.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TOOLS TAB */}
          {activeTab === 'tools' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">Most used tools in the last {period}</p>
              {data.toolStats.map((t, i) => (
                <div key={t.slug} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.uses.toLocaleString()} uses · {t.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: t.color }}
                        initial={{ width: 0 }} animate={{ width: `${t.pct}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* GEO TAB */}
          {activeTab === 'geo' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <p className="text-xs text-muted-foreground mb-4">Top countries by visitor count</p>
              {data.countries.map((c, i) => (
                <div key={c.country} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 transition-colors">
                  <span className="text-lg shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{c.country}</span>
                      <span className="text-xs text-muted-foreground">{c.visitors.toLocaleString()} · {c.pct}%</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }} animate={{ width: `${c.pct}%` }}
                        transition={{ delay: i * 0.04, duration: 0.5 }} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* REVENUE TAB */}
          {activeTab === 'revenue' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="p-4 rounded-2xl bg-secondary/40 text-center">
                <div className="text-xs text-muted-foreground mb-1">Estimated monthly revenue with</div>
                <div className="text-3xl font-bold font-display text-emerald-500">
                  ${selectedRevenue.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  based on {totalVisitors.toLocaleString()} visitors · RPM ${selectedRevenue.rpm}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3">Choose Ad Network</h4>
                <div className="space-y-2">
                  {revenues.map(r => (
                    <label key={r.type}
                      className={cn('flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border',
                        adType === r.type ? 'bg-primary/8 border-primary/30' : 'border-border hover:bg-secondary/40'
                      )}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="adtype" checked={adType === r.type}
                          onChange={() => setAdType(r.type)} className="accent-primary" />
                        <div>
                          <div className="text-sm font-medium">{r.type}</div>
                          <div className="text-xs text-muted-foreground">RPM: ${r.rpm}</div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-500">${r.revenue.toLocaleString()}/mo</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
                <p><strong className="text-foreground">RPM</strong> = Revenue Per Mille (per 1,000 visitors). Actual revenue depends on your niche, visitor location, ad placement, and seasonality. Developer/tech tools typically earn higher RPMs.</p>
              </div>
            </motion.div>
          )}

        </div>
      </GlassCard>
    </div>
  )
}

