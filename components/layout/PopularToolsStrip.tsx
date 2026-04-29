'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import { TOOLS } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

const POPULAR = TOOLS.filter(t => t.popular).slice(0, 4)

export function PopularToolsStrip() {
  return (
    <section className="section-container py-8">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} className="text-amber-500" />
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Most Popular</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {POPULAR.map((tool, i) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <div className="glass-card p-4 flex items-center gap-3 group hover:border-primary/30 transition-all">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', tool.color)}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{tool.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{tool.tags.slice(0, 2).join(' · ')}</div>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
