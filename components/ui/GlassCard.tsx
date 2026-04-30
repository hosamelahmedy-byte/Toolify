'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: 'primary' | 'accent' | 'none'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  style?: React.CSSProperties
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = 'none',
  size = 'md',
  onClick,
  style,
}: GlassCardProps) {
  const sizes = { sm: 'p-3', md: 'p-5', lg: 'p-7' }

  return (
    <motion.div
      onClick={onClick}
      style={style}
      whileHover={hover ? { y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } } : undefined}
      className={cn(
        'glass-card relative overflow-hidden',
        sizes[size],
        hover && 'cursor-default',
        glow === 'primary' && 'shadow-glow-brand',
        glow === 'accent' && 'shadow-glow-accent',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

