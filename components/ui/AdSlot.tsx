import { cn } from '@/lib/utils'

type AdSize = 'leaderboard' | 'rectangle' | 'skyscraper' | 'inline' | 'sticky-sidebar'

interface AdSlotProps {
  id: string
  size: AdSize
  className?: string
  /** AdSense data-ad-slot value — add when setting up */
  adSlot?: string
}

const SIZE_CONFIG: Record<
  AdSize,
  { width: string; height: string; label: string }
> = {
  leaderboard:      { width: 'w-full max-w-[728px]', height: 'h-[90px]',  label: '728×90 Leaderboard' },
  rectangle:        { width: 'w-[336px]',             height: 'h-[280px]', label: '336×280 Rectangle' },
  skyscraper:       { width: 'w-[160px]',             height: 'h-[600px]', label: '160×600 Skyscraper' },
  inline:           { width: 'w-full',                height: 'h-[250px]', label: '970×250 Inline' },
  'sticky-sidebar': { width: 'w-[300px]',             height: 'h-[250px]', label: '300×250 Sidebar' },
}

/**
 * AdSlot — Strategic AdSense Placeholder
 *
 * Usage:
 * 1. Enable Google AdSense: add script in layout.tsx
 * 2. Replace children with:
 *    <ins className="adsbygoogle"
 *         style={{ display: 'block' }}
 *         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *         data-ad-slot={adSlot}
 *         data-ad-format="auto"
 *         data-full-width-responsive="true" />
 *    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
 */
export function AdSlot({ id, size, className, adSlot }: AdSlotProps) {
  const config = SIZE_CONFIG[size]

  // In production with AdSense enabled, replace this div with the actual ad unit
  return (
    <div
      id={`ad-${id}`}
      className={cn(
        'ad-slot mx-auto',
        config.width,
        config.height,
        className
      )}
      aria-label="Advertisement"
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
        {config.label}
      </span>
    </div>
  )
}
