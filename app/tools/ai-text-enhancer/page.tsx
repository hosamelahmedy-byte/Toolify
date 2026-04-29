import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Wand2 } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const AITextEnhancerTool = dynamic(
  () => import('@/components/tools/AITextEnhancerTool').then(m => ({ default: m.AITextEnhancerTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

// ── SEO Metadata ───────────────────────────────────────────
export const metadata: Metadata = {
  title: 'AI Text Enhancer — Free Grammar Fixer & Writing Improver',
  description:
    'Instantly fix grammar, improve writing flow, and enhance your text with AI. Powered by Llama 3.1. Free, no signup, no limits.',
  keywords: [
    'AI text enhancer', 'grammar fixer', 'writing improver', 'fix grammar online',
    'paraphrase tool', 'text rewriter', 'AI writing assistant', 'improve writing free',
    'Llama AI', 'Groq AI tool',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/ai-text-enhancer' },
  openGraph: {
    title: 'AI Text Enhancer — Fix Grammar & Improve Writing Free',
    description: 'Enhance, simplify, formalize, or shorten your text instantly with Llama 3.1 AI.',
    url: 'https://toolify-iota-gules.vercel.app/tools/ai-text-enhancer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Text Enhancer — Free AI Writing Tool',
    description: 'Fix grammar & improve writing flow with Llama 3.1. Free, instant, no signup.',
  },
}

// ── JSON-LD Schema ─────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Text Enhancer',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/ai-text-enhancer',
  description:
    'Free AI-powered text enhancement tool. Fix grammar, improve flow, simplify, formalize, or make text concise using Llama 3.1.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Grammar correction',
    'Writing flow improvement',
    'Text simplification',
    'Formal tone conversion',
    'Text conciseness',
  ],
}

// ── FAQ Schema ─────────────────────────────────────────────
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the AI Text Enhancer free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free. No signup, no subscription, no hidden limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'What AI model powers this tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It uses Llama 3.1 (8B Instant) by Meta, served via Groq — one of the fastest AI inference platforms available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my text stored or shared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your text is sent to the AI model to process and returned immediately. We do not store, log, or share your content.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the character limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can enhance up to 3,000 characters per request. For longer documents, split them into sections.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the different enhancement modes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There are 4 modes: Enhance (grammar + flow), Simplify (easy language), Formal (professional tone), and Concise (shorter text).',
      },
    },
  ],
}

// ── Page ───────────────────────────────────────────────────
export default function AITextEnhancerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <ToolLayout
        title="AI Text Enhancer"
        description="Fix grammar, improve writing flow, simplify, formalize, or shorten your text instantly — powered by Llama 3.1. Free, no signup required."
        category="AI Content"
        categoryHref="/tools/ai-content"
        icon={Wand2}
        gradient="from-violet-500 to-purple-600"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[
          { name: 'Word Counter', slug: 'word-counter' },
          { name: 'Text Analyzer', slug: 'text-analyzer' },
          { name: 'Case Converter', slug: 'case-converter' },
          { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator' },
        ]}
      >
        <AITextEnhancerTool />

        {/* SEO Text Block */}
        <div className="mt-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              Free AI Text Enhancer — Powered by Llama 3.1
            </h2>
            <p>
              Toolify's AI Text Enhancer uses <strong>Meta's Llama 3.1</strong> model via Groq to
              instantly fix grammar mistakes, improve sentence flow, and polish your writing. Whether
              you're working on an email, blog post, essay, or social caption — this tool helps you
              write better in seconds.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">4 Enhancement Modes</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>Enhance</strong> — Corrects grammar and improves overall writing quality.</li>
              <li><strong>Simplify</strong> — Rewrites complex text in plain, easy-to-understand language.</li>
              <li><strong>Formal</strong> — Converts casual writing to a professional business tone.</li>
              <li><strong>Concise</strong> — Trims unnecessary words while preserving all key points.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqJsonLd.mainEntity.map((item) => (
                <div key={item.name}>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-0.5">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}
