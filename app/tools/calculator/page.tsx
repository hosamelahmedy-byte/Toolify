export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { TOOLS, CATEGORY_META, getToolsByCategory } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'All Free Online Tools — Toolify',
  description: `Browse ${TOOLS.length}+ free online tools for developers, writers & creators. Word counters, JSON converters, BMI calculators, keyword generators & more.`,
  keywords: ['free online tools', 'developer tools', 'writing tools', 'calculators', 'SEO tools'],
  openGraph: {
    title: `All ${TOOLS.length}+ Free Tools — Toolify`,
    description: 'The ultimate collection of free online tools for developers & creators.',
    url: 'https://toolify-iota-gules.vercel.app/tools',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All Tools',
  url: 'https://toolify-iota-gules.vercel.app/tools',
  description: `Collection of ${TOOLS.length}+ free online tools`,
  numberOfItems: TOOLS.length,
}

export default function AllToolsPage() {
  const categories = Object.entries(CATEGORY_META) as [
    keyof typeof CATEGORY_META,
    (typeof CATEGORY_META)[keyof typeof CATEGORY_META]
  ][]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="section-container py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground mb-4">
              <Zap size={14} className="text-primary" />
              {TOOLS.length} tools · Always free
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              All <span className="gradient-text-static">Free Tools</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional-grade tools that run in your browser. No login, no watermarks, no limits.
            </p>
          </div>

          <AdSlot size="leaderboard" id="tools-page-top" className="mb-12" />

          {/* Categories */}
          <div className="space-y-14">
            {categories.map(([catId, catMeta]) => {
              const tools = getToolsByCategory(catId)
              if (!tools.length) return null
              const CatIcon = catMeta.icon
              return (
                <section key={catId}>
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', catMeta.color)}>
                        <CatIcon size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-display">{catMeta.label}</h2>
                        <p className="text-sm text-muted-foreground">{catMeta.description}</p>
                      </div>
                    </div>
                    <Link
                      href={`/tools/${catId}`}
                      className="text-sm text-primary flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View all <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Tools grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tools.map(tool => {
                      const TIcon = tool.icon
                      return (
                        <Link key={tool.id} href={`/tools/${tool.slug}`}>
                          <div className="tool-card group h-full">
                            <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 transition-transform group-hover:scale-110', tool.color)}>
                              <TIcon size={18} className="text-white" />
                            </div>
                            <div className="flex gap-1.5 mb-2">
                              {tool.popular && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500">HOT</span>}
                              {tool.new && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">NEW</span>}
                            </div>
                            <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{tool.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          <AdSlot size="leaderboard" id="tools-page-bottom" className="mt-16" />
        </div>
      </main>
      <Footer />
    </>
  )
}

