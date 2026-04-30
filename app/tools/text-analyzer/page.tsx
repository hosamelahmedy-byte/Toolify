import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Activity } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const TextAnalyzerTool = dynamic(
  () => import('@/components/tools/TextAnalyzerTool').then(m => ({ default: m.TextAnalyzerTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Text Analyzer — Readability, Sentiment & Keyword Density Tool',
  description: 'Analyze text readability with Flesch-Kincaid score, detect sentiment, measure keyword density & grade level. Free online text analysis tool. No signup.',
  keywords: ['text analyzer', 'readability checker', 'Flesch-Kincaid score', 'sentiment analysis', 'keyword density tool', 'text analysis tool', 'readability score', 'grade level checker', 'content analyzer'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/text-analyzer' },
  openGraph: {
    title: 'Text Analyzer — Readability, Sentiment & Keyword Density Tool',
    description: 'Analyze text readability with Flesch-Kincaid score, detect sentiment, measure keyword density & grade level. Free online text analysis tool. No signup.',
    url: 'https://toolify-iota-gules.vercel.app/tools/text-analyzer',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Text Analyzer',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/text-analyzer',
  description: 'Analyze text readability with Flesch-Kincaid score, detect sentiment, measure keyword density & grade level. Free online text analysis tool. No signup.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Flesch-Kincaid readability', 'Sentiment analysis', 'Keyword density', 'Grade level assessment', 'Passive voice detection', 'SMOG index'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Flesch-Kincaid readability score?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Flesch-Kincaid Reading Ease score ranges from 0 to 100. A score of 60–70 is considered ideal for general audiences. Higher scores mean easier reading. The formula considers average sentence length and average number of syllables per word.' },
    },
    {
      '@type': 'Question',
      name: 'What does sentiment analysis show?',
      acceptedAnswer: { '@type': 'Answer', text: "Sentiment analysis classifies the overall emotional tone of your text as positive, negative, or neutral. It's useful for checking if your marketing copy sounds friendly, if a review is complimentary, or if product descriptions have the right tone." },
    },
    {
      '@type': 'Question',
      name: 'What is a good keyword density for SEO?',
      acceptedAnswer: { '@type': 'Answer', text: 'SEO best practice recommends a keyword density of 1–2% — meaning your primary keyword should appear about once or twice per 100 words. Going higher can trigger keyword stuffing penalties from search engines.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this to improve my writing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. The tool highlights complex sentences, passive voice usage, and overused words — all common writing issues. Fixing them improves both readability and SEO performance.' },
    },
    {
      '@type': 'Question',
      name: 'Does the text analyzer store my content?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. All analysis happens in your browser. Your text is never sent to our servers, so your content stays completely private.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Text Analyzer"
        description="Deep text analysis: readability grades (Flesch, SMOG, ARI), sentiment scoring, keyword density, vocabulary richness & letter frequency."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={Activity} gradient="from-blue-500 to-cyan-500"
        accentColor="rgba(59, 130, 246, 0.3)"
        relatedTools={[{ name: 'Word Counter', slug: 'word-counter' },
          { name: 'Keyword Generator', slug: 'keyword-generator' },
          { name: 'AI Text Enhancer', slug: 'ai-text-enhancer' }]}
      >
        <TextAnalyzerTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Text Analyzer — Readability, Sentiment & Keyword Density</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Text Analyzer performs a comprehensive analysis of any text. Paste your content and instantly get a Flesch-Kincaid readability score, SMOG index, ARI grade level, sentiment classification (positive / negative / neutral), keyword density breakdown, and vocabulary richness score.
            </p>
            <p className="leading-relaxed">
              Whether you're a blogger, copywriter, or SEO specialist, these metrics help you write content that resonates with readers and ranks better on search engines.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqJsonLd.mainEntity.map((qa) => (
                <div key={qa.name}>
                  <h3 className="font-medium text-foreground mb-1">{qa.name}</h3>
                  <p className="leading-relaxed">{qa.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ToolLayout>
    </>
  )
}

