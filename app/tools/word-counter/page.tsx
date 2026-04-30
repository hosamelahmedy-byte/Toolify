import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AlignLeft } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const WordCounterTool = dynamic(
  () => import('@/components/tools/WordCounterTool').then(m => ({ default: m.WordCounterTool })),
  { loading: () => <ToolSkeleton rows={5} showStats />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Word Counter — Free Online Word & Character Count Tool',
  description:
    'Count words, characters, sentences, paragraphs & reading time instantly. Free online word counter with real-time analysis, keyword density & readability stats. No signup.',
  keywords: [
    'word counter', 'character counter', 'word count tool', 'online word counter',
    'count words', 'character count', 'sentence counter', 'reading time calculator',
    'word frequency', 'text statistics', 'free word counter',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/word-counter' },
  openGraph: {
    title: 'Free Word Counter — Real-Time Word & Character Analysis',
    description: 'Count words, characters & sentences instantly. Get reading time, keyword density & full text stats.',
    url: 'https://toolify-iota-gules.vercel.app/tools/word-counter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Word Counter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/word-counter',
  description: 'Free real-time word counter with character count, sentence count, reading time and keyword density analysis.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Real-time word count', 'Character count', 'Sentence & paragraph count', 'Reading time estimate', 'Keyword density analysis'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the word counter work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Our word counter analyzes your text in real-time as you type or paste it. It splits words by spaces and punctuation, counts characters individually, detects sentence endings, and calculates reading time based on the average adult reading speed of 200–250 words per minute.' },
    },
    {
      '@type': 'Question',
      name: 'Does it count characters with or without spaces?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — we show both. You\'ll see the total character count including spaces, and a separate count excluding spaces. This is especially useful for SEO meta descriptions, Twitter posts, and SMS messages.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a word limit?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. The tool runs entirely in your browser, so there is no server upload limit. You can paste an entire book if you like — it will still process instantly.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use it for SEO purposes?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. The keyword density report shows which words appear most frequently, helping you optimize your content for search engines without over-stuffing keywords.' },
    },
    {
      '@type': 'Question',
      name: 'Is the word counter free?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, 100% free. No account, no sign-up, no hidden fees — ever.' },
    },
  ],
}

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Word Counter"
        description="Count words, characters, sentences & paragraphs in real-time. Get reading time estimates, Flesch readability scores, and keyword density analysis."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={AlignLeft} gradient="from-violet-500 to-indigo-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[
          { name: 'Text Analyzer', slug: 'text-analyzer' },
          { name: 'Keyword Generator', slug: 'keyword-generator' },
          { name: 'AI Text Enhancer', slug: 'ai-text-enhancer' },
        ]}
      >
        <WordCounterTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Online Word Counter — Real-Time Text Analysis</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Word Counter gives you instant word count, character count, sentence count, paragraph count, and estimated reading time as you type. Whether you're writing a blog post, essay, tweet, or SMS message, this tool keeps you on track without any page reload or signup.
            </p>
            <p className="leading-relaxed">
              The built-in keyword density report shows which words appear most often in your text — essential for SEO writers who need to optimize content naturally. The Flesch readability score tells you how easy your text is to read, and the grade level indicator shows the reading complexity.
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
