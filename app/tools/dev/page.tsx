export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { getToolsByCategory, CATEGORY_META } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Developer Tools — Free JSON, Code, Color & Hash Utilities',
  description: 'Free developer tools online: JSON to TypeBox converter, code formatter, color converter (HEX/RGB/HSL/OKLCH), hash generator (MD5/SHA). No signup, runs in browser.',
  keywords: ['developer tools','JSON to TypeBox','code formatter','color converter','hash generator','free dev tools','online developer utilities','TypeScript schema generator'],
  openGraph: { title: 'Developer Tools — Toolify', description: 'JSON converter, code formatter, color converter & hash generator. Fast & free.', url: 'https://toolify.io/tools/dev', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Developer Tools — Toolify', description: 'Free dev tools: JSON, code formatting, color & hash — no signup needed.' },
  alternates: { canonical: 'https://toolify.io/tools/dev' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Developer Tools',
  url: 'https://toolify.io/tools/dev',
  description: 'Free online developer tools including JSON to TypeBox converter, code formatter, color converter, and hash generator.',
  inLanguage: 'en',
  isPartOf: { '@type': 'WebSite', name: 'Toolify', url: 'https://toolify.io' },
  hasPart: getToolsByCategory('dev').map((t) => ({
    '@type': 'SoftwareApplication',
    name: t.name,
    url: `https://toolify.io/tools/${t.slug}`,
    description: t.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })),
}

export default function DevToolsPage() {
  const tools = getToolsByCategory('dev')
  const meta = CATEGORY_META['dev']
  const Icon = meta.icon
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-20 blur-[80px] bg-emerald-500" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-[60px] bg-teal-400" />
        </div>
        <div className="section-container py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Developer</span>
          </nav>
          <div className="mb-10">
            <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5', meta.color)}>
              <Icon size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              Developer <span className="gradient-text-static">Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">{meta.description} — all free, no signup, runs in your browser.</p>
            <div className="flex flex-wrap gap-4 mt-5">
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{tools.length}</strong> tools available</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">100%</strong> free & open</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">No</strong> signup required</span>
            </div>
          </div>
          <AdSlot size="leaderboard" id="dev-top" className="mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => {
              const TIcon = tool.icon
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className="tool-card h-full group">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110', tool.color)}>
                      <TIcon size={22} className="text-white" />
                    </div>
                    <div className="flex gap-2 mb-2 min-h-[20px]">
                      {tool.popular && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">🔥 Popular</span>}
                      {tool.new && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">✨ New</span>}
                    </div>
                    <h2 className="font-bold font-display text-lg mb-2 group-hover:text-primary transition-colors">{tool.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm font-medium text-primary mt-auto">
                      Use Tool <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <AdSlot size="inline" id="dev-mid" className="mt-10" />
          <section className="mt-12 glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold font-display mb-4">Why Use Our Developer Tools?</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-1">⚡ Instant & Local</h3>
                <p>All processing runs entirely in your browser. No data leaves your machine — perfect for sensitive code, API keys, or proprietary JSON schemas.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🛠 TypeScript First</h3>
                <p>Our JSON → TypeBox converter generates type-safe schemas compatible with Fastify, tRPC, and any TypeBox-aware runtime out of the box.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🎨 CSS Color Formats</h3>
                <p>Convert colors between HEX, RGB, HSL, and the modern OKLCH format used by Tailwind CSS v4 and CSS Color Level 4 spec.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🔒 Cryptographic Hashing</h3>
                <p>Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using the WebCrypto API. Useful for checksums, integrity verification, and security audits.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
