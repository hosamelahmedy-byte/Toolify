'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TOOLS } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const [query, setQuery] = useState(searchParams.q || '')

  const results = useMemo(() => {
    if (!query.trim()) return TOOLS
    const q = query.toLowerCase()
    return TOOLS.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="section-container py-12">
          <h1 className="text-3xl font-bold font-display mb-6">Search Tools</h1>

          {/* Search input */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tools by name, tag, or category..."
              autoFocus
              className="w-full pl-11 pr-12 py-4 rounded-2xl glass-card text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="mb-3 text-sm text-muted-foreground">
            {results.length} tool{results.length !== 1 ? 's' : ''} found
            {query && ` for "${query}"`}
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {results.map(tool => {
                const Icon = tool.icon
                return (
                  <motion.div
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Link href={`/tools/${tool.slug}`}>
                      <div className="tool-card group h-full">
                        <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', tool.color)}>
                          <Icon size={18} className="text-white" />
                        </div>
                        <h3 className="font-semibold mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {tool.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>

          {results.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-muted-foreground">No tools found for "{query}"</p>
              <button onClick={() => setQuery('')} className="mt-4 text-primary text-sm">Clear search</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
