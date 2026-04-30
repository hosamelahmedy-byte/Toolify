'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const STATS = [
  { value: '20+', label: 'Free Tools' },
  { value: '100K+', label: 'Monthly Users' },
  { value: '100', label: 'PageSpeed Score' },
  { value: '0', label: 'Signup Required' },
]

const BADGES = [
  { icon: Zap, label: 'Instant Results' },
  { icon: Shield, label: 'Privacy First' },
  { icon: Sparkles, label: 'AI-Powered' },
]

// Stagger animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mesh-bg">
      {/* === Floating Orbs === */}
      <motion.div
        className="orb orb-primary absolute top-[10%] left-[5%] w-96 h-96"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-accent absolute top-[20%] right-[8%] w-80 h-80"
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="orb orb-pink absolute bottom-[15%] left-[20%] w-72 h-72"
        animate={{ x: [0, 20, -10, 0], y: [0, -30, 10, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* === Floating Glass Cards (decorative) === */}
      <FloatingCard
        className="absolute top-[12%] right-[6%] hidden lg:flex"
        style={{ animationDelay: '0s' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-500 text-xs">✓</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">BMI Calculated</div>
            <div className="text-xs text-muted-foreground">Normal weight range</div>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="absolute bottom-[20%] left-[4%] hidden lg:flex"
        style={{ animationDelay: '2s' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Sparkles size={14} className="text-violet-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">1,247 words</div>
            <div className="text-xs text-muted-foreground">~5 min read</div>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="absolute top-[40%] right-[3%] hidden xl:flex"
        style={{ animationDelay: '1s' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <span className="text-sky-500 text-xs font-mono">{'{ }'}</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">JSON → TypeBox</div>
            <div className="text-xs text-muted-foreground">12 fields converted</div>
          </div>
        </div>
      </FloatingCard>

      {/* === Main Content === */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center section-container pt-24 pb-16"
      >
        {/* Eyebrow Badge */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <span className="category-badge">
            <Sparkles size={12} className="text-primary" />
            Free Online Tools
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={item}
          className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.05] tracking-tight text-balance mb-6"
        >
          Every Tool You Need,{' '}
          <br className="hidden md:block" />
          <span className="gradient-text">Completely Free</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed"
        >
          Word counters, JSON converters, BMI calculators, SEO generators & more.
          Fast, private, no signup required.
        </motion.p>

        {/* Feature Badges */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {BADGES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground glass-card px-4 py-2"
            >
              <Icon size={14} className="text-primary" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="#tools"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-glow-brand"
          >
            Browse All Tools
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/tools/word-counter"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl glass-card font-semibold text-base hover:border-primary/50 transition-all duration-300"
          >
            Try Word Counter
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div variants={item}>
          <div className="glass-card-heavy inline-flex flex-wrap items-center justify-center gap-8 px-8 py-4 rounded-2xl">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold font-display gradient-text-static">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px h-8 bg-border hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

// Small floating decorative card component
function FloatingCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={cn('glass-card px-4 py-3 animate-float', className)}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

