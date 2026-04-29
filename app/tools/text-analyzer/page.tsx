import type { Metadata } from 'next'
import { Activity } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const TextAnalyzerTool = dynamic(
  () => import('@/components/tools/TextAnalyzerTool').then(m => ({ default: m.TextAnalyzerTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Text Analyzer — Readability Score, Sentiment & Keyword Density',
  description:
    'Deep text analysis: Flesch readability, SMOG index, sentiment score, keyword density, grade level & letter frequency. Free, instant, no signup.',
  keywords: ['text analyzer','readability score','flesch kincaid','sentiment analysis','keyword density','text statistics','SMOG index'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Text Analyzer',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/text-analyzer',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Flesch Reading Ease','Grade Level','SMOG Index','Sentiment Analysis','Keyword Density'],
}

export default function TextAnalyzerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Text Analyzer"
        description="Deep text analysis: readability grades (Flesch, SMOG, ARI), sentiment scoring, keyword density, vocabulary richness & letter frequency."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={Activity} gradient="from-blue-500 to-cyan-500"
        accentColor="rgba(59, 130, 246, 0.3)"
        relatedTools={[
          { name: 'Word Counter', slug: 'word-counter' },
          { name: 'Keyword Generator', slug: 'keyword-generator' },
        ]}
      >
        <TextAnalyzerTool />
      </ToolLayout>
    </>
  )
}
