import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Type } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const CaseConverterTool = dynamic(
  () => import('@/components/tools/CaseConverterTool').then((m) => ({ default: m.CaseConverterTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Case Converter — UPPER, lower, Title, camelCase & More | Toolify',
  description:
    'Convert text between uppercase, lowercase, Title Case, sentence case, camelCase, PascalCase, snake_case, kebab-case & more. Free online text case converter.',
  keywords: [
    'case converter',
    'text case converter',
    'uppercase converter',
    'camelCase converter',
    'snake_case converter',
    'title case converter',
    'text transformer',
    'free online tool',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/case-converter' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Case Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/case-converter',
  description: 'Convert text between 13 different case formats: uppercase, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is camelCase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'camelCase writes compound words where each word after the first starts with a capital letter and no spaces are used. Example: "helloWorld". Commonly used in JavaScript variable names.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between camelCase and PascalCase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In camelCase, the first word is lowercase (helloWorld). In PascalCase, every word starts with uppercase (HelloWorld). PascalCase is common for class names in programming.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is snake_case used for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'snake_case uses underscores between words with all lowercase letters. It\'s commonly used in Python variable names, database columns, and file names.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many case formats does this tool support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This tool supports 13 case formats: UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, path/case, iNVERT cASE, and AlTeRnAtInG cAsE.',
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
        title="Case Converter"
        description="Convert text between 13 formats: UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case & more."
        category="Developer"
        categoryHref="/tools/dev"
        icon={Type}
        gradient="from-blue-500 to-indigo-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[
          { name: 'Word Counter', slug: 'word-counter' },
          { name: 'Text Analyzer', slug: 'text-analyzer' },
          { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator' },
        ]}
      >
        <CaseConverterTool />

        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Text Case Converter — 13 Formats</h2>
            <p className="leading-relaxed mb-3">
              Toolify&apos;s Case Converter instantly transforms your text into any of 13 common case
              formats used in writing, programming, and design. Whether you need camelCase for
              JavaScript variables, snake_case for Python, or Title Case for headlines, this tool
              handles it in one click.
            </p>
            <p className="leading-relaxed">
              Paste or type your text in the input box, then click any case format to see the instant
              result. Use the Swap button to flip input and output, or use Quick Actions to chain
              conversions without retyping.
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

