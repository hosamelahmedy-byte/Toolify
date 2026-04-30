import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Search } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const KeywordGeneratorTool = dynamic(
  () => import('@/components/tools/KeywordGeneratorTool').then(m => ({ default: m.KeywordGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'SEO Keyword Generator — Free Long-Tail & LSI Keyword Tool',
  description: 'Generate hundreds of long-tail keywords, LSI terms & semantic variations for any topic. Free SEO keyword research tool. No API key or signup needed.',
  keywords: ['keyword generator', 'SEO keyword tool', 'long-tail keywords', 'LSI keywords', 'keyword research', 'semantic keywords', 'free keyword generator', 'keyword ideas', 'SEO tool'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/keyword-generator' },
  openGraph: {
    title: 'SEO Keyword Generator — Free Long-Tail & LSI Keyword Tool',
    description: 'Generate hundreds of long-tail keywords, LSI terms & semantic variations for any topic. Free SEO keyword research tool. No API key or signup needed.',
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
  description: 'Generate hundreds of long-tail keywords, LSI terms & semantic variations for any topic. Free SEO keyword research tool. No API key or signup needed.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Long-tail keyword generation', 'LSI keyword discovery', 'Semantic variations', 'Question-based keywords', 'Bulk export'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a long-tail keyword?',
      acceptedAnswer: { '@type': 'Answer', text: "Long-tail keywords are search phrases typically 3–5+ words long that are more specific than short head keywords. For example, 'best running shoes for flat feet women' is a long-tail keyword. They usually have lower search volume but much higher conversion rates because the searcher's intent is clearer." },
    },
    {
      '@type': 'Question',
      name: 'What is an LSI keyword?',
      acceptedAnswer: { '@type': 'Answer', text: "LSI (Latent Semantic Indexing) keywords are conceptually related terms that search engines expect to see around a topic. For example, if your main keyword is 'coffee', LSI keywords might include 'espresso', 'caffeine', 'barista', and 'brewing methods'. Using LSI keywords helps search engines understand your content context." },
    },
    {
      '@type': 'Question',
      name: 'How many keywords can I generate?',
      acceptedAnswer: { '@type': 'Answer', text: 'You can generate as many keyword variations as you need — there is no limit. Simply enter your topic or seed keyword and the tool will produce dozens of variations across multiple categories.' },
    },
    {
      '@type': 'Question',
      name: 'Can I export the keywords?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can copy all generated keywords to your clipboard with one click, making it easy to paste them into spreadsheets, content briefs, or SEO tools.' },
    },
    {
      '@type': 'Question',
      name: 'Is this tool better than Google Keyword Planner?',
      acceptedAnswer: { '@type': 'Answer', text: 'This tool is best used to quickly generate keyword ideas and semantic variations. Google Keyword Planner adds search volume and CPC data. We recommend using both together: generate ideas here, then validate volume in Keyword Planner.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="SEO Keyword Generator"
        description="Generate long-tail keywords, LSI terms & People Also Ask questions for any topic. Instant intent classification, difficulty estimates & export to TXT."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={Search} gradient="from-purple-500 to-pink-500"
        accentColor="rgba(168, 85, 247, 0.3)"
        relatedTools={[{ name: 'Word Counter', slug: 'word-counter' },
          { name: 'Text Analyzer', slug: 'text-analyzer' },
          { name: 'AI Prompt Generator', slug: 'prompt-generator' }]}
      >
        <KeywordGeneratorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free SEO Keyword Generator — Long-Tail & LSI Keywords Instantly</h2>
            <p className="leading-relaxed mb-3">
              Toolify's SEO Keyword Generator creates hundreds of relevant long-tail keywords and LSI (Latent Semantic Indexing) terms for any topic or seed keyword. Enter your main keyword and instantly get semantic variations, question-based keywords, and related terms that help your content rank higher on Google.
            </p>
            <p className="leading-relaxed">
              The tool organizes keywords by intent category — informational, navigational, transactional — making it easy to plan content that matches what searchers actually want.
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

