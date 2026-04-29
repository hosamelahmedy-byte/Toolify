'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight, Flame, Sparkles } from 'lucide-react'
import { TOOLS, CATEGORY_META, type ToolCategory } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

const FILTERS: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'ai-content', label: 'AI Content' },
  { id: 'dev', label: 'Developer' },
  { id: 'calculator', label: 'Calculators' },
]

export function ToolsGrid() {
  const [activeFilter, setActiveFilter] = useState<ToolCategory | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeFilter)

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
            Explore <span className="gradient-text-static">All Tools</span>
          </h2>
          <p className="text-muted-foreground">
            {TOOLS.length} free tools · Updated regularly
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                activeFilter === id
                  ? 'bg-primary text-primary-foreground shadow-glow-brand'
                  : 'glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((tool, i) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href={`/tools/${tool.slug}`} className="block h-full">
                  <div className="tool-card h-full group">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110',
                        tool.color
                      )}
                    >
                      <Icon size={22} className="text-white" />
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      {tool.popular && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Flame size={9} />
                          Popular
                        </span>
                      )}
                      {tool.new && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <Sparkles size={9} />
                          New
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold font-display text-base mb-1.5 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {tool.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-end">
                      <ArrowUpRight
                        size={16}
                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
