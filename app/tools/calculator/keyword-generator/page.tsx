import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const KeywordGeneratorTool = dynamic(
  () => import('@/components/tools/KeywordGeneratorTool').then(m => ({ default: m.KeywordGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'SEO Keyword Generator — Free Long-Tail Keyword Research Tool',
  description:
    'Generate long-tail keywords, LSI terms, and People Also Ask questions for any topic. Free SEO keyword research tool with intent classification.',
  keywords: ['keyword generator', 'SEO keywords', 'long-tail keywords', 'LSI keywords', 'keyword research tool', 'people also ask', 'free SEO tool'],
  openGraph: {
    title: 'Free SEO Keyword Generator — Long-Tail & LSI Keywords',
    description: 'Generate hundreds of SEO keywords instantly. Intent classification, PAA questions & LSI terms.',
    url: 'https://toolify-iota-gules.vercel.app/tools/keyword-generator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SEO Keyword Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/keyword-generator',
  description: 'Free SEO keyword generator with long-tail keywords, LSI terms and intent classification.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const RELATED = [
  { name: 'Word Counter', slug: 'word-counter' },
  { name: 'Text Analyzer', slug: 'text-analyzer' },
  { name: 'AI Prompt Generator', slug: 'prompt-generator' },
]

export default function KeywordGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="SEO Keyword Generator"
        description="Generate long-tail keywords, LSI terms & People Also Ask questions for any topic. Instant intent classification, difficulty estimates & export to TXT."
        category="AI Content"
        categoryHref="/tools/ai-content"
        icon={Search}
        gradient="from-purple-500 to-pink-500"
        accentColor="rgba(168, 85, 247, 0.3)"
        relatedTools={RELATED}
      >
        <KeywordGeneratorTool />
      </ToolLayout>
    </>
  )
}

