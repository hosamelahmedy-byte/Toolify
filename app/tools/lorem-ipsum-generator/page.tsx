import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AlignLeft } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const LoremIpsumGeneratorTool = dynamic(
  () => import('@/components/tools/LoremIpsumGeneratorTool').then((m) => ({ default: m.LoremIpsumGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator — Free Placeholder Text | Toolify',
  description:
    'Generate Lorem Ipsum placeholder text by paragraphs, sentences, words, or bytes. Optional HTML wrapping, custom length, instant copy. Free online tool.',
  keywords: [
    'lorem ipsum generator',
    'placeholder text',
    'dummy text generator',
    'lorem ipsum',
    'filler text',
    'lorem ipsum online',
    'random text generator',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/lorem-ipsum-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Lorem Ipsum Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/lorem-ipsum-generator',
  description: 'Generate Lorem Ipsum placeholder text by paragraphs, sentences, words, or bytes. Optional HTML wrapping and custom length.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Lorem Ipsum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lorem Ipsum is standard placeholder text used in design and publishing since the 1500s. It is derived from a Latin text by Cicero and is used to demonstrate the visual form of a document without relying on meaningful content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I generate HTML Lorem Ipsum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enable the "Wrap in HTML <p> tags" option to generate text wrapped in paragraph HTML tags, ready to paste into your HTML or template files.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many paragraphs can I generate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can generate up to 20 paragraphs, 50 sentences, 500 words, or 5000 bytes of Lorem Ipsum text.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Lorem Ipsum Generator"
        description="Generate placeholder text by paragraphs, sentences, words, or bytes. Optional HTML wrapping, instant copy."
        category="Content"
        categoryHref="/tools/ai-content"
        icon={AlignLeft}
        gradient="from-violet-500 to-purple-600"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[
          { name: 'Word Counter', slug: 'word-counter' },
          { name: 'Case Converter', slug: 'case-converter' },
          { name: 'Text Analyzer', slug: 'text-analyzer' },
        ]}
      >
        <LoremIpsumGeneratorTool />

        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Lorem Ipsum Placeholder Text Generator</h2>
            <p className="leading-relaxed mb-3">
              Need dummy text for your design mockup, website template, or print layout?
              Toolify&apos;s Lorem Ipsum Generator creates realistic placeholder text instantly.
              Choose to generate by paragraphs, sentences, words, or an exact byte count.
            </p>
            <p className="leading-relaxed">
              Toggle HTML wrapping to get ready-to-paste &lt;p&gt; tags, and enable the
              &ldquo;Start with Lorem ipsum&rdquo; option to begin with the classic opening phrase.
              Your generated text can be copied with one click.
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
