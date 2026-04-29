/**
 * Analytics helpers — wraps Google Analytics / Vercel Analytics
 * All calls are no-ops in development or when GA is not configured.
 */

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

// ── Google Analytics 4 ────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent({ action, category, label, value }: GTagEvent) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function trackToolUse(slug: string) {
  trackEvent({ action: 'tool_use', category: 'tools', label: slug })
}

export function trackSearch(query: string) {
  trackEvent({ action: 'search', category: 'navigation', label: query })
}

export function trackCopy(toolSlug: string, contentType: string) {
  trackEvent({ action: 'copy', category: 'engagement', label: `${toolSlug}:${contentType}` })
}

export function trackDownload(toolSlug: string, format: string) {
  trackEvent({ action: 'download', category: 'engagement', label: `${toolSlug}:${format}` })
}

// ── Web Vitals (used in app/layout.tsx reportWebVitals) ───────

export function reportWebVitals(metric: {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${Math.round(metric.value)} (${metric.rating})`)
  }
  trackEvent({
    action: metric.name,
    category: 'Web Vitals',
    label: metric.rating,
    value: Math.round(metric.delta),
  })
}
