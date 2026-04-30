'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Weight, User, Ruler, Info, ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

// ── BMI Engine ─────────────────────────────────────────────

interface BMIResult {
  bmi: number
  category: string
  color: string
  description: string
  idealMin: number
  idealMax: number
  weightToLose: number
  weightToGain: number
  healthRisk: string
  tips: string[]
}

const CATEGORIES = [
  { min: 0,    max: 16,   label: 'Severely Underweight', color: '#3b82f6', risk: 'Very High', bg: '#3b82f618' },
  { min: 16,   max: 18.5, label: 'Underweight',          color: '#06b6d4', risk: 'High',      bg: '#06b6d418' },
  { min: 18.5, max: 25,   label: 'Normal Weight',         color: '#22c55e', risk: 'Low',       bg: '#22c55e18' },
  { min: 25,   max: 30,   label: 'Overweight',            color: '#f59e0b', risk: 'Moderate',  bg: '#f59e0b18' },
  { min: 30,   max: 35,   label: 'Obese Class I',         color: '#f97316', risk: 'High',      bg: '#f9731618' },
  { min: 35,   max: 40,   label: 'Obese Class II',        color: '#ef4444', risk: 'Very High', bg: '#ef444418' },
  { min: 40,   max: 999,  label: 'Obese Class III',       color: '#dc2626', risk: 'Extremely High', bg: '#dc262618' },
]

function calcBMI(weight: number, height: number, unit: 'metric' | 'imperial'): BMIResult | null {
  if (!weight || !height) return null

  let bmi: number
  let heightM: number
  let weightKg: number

  if (unit === 'metric') {
    heightM = height / 100
    weightKg = weight
    bmi = weightKg / (heightM * heightM)
  } else {
    // Imperial: weight in lbs, height in inches
    bmi = (703 * weight) / (height * height)
    heightM = height * 0.0254
    weightKg = weight * 0.453592
  }

  bmi = Math.round(bmi * 10) / 10

  const cat = CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || CATEGORIES[CATEGORIES.length - 1]

  // Ideal weight range (BMI 18.5–24.9)
  const idealMin = Math.round(18.5 * heightM * heightM * 10) / 10
  const idealMax = Math.round(24.9 * heightM * heightM * 10) / 10

  const wToLose = weightKg > idealMax ? Math.round((weightKg - idealMax) * 10) / 10 : 0
  const wToGain = weightKg < idealMin ? Math.round((idealMin - weightKg) * 10) / 10 : 0

  const descriptions: Record<string, string> = {
    'Severely Underweight': 'Your BMI indicates severe underweight. Please consult a healthcare professional immediately.',
    'Underweight': 'Your BMI is below the healthy range. Consider consulting a nutritionist to gain weight healthily.',
    'Normal Weight': 'Your BMI is within the healthy range. Maintain your current lifestyle with regular exercise and balanced diet.',
    'Overweight': 'Your BMI is slightly above the healthy range. Moderate diet changes and exercise can help.',
    'Obese Class I': 'Your BMI indicates obesity. Consult a healthcare professional for a weight management plan.',
    'Obese Class II': 'Your BMI indicates significant obesity. Medical consultation is strongly recommended.',
    'Obese Class III': 'Your BMI indicates extreme obesity. Immediate medical attention is advised.',
  }

  const tipsMap: Record<string, string[]> = {
    'Severely Underweight': ['Increase caloric intake by 500–1000 kcal/day', 'Eat protein-rich foods (eggs, meat, legumes)', 'Consult a doctor immediately', 'Avoid intense exercise without medical guidance'],
    'Underweight': ['Add 300–500 kcal/day through nutritious foods', 'Include healthy fats: nuts, avocado, olive oil', 'Strength training helps build muscle mass', 'Eat 5–6 smaller meals throughout the day'],
    'Normal Weight': ['Maintain 150 min of moderate exercise weekly', 'Follow a balanced Mediterranean-style diet', 'Stay hydrated with 8+ glasses of water daily', 'Regular health checkups every 1–2 years'],
    'Overweight': ['Reduce daily calories by 500 kcal for gradual loss', 'Increase vegetables, reduce processed foods', '30 min of cardio exercise daily', 'Track meals with a food diary app'],
    'Obese Class I': ['Consult a registered dietitian for a meal plan', 'Low-impact exercise: walking, swimming, cycling', 'Reduce sugar and saturated fat intake', 'Set realistic goal of 0.5–1 kg loss per week'],
    'Obese Class II': ['Medical supervision strongly recommended', 'Consider behavioral therapy for lifestyle changes', 'Monitor blood pressure and blood sugar regularly', 'Physical therapy may help with safe exercise'],
    'Obese Class III': ['Immediate medical consultation required', 'Discuss all options with your doctor including surgery', 'Mental health support is part of treatment', 'Hospital-based weight management programs'],
  }

  return {
    bmi,
    category: cat.label,
    color: cat.color,
    description: descriptions[cat.label] || '',
    idealMin: unit === 'imperial' ? Math.round(idealMin / 0.453592 * 10) / 10 : idealMin,
    idealMax: unit === 'imperial' ? Math.round(idealMax / 0.453592 * 10) / 10 : idealMax,
    weightToLose: unit === 'imperial' ? Math.round(wToLose / 0.453592 * 10) / 10 : wToLose,
    weightToGain: unit === 'imperial' ? Math.round(wToGain / 0.453592 * 10) / 10 : wToGain,
    healthRisk: cat.risk,
    tips: tipsMap[cat.label] || [],
  }
}

// ── Component ──────────────────────────────────────────────

export function BMICalculatorTool() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')

  const heightInches = useMemo(() => {
    if (unit === 'imperial') {
      const ft = parseFloat(heightFt) || 0
      const inp = parseFloat(heightIn) || 0
      return ft * 12 + inp
    }
    return parseFloat(height) || 0
  }, [unit, height, heightFt, heightIn])

  const result = useMemo(
    () => calcBMI(parseFloat(weight) || 0, heightInches, unit),
    [weight, heightInches, unit]
  )

  const bmiPercent = result
    ? Math.min(100, Math.max(0, ((result.bmi - 10) / (45 - 10)) * 100))
    : 0

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs'
  const heightUnit = unit === 'metric' ? 'cm' : ''

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <GlassCard hover={false} className="p-2 inline-flex rounded-2xl">
        {(['metric', 'imperial'] as const).map(u => (
          <button
            key={u}
            onClick={() => { setUnit(u); setWeight(''); setHeight(''); setHeightFt(''); setHeightIn('') }}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200',
              unit === u
                ? 'bg-primary text-primary-foreground shadow-glow-brand'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {u === 'metric' ? '🌍 Metric (kg/cm)' : '🇺🇸 Imperial (lbs/ft)'}
          </button>
        ))}
      </GlassCard>

      {/* Inputs */}
      <GlassCard hover={false}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <User size={16} className="text-primary" />
          Your Measurements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Weight ({weightUnit})
            </label>
            <div className="relative">
              <Weight size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder={unit === 'metric' ? '70' : '154'}
                min="1"
                max={unit === 'metric' ? '300' : '660'}
                className="w-full pl-9 pr-12 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                {weightUnit}
              </span>
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Height {unit === 'metric' ? '(cm)' : '(ft / in)'}
            </label>
            {unit === 'metric' ? (
              <div className="relative">
                <Ruler size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="175"
                  min="50"
                  max="300"
                  className="w-full pl-9 pr-12 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">cm</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={e => setHeightFt(e.target.value)}
                    placeholder="5"
                    min="1" max="8"
                    className="w-full px-3 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ft</span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={heightIn}
                    onChange={e => setHeightIn(e.target.value)}
                    placeholder="9"
                    min="0" max="11"
                    className="w-full px-3 pr-10 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional: Age & Gender */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Age (optional)
            </label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="25"
              min="2" max="120"
              className="w-full px-3 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Gender (optional)
            </label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(gender === g ? '' : g)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 border',
                    gender === g
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 bg-secondary/50'
                  )}
                >
                  {g === 'male' ? '♂ Male' : '♀ Female'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Main BMI display */}
            <GlassCard hover={false} className="relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{ background: `radial-gradient(circle at 20% 50%, ${result.color}, transparent 70%)` }}
              />
              <div className="relative flex flex-col md:flex-row items-center gap-6">
                {/* Big BMI number */}
                <div className="text-center md:text-left shrink-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Your BMI</div>
                  <motion.div
                    className="text-7xl font-black font-display"
                    style={{ color: result.color }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {result.bmi}
                  </motion.div>
                  <div
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ background: `${result.color}18`, color: result.color }}
                  >
                    {result.category}
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="flex-1 w-full">
                  <div className="relative h-4 rounded-full overflow-hidden mb-2"
                    style={{ background: 'linear-gradient(to right, #3b82f6 0%, #06b6d4 15%, #22c55e 30%, #22c55e 55%, #f59e0b 65%, #f97316 78%, #ef4444 90%, #dc2626 100%)' }}>
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2"
                      style={{ borderColor: result.color }}
                      initial={{ left: '0%' }}
                      animate={{ left: `calc(${bmiPercent}% - 8px)` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                      { label: 'Health Risk', value: result.healthRisk, color: result.color },
                      { label: 'Ideal Weight', value: `${result.idealMin}–${result.idealMax} ${weightUnit}`, color: '#22c55e' },
                      {
                        label: result.weightToLose > 0 ? 'To Lose' : result.weightToGain > 0 ? 'To Gain' : 'On Target',
                        value: result.weightToLose > 0 ? `${result.weightToLose} ${weightUnit}` :
                               result.weightToGain > 0 ? `${result.weightToGain} ${weightUnit}` : '✓',
                        color: result.weightToLose > 0 ? '#f59e0b' : result.weightToGain > 0 ? '#06b6d4' : '#22c55e'
                      },
                    ].map(s => (
                      <div key={s.label} className="text-center p-2 rounded-lg bg-secondary/40">
                        <div className="text-xs text-muted-foreground mb-0.5">{s.label}</div>
                        <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Description + Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${result.color}20` }}>
                    <Info size={15} style={{ color: result.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">What This Means</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h4 className="font-semibold text-sm mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: result.color }}>{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* BMI Category Table */}
            <GlassCard hover={false}>
              <h4 className="font-semibold text-sm mb-4">BMI Classification Table</h4>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.label}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-xl text-sm transition-all',
                      result.category === cat.label ? 'ring-1' : ''
                    )}
                    style={{
                      background: result.category === cat.label ? cat.bg : undefined,
                      outline: result.category === cat.label ? `2px solid ${cat.color}` : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className={result.category === cat.label ? 'font-semibold' : 'text-muted-foreground'}>
                        {cat.label}
                      </span>
                      {result.category === cat.label && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: cat.color, color: '#fff' }}>YOU</span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {cat.max === 999 ? `≥ ${cat.min}` : `${cat.min} – ${cat.max}`}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
              ⚕️ BMI is a screening tool, not a diagnostic measure. For accurate health assessment, consult a qualified healthcare professional. BMI may not account for muscle mass, bone density, or ethnic variations.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

