'use client'

import { useState, useEffect } from 'react'
import { CommandPalette } from '@/components/ui/CommandPalette'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, Zap, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { href: '#tools', label: 'Tools' },
  { href: '/tools/ai-content', label: 'AI Content' },
  { href: '/tools/dev', label: 'Developer' },
  { href: '/tools/calculator', label: 'Calculators' },
  { href: '/blog', label: 'Blog' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-300',
          scrolled
            ? 'py-2 glass-card-heavy border-b border-glass-subtle'
            : 'py-4 bg-transparent'
        )}
      >
        <nav className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-glow-brand">
              <Zap size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold font-display text-lg tracking-tight">
              Tool<span className="gradient-text-static">ify</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Command Palette - Desktop */}
          <div className="hidden md:block"><CommandPalette /></div>
          {/* Search - Mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass-card"
            aria-label="Search tools"
          >
            <Search size={16} />
          </button>

          {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-9 h-9 flex items-center justify-center rounded-xl glass-card hover:border-primary/30 transition-all duration-200"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <Sun size={16} className="text-amber-400" />
                    ) : (
                      <Moon size={16} className="text-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass-card"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[60px] left-4 right-4 z-[var(--z-dropdown)] glass-card-heavy border border-glass rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <Search size={14} />
                Search Tools
              </Link>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

