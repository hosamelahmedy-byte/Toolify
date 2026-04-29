import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { TOOLS, getToolBySlug, getToolsByCategory, CATEGORY_META } from '@/lib/tools-registry'
import { ToolLayout } from '@/components/layout/ToolLayout'

// ============================================================
// DYNAMIC CATCH-ALL TOOL PAGE — /tools/[slug]
// Serves as a fallback for any tool slug not covered by a
// dedicated static page. Also provides generateStaticParams
// so Next.js pre-renders all known slugs at build time.
// ============================================================

// Pre-render all known tool slugs at build time
export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }))
}

// Dynamic metadata per tool
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const tool = getToolBySlug(params.slug)
  if (!tool) return { title: 'Tool Not Found' }

  const categoryLabel = CATEGORY_META[tool.category]?.label ?? 'Tools'

  return {
    title: `${tool.name} — Free Online ${categoryLabel} Tool`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: `https://toolify.io/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.name} — Toolify`,
      description: tool.description,
      url: `https://toolify.io/tools/${tool.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} — Toolify`,
      description: tool.description,
    },
  }
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default function DynamicToolPage({
  params,
}: {
  params: { slug: string }
}) {
  const tool = getToolBySlug(params.slug)

  // Unknown slug → 404
  if (!tool) notFound()

  const categoryMeta = CATEGORY_META[tool.category]
  const categoryLabel = categoryMeta?.label ?? 'Tools'
  const categoryHref  = `/tools/${tool.category}`

  // Related: other tools in same category, exclude self
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3)
    .map((t) => ({ name: t.name, slug: t.slug }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `https://toolify.io/tools/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    inLanguage: 'en',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords: tool.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ToolLayout
        title={tool.name}
        description={tool.description}
        category={categoryLabel}
        categoryHref={categoryHref}
        icon={tool.icon}
        gradient={tool.color}
        accentColor={`hsla(${tool.accentColor}, 0.3)`}
        relatedTools={related}
      >
        {/*
          This fallback page renders for slugs that don't have a dedicated
          static page yet (e.g. future tools added to the registry before
          their component is built). Show a "coming soon" placeholder.
          Static tool pages (word-counter, bmi-calculator, etc.) take
          precedence over this catch-all at routing time.
        */}
        <div className="glass-card p-10 rounded-2xl text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold font-display mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            <strong>{tool.name}</strong> is currently under development.
            Check back soon — all Toolify tools are free with no signup required.
          </p>
        </div>
      </ToolLayout>
    </>
  )
}
