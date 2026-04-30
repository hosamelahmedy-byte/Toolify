'use client'

/**
 * LazyTool — Lazy-loads any tool component with a skeleton placeholder.
 *
 * Usage:
 *   import dynamic from 'next/dynamic'
 *   const WordCounterTool = dynamic(
 *     () => import('@/components/tools/WordCounterTool').then(m => m.WordCounterTool),
 *     { loading: () => <ToolSkeleton />, ssr: false }
 *   )
 *
 * This file exports:
 *   - ToolSkeleton   : generic loading placeholder
 *   - withLazyTool   : HOC helper (optional)
 */

import { cn } from '@/lib/utils'

interface ToolSkeletonProps {
  rows?: number
  showStats?: boolean
  className?: string
}

export function ToolSkeleton({ rows = 4, showStats = true, className }: ToolSkeletonProps) {
  return (
    <div className={cn('space-y-5 animate-pulse', className)}>
      {/* Textarea / main input skeleton */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="h-4 w-24 bg-secondary rounded-full" />
          <div className="flex gap-2">
            <div className="h-7 w-16 bg-secondary rounded-lg" />
            <div className="h-7 w-14 bg-secondary rounded-lg" />
          </div>
        </div>
        <div className="p-4 space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 bg-secondary rounded-full"
              style={{ width: `${75 + Math.sin(i * 1.7) * 20}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between px-4 py-2 border-t border-border bg-secondary/20">
          <div className="h-3 w-28 bg-secondary rounded-full" />
          <div className="h-3 w-32 bg-secondary rounded-full" />
        </div>
      </div>

      {/* Stats row */}
      {showStats && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-xl" />
              <div className="h-5 w-10 bg-secondary rounded-full" />
              <div className="h-3 w-14 bg-secondary rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="h-4 w-28 bg-secondary rounded-full" />
            <div className="h-2 w-full bg-secondary rounded-full" />
            <div className="h-8 w-16 bg-secondary rounded-lg" />
            <div className="h-3 w-full bg-secondary rounded-full" />
            <div className="h-3 w-3/4 bg-secondary rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Calculator-style skeleton (fewer text rows, more number blocks) */
export function CalcSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-5 animate-pulse', className)}>
      {/* Toggle */}
      <div className="inline-flex gap-2 glass-card p-2 rounded-2xl">
        <div className="h-9 w-32 bg-secondary rounded-xl" />
        <div className="h-9 w-32 bg-secondary rounded-xl" />
      </div>

      {/* Inputs */}
      <div className="glass-card p-6">
        <div className="h-4 w-36 bg-secondary rounded-full mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-secondary rounded-full" />
              <div className="h-12 bg-secondary rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-secondary rounded-full" />
          <div className="h-16 w-24 bg-secondary rounded-xl" />
          <div className="h-6 w-28 bg-secondary rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-full bg-secondary rounded-full" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-secondary rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Code editor skeleton */
export function EditorSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-5 animate-pulse', className)}>
      {/* Toolbar */}
      <div className="glass-card p-4 flex gap-3">
        <div className="h-9 w-36 bg-secondary rounded-xl" />
        <div className="h-9 w-28 bg-secondary rounded-xl" />
        <div className="ml-auto flex gap-2">
          <div className="h-9 w-20 bg-secondary rounded-xl" />
          <div className="h-9 w-20 bg-secondary rounded-xl" />
        </div>
      </div>

      {/* Dual editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="glass-card p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="flex gap-1.5">
                {[0,1,2].map(j => <div key={j} className="w-2.5 h-2.5 rounded-full bg-secondary" />)}
              </div>
              <div className="h-3 w-16 bg-secondary rounded-full ml-1" />
            </div>
            <div className="p-4 space-y-2 min-h-[300px]">
              {Array.from({ length: 8 }).map((_, k) => (
                <div key={k} className="h-3 bg-secondary rounded-full"
                  style={{ width: `${40 + Math.sin(k * 2.1) * 40}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Format button */}
      <div className="h-14 bg-secondary rounded-2xl w-full" />
    </div>
  )
}

