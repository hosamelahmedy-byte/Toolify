export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileStack } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { getToolsByCategory, CATEGORY_META } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Free PDF Tools — Merge, Split, Compress & Convert PDFs Online',
  description:
    'Free online PDF tools: merge PDFs, split pages, compress file size, convert images to PDF & extract text. 100% in your browser — no upload, no signup.',
  keywords: [
    'PDF tools', 'merge PDF', 'split PDF', 'compress PDF',
    'image to PDF', 'PDF to Word', 'free PDF tools online', 'PDF converter',
  ],
  alternates: { canonical: 'https://toolify.io/tools/pdf' },
  openGraph: {
    title: 'Free PDF Tools — Toolify',
    description: 'Merge, split, compress & convert PDFs. 100% free, no upload to server.',
    url: 'https://toolify.io/tools/pdf',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'PDF Tools',
  url: 'https://toolify.io/tools/pdf',
  description: 'Free online PDF tools: merge, split, compress and convert PDFs.',
  isPartOf: { '@type': 'WebSite', name: 'Toolify', url: 'https://toolify.io' },
  hasPart: getToolsByCategory('pdf').map(t => ({
    '@type': 'SoftwareApplication',
    name: t.name,
    url: `https://toolify.io/tools/${t.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })),
}

export default function PDFToolsPage() {
  const tools = getToolsByCategory('pdf')
  const meta = CATEGORY_META['pdf']
  const Icon = meta.icon

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[80px] bg-red-500" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 blur-[60px] bg-rose-400" />
        </div>

        <div className="section-container py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-foreground font-medium">PDF Tools</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5', meta.color)}>
              <Icon size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              PDF <span className="gradient-text-static">Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              {meta.description} — all free, no signup, your files never leave your browser.
            </p>
            <div className="flex flex-wrap gap-4 mt-5">
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{tools.length}</strong> tools available</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">100%</strong> client-side processing</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">Zero</strong> file uploads</span>
            </div>
          </div>

          <AdSlot size="leaderboard" id="pdf-top" className="mb-10" />

          {/* Tools Grid */}
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
                      {tool.tags.slice(0, 3).map(tag => (
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

          <AdSlot size="inline" id="pdf-mid" className="mt-10" />

          {/* SEO Section */}
          <section className="mt-12 glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold font-display mb-4">Why Use Our PDF Tools?</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-1">🔒 100% Private</h3>
                <p>Your PDF files are processed entirely in your browser using JavaScript. No files are ever uploaded to our servers — your documents stay on your device.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">⚡ Instant Processing</h3>
                <p>No waiting for server uploads or downloads. All PDF operations run locally using the pdf-lib library, giving you instant results.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">📄 Merge & Split</h3>
                <p>Combine multiple PDFs into one document or split a large PDF into individual pages. Reorder pages by drag-and-drop before merging.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🗜️ Compress & Convert</h3>
                <p>Reduce PDF file size for easier sharing via email. Convert images to PDF or extract text from PDFs — all for free, no watermarks.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
