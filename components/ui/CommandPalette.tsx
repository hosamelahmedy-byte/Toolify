'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Clock, Heart, Command } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TOOLS } from '@/lib/tools-registry'
import { useToolify } from '@/lib/store'
import { cn } from '@/lib/utils'

// ── Command Palette ────────────────────────────────────────

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { state } = useToolify()

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelected(0)
    }
  }, [open])

  // Filter tools
  const filtered = query.trim()
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 8)
    : TOOLS.filter(t => state.favorites.includes(t.slug)).slice(0, 4)

  const recentTools = query.trim()
    ? []
    : state.recentTools
        .slice(0, 4)
        .map(r => TOOLS.find(t => t.slug === r.slug))
        .filter(Boolean) as typeof TOOLS

  const allResults = query.trim() ? filtered : [...recentTools, ...filtered]

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(prev => Math.min(prev + 1, allResults.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(prev => Math.max(prev - 1, 0))
      }
      if (e.key === 'Enter' && allResults[selected]) {
        router.push(`/tools/${allResults[selected].slug}`)
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, allResults, selected, router])

  return (
    <>
      {/* Trigger button in Navbar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-sm text-muted-foreground hover:text-foreground transition-all hover:border-primary/30"
      >
        <Search size={13} />
        <span>Search tools…</span>
        <kbd className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-secondary font-mono">⌘K</kbd>
      </button>

      {/* Palette Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[var(--z-overlay)] bg-background/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[var(--z-modal)] w-full max-w-lg"
            >
              <div className="glass-card-heavy rounded-2xl overflow-hidden shadow-glass-lg border border-glass">

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search size={16} className="text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelected(0) }}
                    placeholder="Search tools…"
                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  )}
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[380px] overflow-y-auto p-2">
                  {!query && state.recentTools.length > 0 && (
                    <div className="px-2 py-1.5 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Clock size={10} /> Recent
                      </span>
                    </div>
                  )}

                  {!query && state.favorites.length > 0 && recentTools.length > 0 && (
                    <div className="px-2 py-1.5 mt-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Heart size={10} /> Favorites
                      </span>
                    </div>
                  )}

                  {query && filtered.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      No tools found for "{query}"
                    </div>
                  )}

                  {allResults.map((tool, i) => {
                    const Icon = tool.icon
                    const isRecent = !query && i < recentTools.length
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                          i === selected
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-secondary/60'
                        )}
                        onMouseEnter={() => setSelected(i)}
                      >
                        <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', tool.color)}>
                          <Icon size={15} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{tool.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                        </div>
                        {isRecent && <Clock size={11} className="text-muted-foreground shrink-0" />}
                        <ArrowRight size={13} className={cn('shrink-0 transition-opacity', i === selected ? 'opacity-100' : 'opacity-0')} />
                      </Link>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/20">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><kbd className="font-mono px-1 py-0.5 rounded bg-secondary">↑↓</kbd> navigate</span>
                    <span className="flex items-center gap-1"><kbd className="font-mono px-1 py-0.5 rounded bg-secondary">↵</kbd> open</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Command size={9} /> K to toggle
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

