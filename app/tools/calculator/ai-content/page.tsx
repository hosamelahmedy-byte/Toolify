export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { Wand2, ArrowRight, Flame, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { getToolsByCategory, CATEGORY_META } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AI Content Tools — Free Writing, SEO & Text Analysis Tools',
  description: 'Free AI-powered content tools: word counter, keyword generator, text analyzer, readability checker & prompt builder. No signup required.',
  keywords: ['AI content tools', 'writing tools', 'SEO tools', 'text analyzer', 'keyword generator', 'free writing tools'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AI Content Tools',
  url: 'https://toolify-iota-gules.vercel.app/tools/ai-content',
  description: 'Free AI-powered tools for content creation, SEO, and text analysis.',
  hasPart: getToolsByCategory('ai-content').map(t => ({
    '@type': 'SoftwareApplication',
    name: t.name,
    url: `https://toolify-iota-gules.vercel.app/tools/${t.slug}`,
  })),
}

export default function AIContentPage() {
  const tools = getToolsByCategory('ai-content')
  const meta = CATEGORY_META['ai-content']
  const Icon = meta.icon

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-[80px] bg-violet-500" />
        </div>

        <div className="section-container py-12">
          {/* Header */}
          <div className="mb-10">
            <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5', meta.color)}>
              <Icon size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              AI Content <span className="gradient-text-static">Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              {meta.description} — all free, no signup, runs in your browser.
            </p>
          </div>

          <AdSlot size="leaderboard" id="ai-content-top" className="mb-10" />

          {/* Tools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => {
              const TIcon = tool.icon
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className="tool-card h-full group">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110', tool.color)}>
                      <TIcon size={22} className="text-white" />
                    </div>
                    <div className="flex gap-2 mb-2">
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
        </div>
      </main>
      <Footer />
    </>
  )
}
