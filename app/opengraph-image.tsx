import { ImageResponse } from 'next/og'

// ============================================================
// ROOT OG IMAGE — 1200×630
// Dynamic Open Graph image for the homepage
// ============================================================

export const runtime = 'edge'
export const alt = 'Toolify — Free Online Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c14 0%, #111827 50%, #0f172a 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            marginBottom: '24px',
            boxShadow: '0 0 40px rgba(139,92,246,0.5)',
          }}
        >
          <span style={{ fontSize: '40px' }}>⚡</span>
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
            marginBottom: '8px',
          }}
        >
          Tool
          <span
            style={{
              background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            ify
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          Free online tools for developers & creators
        </div>

        {/* Tool pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '900px',
          }}
        >
          {[
            { label: 'Word Counter', color: '#8b5cf6' },
            { label: 'JSON → TypeBox', color: '#10b981' },
            { label: 'BMI Calculator', color: '#22c55e' },
            { label: 'Code Formatter', color: '#64748b' },
            { label: 'Hash Generator', color: '#06b6d4' },
            { label: 'Color Converter', color: '#f43f5e' },
          ].map((pill) => (
            <div
              key={pill.label}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${pill.color}40`,
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {pill.label}
            </div>
          ))}
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
          }}
        >
          <span>toolify.io</span>
          <span>·</span>
          <span>12 free tools</span>
          <span>·</span>
          <span>No signup required</span>
        </div>
      </div>
    ),
    { ...size },
  )
}

