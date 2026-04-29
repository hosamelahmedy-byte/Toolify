'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Flame, Apple, Dumbbell, Info } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'

// ── Calculation Engine ─────────────────────────────────────

const ACTIVITY_LEVELS = [
  { key: 'sedentary',    label: 'Sedentary',         desc: 'Little or no exercise',            multiplier: 1.2   },
  { key: 'light',        label: 'Lightly Active',    desc: 'Exercise 1-3 days/week',           multiplier: 1.375 },
  { key: 'moderate',     label: 'Moderately Active', desc: 'Exercise 3-5 days/week',           multiplier: 1.55  },
  { key: 'very',         label: 'Very Active',       desc: 'Hard exercise 6-7 days/week',      multiplier: 1.725 },
  { key: 'extra',        label: 'Extra Active',      desc: 'Very hard exercise & physical job', multiplier: 1.9   },
]

const GOALS = [
  { key: 'lose_fast',   label: 'Lose Fast',     adj: -1000, desc: 'Lose ~1 kg/week' },
  { key: 'lose',        label: 'Lose Weight',   adj: -500,  desc: 'Lose ~0.5 kg/week' },
  { key: 'maintain',    label: 'Maintain',      adj: 0,     desc: 'Keep current weight' },
  { key: 'gain',        label: 'Gain Muscle',   adj: +300,  desc: 'Lean bulk' },
  { key: 'gain_fast',   label: 'Gain Fast',     adj: +500,  desc: 'Bulk ~0.5 kg/week' },
]

interface BMRResult {
  bmr: number
  tdee: number
  targetCalories: number
  protein: number    // grams
  carbs: number      // grams
  fat: number        // grams
  bmi: number
  bmiCategory: string
  idealWeightMin: number
  idealWeightMax: number
}

function calculate(
  weight: number, height: number, age: number,
  gender: 'male' | 'female', activityKey: string, goalKey: string,
  unit: 'metric' | 'imperial'
): BMRResult {
  // Convert imperial to metric
  const weightKg = unit === 'imperial' ? weight * 0.453592 : weight
  const heightCm = unit === 'imperial' ? height * 2.54 : height

  // Mifflin-St Jeor formula
  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161

  const activity = ACTIVITY_LEVELS.find(a => a.key === activityKey) || ACTIVITY_LEVELS[1]
  const goal = GOALS.find(g => g.key === goalKey) || GOALS[2]

  const tdee = Math.round(bmr * activity.multiplier)
  const targetCalories = Math.max(1200, tdee + goal.adj)

  // Macros (protein: 30%, carbs: 40%, fat: 30%)
  const protein = Math.round((targetCalories * 0.30) / 4)
  const carbs   = Math.round((targetCalories * 0.40) / 4)
  const fat     = Math.round((targetCalories * 0.30) / 9)

  // BMI
  const heightM = heightCm / 100
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10
  const bmiCategory =
    bmi < 18.5 ? 'Underweight' :
    bmi < 25   ? 'Normal weight' :
    bmi < 30   ? 'Overweight' : 'Obese'

  // Ideal weight (BMI 18.5-24.9)
  const idealWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10
  const idealWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10

  return {
    bmr: Math.round(bmr), tdee, targetCalories,
    protein, carbs, fat, bmi, bmiCategory,
    idealWeightMin: unit === 'imperial' ? Math.round(idealWeightMin / 0.453592 * 10) / 10 : idealWeightMin,
    idealWeightMax: unit === 'imperial' ? Math.round(idealWeightMax / 0.453592 * 10) / 10 : idealWeightMax,
  }
}

// ── Component ──────────────────────────────────────────────

export function BMRCalculatorTool() {
  const [unit, setUnit]       = useState<'metric' | 'imperial'>('metric')
  const [gender, setGender]   = useState<'male' | 'female'>('male')
  const [age, setAge]         = useState('25')
  const [weight, setWeight]   = useState('70')
  const [height, setHeight]   = useState('175')
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal]       = useState('maintain')

  const wUnit = unit === 'metric' ? 'kg' : 'lbs'
  const hUnit = unit === 'metric' ? 'cm' : 'in'

  const result = useMemo(() => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age)
    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return null
    return calculate(w, h, a, gender, activity, goal, unit)
  }, [weight, height, age, gender, activity, goal, unit])

  const MACROS = result ? [
    { label: 'Protein', value: result.protein, unit: 'g', color: '#6366f1', pct: 30, desc: '4 kcal/g · muscle building & repair' },
    { label: 'Carbs',   value: result.carbs,   unit: 'g', color: '#f59e0b', pct: 40, desc: '4 kcal/g · primary energy source' },
    { label: 'Fat',     value: result.fat,     unit: 'g', color: '#10b981', pct: 30, desc: '9 kcal/g · hormones & absorption' },
  ] : []

  return (
    <div className="space-y-5">
      {/* Unit + Gender */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard hover={false} className="p-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Units</label>
          <div className="flex gap-1.5">
            {(['metric', 'imperial'] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={cn('flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all',
                  unit === u ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                )}>
                {u === 'metric' ? '🌍 Metric' : '🇺🇸 Imperial'}
              </button>
            ))}
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Gender</label>
          <div className="flex gap-1.5">
            {(['male', 'female'] as const).map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={cn('flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all',
                  gender === g ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                )}>
                {g === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Inputs */}
      <GlassCard hover={false}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: `Weight (${wUnit})`, value: weight, setter: setWeight, placeholder: unit === 'metric' ? '70' : '154' },
            { label: `Height (${hUnit})`, value: height, setter: setHeight, placeholder: unit === 'metric' ? '175' : '69' },
            { label: 'Age (years)',       value: age,    setter: setAge,    placeholder: '25' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
              <input type="number" value={f.value} onChange={e => f.setter(e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold" />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Activity */}
      <GlassCard hover={false}>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Activity Level</label>
        <div className="space-y-2">
          {ACTIVITY_LEVELS.map(a => (
            <label key={a.key} className={cn(
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border',
              activity === a.key ? 'bg-primary/8 border-primary/30' : 'border-transparent hover:bg-secondary/50'
            )}>
              <input type="radio" name="activity" value={a.key} checked={activity === a.key}
                onChange={() => setActivity(a.key)} className="accent-primary" />
              <div>
                <div className="text-sm font-semibold">{a.label}</div>
                <div className="text-xs text-muted-foreground">{a.desc} · ×{a.multiplier}</div>
              </div>
            </label>
          ))}
        </div>
      </GlassCard>

      {/* Goal */}
      <GlassCard hover={false}>
        <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Your Goal</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {GOALS.map(g => (
            <button key={g.key} onClick={() => setGoal(g.key)}
              className={cn('p-2.5 rounded-xl text-center transition-all border text-xs',
                goal === g.key ? 'bg-primary/10 border-primary/40 text-primary font-semibold' : 'border-border text-muted-foreground hover:border-primary/20'
              )}>
              <div className="font-semibold">{g.label}</div>
              <div className="text-[10px] mt-0.5 opacity-70">{g.desc}</div>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Main stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'BMR',             value: `${result.bmr} kcal`,   color: '#6366f1', icon: Flame,    subtext: 'Basal Metabolic Rate' },
                { label: 'TDEE',            value: `${result.tdee} kcal`,  color: '#8b5cf6', icon: Activity, subtext: 'Total Daily Energy' },
                { label: 'Target Calories', value: `${result.targetCalories} kcal`, color: '#10b981', icon: Apple, subtext: GOALS.find(g => g.key === goal)?.desc },
                { label: 'BMI',             value: `${result.bmi}`,        color: '#f59e0b', icon: Dumbbell, subtext: result.bmiCategory },
              ].map(s => (
                <StatCard key={s.label} label={s.label} value={s.value}
                  icon={s.icon} color={s.color} subtext={s.subtext} />
              ))}
            </div>

            {/* Macros */}
            <GlassCard hover={false}>
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Apple size={14} className="text-primary" />
                Daily Macronutrients
                <span className="text-xs text-muted-foreground font-normal">for {result.targetCalories} kcal target</span>
              </h3>

              {/* Macro bar */}
              <div className="relative h-5 rounded-full overflow-hidden flex mb-4">
                {MACROS.map(m => (
                  <motion.div key={m.label}
                    initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: m.color }}>
                    {m.pct}%
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                {MACROS.map(m => (
                  <div key={m.label} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: m.color }} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">{m.label}</span>
                        <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}g</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: m.color }}
                          initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.6 }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Ideal weight */}
            <GlassCard hover={false}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Info size={14} className="text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Ideal Weight Range</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your height, your ideal weight is{' '}
                    <strong className="text-foreground">{result.idealWeightMin}–{result.idealWeightMax} {wUnit}</strong>{' '}
                    (BMI 18.5–24.9).
                  </p>
                </div>
              </div>
            </GlassCard>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              ⚕️ Calculated using the Mifflin-St Jeor equation (most accurate for most adults).
              Consult a healthcare professional before making significant dietary changes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
