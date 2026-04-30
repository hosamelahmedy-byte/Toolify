import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Code2 } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const CodeFormatterTool = dynamic(
  () => import('@/components/tools/CodeFormatterTool').then(m => ({ default: m.CodeFormatterTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Code Formatter — Free Online HTML, CSS, JS & JSON Beautifier',
  description: 'Format and beautify HTML, CSS, JavaScript, TypeScript, JSON & more instantly. Free online code formatter with syntax highlighting. No install needed.',
  keywords: ['code formatter', 'code beautifier', 'HTML formatter', 'CSS formatter', 'JavaScript formatter', 'JSON formatter', 'TypeScript formatter', 'online code formatter', 'prettify code'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/code-formatter' },
  openGraph: {
    title: 'Code Formatter — Free Online HTML, CSS, JS & JSON Beautifier',
    description: 'Format and beautify HTML, CSS, JavaScript, TypeScript, JSON & more instantly. Free online code formatter with syntax highlighting. No install needed.',
    url: 'https://toolify-iota-gules.vercel.app/tools/code-formatter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Code Formatter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/code-formatter',
  description: 'Format and beautify HTML, CSS, JavaScript, TypeScript, JSON & more instantly. Free online code formatter with syntax highlighting. No install needed.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['HTML formatting', 'CSS beautification', 'JavaScript/TypeScript formatting', 'JSON pretty-print', 'Configurable indent size', 'SQL formatter'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which programming languages does the formatter support?',
      acceptedAnswer: { '@type': 'Answer', text: 'The formatter supports HTML, CSS, JavaScript, TypeScript, JSON, SQL, XML, and Markdown. Simply paste your code and select the language from the dropdown.' },
    },
    {
      '@type': 'Question',
      name: 'Can I configure the indentation style?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes. You can choose between 2-space, 4-space, or tab indentation to match your project's coding style guide." },
    },
    {
      '@type': 'Question',
      name: 'Does it work with minified code?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. Paste minified JavaScript or CSS and the formatter will expand it into properly indented, readable code — perfect for debugging third-party scripts.' },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to paste sensitive code here?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The formatter runs entirely in your browser. Your code is never transmitted to any server.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this instead of Prettier?',
      acceptedAnswer: { '@type': 'Answer', text: 'For quick formatting of individual files without a local setup, yes. For team projects, we recommend Prettier with a shared config. Our tool is best for one-off formatting tasks.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Code Formatter"
        description="Beautify and format JavaScript, TypeScript, JSON, HTML, CSS, SQL, XML & Markdown instantly. Configurable indentation, file upload, and one-click copy — all client-side."
        category="Developer" categoryHref="/tools/dev"
        icon={Code2} gradient="from-slate-500 to-zinc-600"
        accentColor="rgba(100, 116, 139, 0.3)"
        relatedTools={[{ name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'JSON → TypeBox', slug: 'json-to-typebox' },
          { name: 'Text Analyzer', slug: 'text-analyzer' }]}
      >
        <CodeFormatterTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Code Formatter — Beautify HTML, CSS, JS, JSON & More Online</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Code Formatter instantly beautifies code in 8 languages — all running in your browser with no data sent to servers. Paste minified JavaScript, messy JSON, or unindented HTML and get cleanly formatted output in seconds.
            </p>
            <p className="leading-relaxed">
              Configure 2-space, 4-space, or tab indentation to match your project's style guide. Upload code files directly or paste code and download the formatted result.
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
