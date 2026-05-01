// M7 ENHANCED — themeColor + canonical + Twitter card + Organization schema
import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

// ============================================================
// SITE-WIDE METADATA — SEO OPTIMIZED (M7)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL('https://toolify-iota-gules.vercel.app'),
  title: {
    default: 'Toolify — Free Online Tools for Developers & Creators',
    template: '%s | Toolify',
  },
  description:
    'Free online tools for developers, writers & creators. Word counter, JSON converter, BMI calculator, keyword generator, code formatter & more. Fast, free, no signup.',
  keywords: [
    'online tools', 'developer tools', 'word counter', 'JSON converter',
    'BMI calculator', 'keyword generator', 'code formatter', 'free tools',
    'web tools', 'text analyzer', 'hash generator', 'color converter',
    'unit converter', 'loan calculator', 'age calculator',
  ],
  authors: [{ name: 'Toolify', url: 'https://toolify-iota-gules.vercel.app' }],
  creator: 'Toolify',
  publisher: 'Toolify',
  applicationName: 'Toolify',
  category: 'technology',

  // ── Canonical ────────────────────────────────────────────
  alternates: {
    canonical: 'https://toolify-iota-gules.vercel.app',
  },

  // ── Robots ───────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // ── Open Graph ───────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolify-iota-gules.vercel.app',
    siteName: 'Toolify',
    title: 'Toolify — Free Online Tools for Developers & Creators',
    description:
      'Fast, free online tools. Word counter, JSON converter, calculators, code formatter & more. No signup required.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Toolify — Free Online Tools',
        type: 'image/png',
      },
    ],
  },

  // ── Twitter / X Enhanced Card ────────────────────────────
  twitter: {
    card: 'summary_large_image',
    site: '@toolifyio',
    creator: '@toolifyio',
    title: 'Toolify — Free Online Tools for Developers & Creators',
    description:
      'Fast, free tools for developers & creators. Word counter, JSON converter, calculators, code formatter & more.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Toolify — Free Online Tools',
      },
    ],
  },

  // ── Icons ────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon-32x32.png',
  },

  manifest: '/site.webmanifest',
}

// ============================================================
// VIEWPORT — Updated themeColor for M7
// ============================================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c14' },
  ],
}

// ============================================================
// JSON-LD — WebSite + Organization Schema (M7: split into 2)
// ============================================================

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Toolify',
  url: 'https://toolify-iota-gules.vercel.app',
  description: 'Free online tools for developers, writers, and creators.',
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://toolify-iota-gules.vercel.app/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Toolify',
  url: 'https://toolify-iota-gules.vercel.app',
  logo: 'https://toolify-iota-gules.vercel.app/logo.png',
  description: 'Provider of free online developer and creator tools.',
  sameAs: [],
}

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Toolify" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts — Syne + DM Sans + JetBrains Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* AdSense — Replace with your publisher ID */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}

