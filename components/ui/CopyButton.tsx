'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn, copyToClipboard } from '@/lib/utils'
import { useToast } from '@/lib/toast'

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
  successMessage?: string
}

export function CopyButton({
  text,
  className,
  label = 'Copy',
  successMessage = 'Copied to clipboard!',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  // Toast is optional — gracefully handle missing provider
  let toastFn: ((msg: string) => void) | null = null
  try {
    const { success } = useToast()
    toastFn = success
  } catch {}

  const handleCopy = async () => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(true)
      toastFn?.('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
        'transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        copied
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          : 'glass-card hover:border-primary/30 text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

