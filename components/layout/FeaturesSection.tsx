'use client'

import { motion } from 'framer-motion'
import { Zap, Lock, Smartphone, Globe, RefreshCw, Code2 } from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'All tools run client-side. Zero server latency.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data never leaves your browser.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Native-like experience on every device.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Globe,
    title: 'SEO Optimized',
    description: 'Each tool has its own optimized page.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Always Updated',
    description: 'New tools added every week.',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
  },
  {
    icon: Code2,
    title: 'Developer Grade',
    description: 'Built for professionals, free for everyone.',
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="section-container py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-card p-4 text-center h-full">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={18} className={f.color} />
                </div>
                <div className="font-semibold text-sm mb-1">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{f.description}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

