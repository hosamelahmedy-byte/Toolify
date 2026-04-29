import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AlignLeft } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

// ── Lazy-load the heavy client component ─────────────────────
const WordCounterTool = dynamic(
  () => import('@/components/tools/WordCounterTool').then(m => ({ default: m.WordCounterTool })),
  { loading: () => <ToolSkeleton rows={5} showStats />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Word Counter — Free Online Word & Character Count Tool',
  description: 'Count words, characters, sentences & paragraphs instantly. Get reading time, Flesch readability score & keyword density. Free, real-time, no signup.',
  keywords: ['word counter','character counter','reading time','word count online','text analyzer','readability score'],
  alternates: { canonical: 'https://toolify.io/tools/word-counter' },
  openGraph: { title: 'Free Word Counter — Real-Time Text Analysis', description: 'Count words, characters & get readability scores instantly.', url: 'https://toolify.io/tools/word-counter' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Word Counter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/word-counter',
  description: 'Free online word counter with real-time analysis, readability scores, and keyword density.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Word count','Character count','Reading time','Readability score','Keyword density'],
}

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Word Counter"
        description="Count words, characters, sentences & paragraphs in real-time. Get reading time estimates, Flesch readability scores, and keyword density analysis."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={AlignLeft} gradient="from-violet-500 to-indigo-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[
          { name: 'Text Analyzer', slug: 'text-analyzer' },
          { name: 'Keyword Generator', slug: 'keyword-generator' },
          { name: 'AI Prompt Generator', slug: 'prompt-generator' },
        ]}
      >
        <WordCounterTool />
      </ToolLayout>
    </>
  )
}
