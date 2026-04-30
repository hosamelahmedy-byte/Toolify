'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Gift, Clock, Star, Zap } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'

// ── Age Engine ─────────────────────────────────────────────

interface AgeResult {
  years: number; months: number; days: number; hours: number
  totalDays: number; totalMonths: number; totalHours: number
  totalMinutes: number; totalSeconds: number; totalWeeks: number
  nextBirthdayDays: number; nextBirthdayDate: string
  dayOfWeek: string; birthstone: string; zodiac: string
  lifePercent: number; season: string
  heartbeats: number; breaths: number; sleepDays: number
  ageGroup: string; ageGroupColor: string
}

const ZODIAC = [
  { sign: 'Capricorn', symbol: '♑', start: [12, 22] },
  { sign: 'Aquarius',  symbol: '♒', start: [1,  20] },
  { sign: 'Pisces',    symbol: '♓', start: [2,  19] },
  { sign: 'Aries',     symbol: '♈', start: [3,  21] },
  { sign: 'Taurus',    symbol: '♉', start: [4,  20] },
  { sign: 'Gemini',    symbol: '♊', start: [5,  21] },
  { sign: 'Cancer',    symbol: '♋', start: [6,  21] },
  { sign: 'Leo',       symbol: '♌', start: [7,  23] },
  { sign: 'Virgo',     symbol: '♍', start: [8,  23] },
  { sign: 'Libra',     symbol: '♎', start: [9,  23] },
  { sign: 'Scorpio',   symbol: '♏', start: [10, 23] },
  { sign: 'Sagittarius',symbol:'♐', start: [11, 22] },
]

const BIRTHSTONES = ['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise']
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const SEASONS = [
  { name: 'Winter ❄️', months: [12, 1, 2] },
  { name: 'Spring 🌸', months: [3, 4, 5] },
  { name: 'Summer ☀️', months: [6, 7, 8] },
  { name: 'Autumn 🍂', months: [9, 10, 11] },
]

function getZodiac(month: number, day: number): string {
  const z = ZODIAC.find((_, i) => {
    const [m, d] = ZODIAC[i].start
    const [nm, nd] = ZODIAC[(i + 1) % 12].start
    const afterStart = month > m || (month === m && day >= d)
    const beforeEnd = nm === 1 ? month === 12 || month < nm || (month === nm && day < nd)
      : month < nm || (month === nm && day < nd)
    return afterStart && beforeEnd
  })
  return z ? `${z.symbol} ${z.sign}` : '♑ Capricorn'
}

function calcAge(birthStr: string, toStr?: string): AgeResult | null {
  if (!birthStr) return null
  const birth = new Date(birthStr)
  const to = toStr ? new Date(toStr) : new Date()
  if (isNaN(birth.getTime()) || birth > to) return null

  const diff = to.getTime() - birth.getTime()
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))

  let years = to.getFullYear() - birth.getFullYear()
  let months = to.getMonth() - birth.getMonth()
  let days = to.getDate() - birth.getDate()

  if (days < 0) {
    months--
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) { years--; months += 12 }

  // Next birthday
  const nextBday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBday <= to) nextBday.setFullYear(to.getFullYear() + 1)
  const nextBirthdayDays = Math.ceil((nextBday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24))
  const nextBirthdayDate = nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const ageGroup = years < 13 ? 'Child' : years < 18 ? 'Teenager' : years < 30 ? 'Young Adult' : years < 60 ? 'Adult' : 'Senior'
  const ageGroupColor = years < 13 ? '#22c55e' : years < 18 ? '#3b82f6' : years < 30 ? '#6366f1' : years < 60 ? '#f59e0b' : '#ec4899'

  const season = SEASONS.find(s => s.months.includes(birth.getMonth() + 1))?.name || 'Winter ❄️'

  return {
    years, months, days,
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    totalDays, totalWeeks: Math.floor(totalDays / 7),
    totalMonths: years * 12 + months,
    totalHours: Math.floor(diff / (1000 * 60 * 60)),
    totalMinutes: Math.floor(diff / (1000 * 60)),
    totalSeconds: Math.floor(diff / 1000),
    nextBirthdayDays, nextBirthdayDate,
    dayOfWeek: DAYS[birth.getDay()],
    birthstone: BIRTHSTONES[birth.getMonth()],
    zodiac: getZodiac(birth.getMonth() + 1, birth.getDate()),
    lifePercent: Math.round((years / 80) * 100),
    season,
    heartbeats: Math.round(totalDays * 24 * 60 * 70),
    breaths: Math.round(totalDays * 24 * 60 * 16),
    sleepDays: Math.round(totalDays * 0.33),
    ageGroup, ageGroupColor,
  }
}

// ── Component ──────────────────────────────────────────────

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState('')
  const [toDate, setToDate] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const result = useMemo(() => calcAge(birthDate, toDate || undefined), [birthDate, toDate])

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <GlassCard hover={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">Date of Birth *</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                max={today}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Calculate Age On <span className="text-xs text-muted-foreground">(optional — defaults to today)</span>
            </label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                placeholder={today}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Main age display */}
            <GlassCard hover={false} className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ background: `radial-gradient(circle at 20% 50%, ${result.ageGroupColor}, transparent 70%)` }} />
              <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Your Age</div>
                  <div className="flex items-end gap-2 justify-center md:justify-start">
                    <motion.span className="text-7xl font-black font-display" style={{ color: result.ageGroupColor }}
                      initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                      {result.years}
                    </motion.span>
                    <span className="text-2xl font-bold text-muted-foreground pb-2">yrs</span>
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {result.months} months, {result.days} days
                    {result.hours > 0 && `, ${result.hours} hrs`}
                  </div>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ background: `${result.ageGroupColor}18`, color: result.ageGroupColor }}>
                    {result.ageGroup}
                  </span>
                </div>

                {/* Birthday countdown */}
                <div className="md:ml-auto glass-card p-5 text-center min-w-[160px]">
                  <Gift size={20} className="text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold font-display text-primary">{result.nextBirthdayDays}</div>
                  <div className="text-xs text-muted-foreground">days to birthday</div>
                  <div className="text-xs text-foreground mt-1 font-medium">{result.nextBirthdayDate}</div>
                </div>
              </div>
            </GlassCard>

            {/* Total time */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Days',   value: result.totalDays.toLocaleString(),    color: '#6366f1', icon: Calendar },
                { label: 'Total Weeks',  value: result.totalWeeks.toLocaleString(),   color: '#8b5cf6', icon: Calendar },
                { label: 'Total Months', value: result.totalMonths.toLocaleString(),  color: '#a855f7', icon: Clock },
                { label: 'Total Hours',  value: result.totalHours.toLocaleString(),   color: '#ec4899', icon: Clock },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
              ))}
            </div>

            {/* Bio facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Star size={14} className="text-primary" /> Birth Details
                </h4>
                <div className="space-y-2">
                  {[
                    ['Day of Week', result.dayOfWeek],
                    ['Season Born', result.season],
                    ['Zodiac Sign', result.zodiac],
                    ['Birthstone',  `💎 ${result.birthstone}`],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{k}</span>
                      <span className="text-sm font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-primary" /> Fun Life Stats
                </h4>
                <div className="space-y-2">
                  {[
                    ['Heartbeats',    `~${(result.heartbeats / 1e9).toFixed(2)}B`],
                    ['Breaths taken', `~${(result.breaths / 1e6).toFixed(1)}M`],
                    ['Days asleep',   `~${result.sleepDays.toLocaleString()} days`],
                    ['Life lived',    `~${result.lifePercent}% (of 80yr avg)`],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between py-1.5 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{k}</span>
                      <span className="text-sm font-semibold text-primary">{v}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

