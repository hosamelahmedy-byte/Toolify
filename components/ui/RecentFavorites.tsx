'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Clock, Heart, ArrowRight, Trash2 } from 'lucide-react'
import { useToolify } from '@/lib/store'
import { TOOLS } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

// ── Recent Tools Widget ────────────────────────────────────

export function RecentToolsWidget() {
  const { state } = useToolify()
  const recent = state.recentTools

  if (!recent.length) return null

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={14} className="text-primary" />
        <span className="text-sm font-semibold">Recently Used</span>
      </div>
      <div className="space-y-1.5">
        {recent.slice(0, 5).map((t, i) => {
          const tool = TOOLS.find(tool => tool.slug === t.slug)
          if (!tool) return null
          const Icon = tool.icon
          return (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/tools/${t.slug}`}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/60 transition-colors group"
              >
                <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', tool.color)}>
                  <Icon size={13} className="text-white" />
                </div>
                <span className="text-sm flex-1 truncate group-hover:text-primary transition-colors">
                  {t.name}
                </span>
                <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Favorites Widget ───────────────────────────────────────

export function FavoritesWidget() {
  const { state, toggleFavorite } = useToolify()
  const favorites = state.favorites

  if (!favorites.length) return null

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart size={14} className="text-rose-500 fill-rose-500" />
        <span className="text-sm font-semibold">Favorites</span>
        <span className="text-xs text-muted-foreground ml-auto">{favorites.length}</span>
      </div>
      <div className="space-y-1.5">
        {favorites.map((slug, i) => {
          const tool = TOOLS.find(t => t.slug === slug)
          if (!tool) return null
          const Icon = tool.icon
          return (
            <motion.div
              key={slug}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/60 transition-colors group"
            >
              <Link href={`/tools/${slug}`} className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', tool.color)}>
                  <Icon size={13} className="text-white" />
                </div>
                <span className="text-sm truncate group-hover:text-primary transition-colors">
                  {tool.name}
                </span>
              </Link>
              <button
                onClick={() => toggleFavorite(slug)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={11} />
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Favorite Button (for tool pages) ──────────────────────

export function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useToolify()
  const fav = isFavorite(slug)

  return (
    <motion.button
      onClick={() => toggleFavorite(slug)}
      whileTap={{ scale: 0.85 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200',
        'glass-card',
        fav
          ? 'text-rose-500 border-rose-500/30 bg-rose-500/10'
          : 'text-muted-foreground hover:text-rose-500 hover:border-rose-500/20'
      )}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={{ scale: fav ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart size={14} className={cn('transition-all', fav && 'fill-rose-500')} />
      </motion.div>
      {fav ? 'Saved' : 'Save'}
    </motion.button>
  )
}

