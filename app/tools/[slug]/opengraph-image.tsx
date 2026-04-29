import { ImageResponse } from 'next/og'
import { getToolBySlug, CATEGORY_META } from '@/lib/tools-registry'

// ============================================================
// PER-TOOL OG IMAGE — 1200×630
// Generates a unique OG image for every tool page
// ============================================================

export const runtime = 'edge'
export const alt = 'Toolify Tool'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Category accent color map (hex, since JSX style doesn't take CSS vars)
const CATEGORY_ACCENTS: Record<string, { from: string; to: string; glow: string }> = {
  'ai-content': { from: '#8b5cf6', to: '#a855f7', glow: 'rgba(139,92,246,0.4)' },
  dev:          { from: '#10b981', to: '#14b8a6', glow: 'rgba(16,185,129,0.4)' },
  calculator:   { from: '#0ea5e9', to: '#3b82f6', glow: 'rgba(14,165,233,0.4)' },
  seo:          { from: '#f59e0b', to: '#f97316', glow: 'rgba(245,158,11,0.4)' },
}

export default async function Image({
  params,
}: {
  params: { slug: string }
}) {
  const tool = getToolBySlug(params.slug)

  // Fallback for unknown slugs
  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0c0c14',
            color: '#ffffff',
            fontSize: '40px',
            fontWeight: 700,
            fontFamily: 'sans-serif',
          }}
        >
          Toolify
        </div>
      ),
      { ...size },
    )
  }

  const accent = CATEGORY_ACCENTS[tool.category] ?? CATEGORY_ACCENTS['dev']
  const categoryLabel = CATEGORY_META[tool.category]?.label ?? 'Tools'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0c0c14 0%, #111827 60%, #0f172a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Accent glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent.glow} 0%, transparent 65%)`,
          }}
        />

        {/* Secondary glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Site branding — top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '36px 56px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
            }}
          >
            ⚡
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 600 }}>
            Toolify
          </span>
          <div style={{ flex: 1 }} />
          {/* Category badge */}
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '100px',
              background: `${accent.from}20`,
              border: `1px solid ${accent.from}50`,
              color: accent.from,
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {categoryLabel}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 56px 48px',
            position: 'relative',
          }}
        >
          {/* Tool icon */}
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '46px',
              marginBottom: '28px',
              boxShadow: `0 0 50px ${accent.glow}`,
            }}
          >
            🛠
          </div>

          {/* Tool name */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '16px',
              maxWidth: '800px',
            }}
          >
            {tool.name}
          </div>

          {/* Tool description */}
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '720px',
              lineHeight: 1.5,
              marginBottom: '32px',
            }}
          >
            {tool.description}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {tool.tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: `${accent.from}15`,
                border: `1px solid ${accent.from}40`,
                color: accent.from,
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Free ✓
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            padding: '18px 56px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
            position: 'relative',
          }}
        >
          <span>toolify.io/tools/{tool.slug}</span>
          <span>No signup · Runs in browser · 100% free</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
