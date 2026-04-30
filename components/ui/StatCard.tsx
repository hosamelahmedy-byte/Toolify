import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  color?: string
  subtext?: string
  className?: string
}

export function StatCard({ label, value, icon: Icon, color, subtext, className }: StatCardProps) {
  return (
    <div className={cn('glass-card p-4 text-center', className)}>
      {Icon && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
          style={{ background: color ? `${color}18` : undefined }}
        >
          <Icon size={18} style={{ color: color }} />
        </div>
      )}
      <div
        className="text-2xl font-bold font-display mb-1"
        style={{ color: color }}
      >
        {value}
      </div>
      <div className="text-xs font-medium text-foreground/80">{label}</div>
      {subtext && <div className="text-xs text-muted-foreground mt-0.5">{subtext}</div>}
    </div>
  )
}

