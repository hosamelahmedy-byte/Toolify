import type { Metadata } from 'next'
import { Code2 } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { EditorSkeleton } from '@/components/ui/LazyTool'

const CodeFormatterTool = dynamic(
  () => import('@/components/tools/CodeFormatterTool').then(m => ({ default: m.CodeFormatterTool })),
  { loading: () => <EditorSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Code Formatter — Beautify JS, TS, JSON, HTML, CSS, SQL Online',
  description:
    'Format and beautify JavaScript, TypeScript, JSON, HTML, CSS, SQL, XML & Markdown instantly. Free online code formatter — 100% client-side, no data sent to servers.',
  keywords: [
    'code formatter',
    'online code beautifier',
    'javascript formatter',
    'json formatter',
    'html formatter',
    'css formatter',
    'sql formatter',
    'typescript formatter',
    'xml formatter',
    'code beautify',
    'prettier alternative',
    'indent code online',
  ],
  openGraph: {
    title: 'Free Code Formatter — Beautify JS, JSON, HTML, CSS & More',
    description: 'Instantly format and beautify code in 8 languages. Runs entirely in your browser.',
    url: 'https://toolify-iota-gules.vercel.app/tools/code-formatter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Code Formatter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/code-formatter',
  description:
    'Free online code formatter supporting JavaScript, TypeScript, JSON, HTML, CSS, SQL, XML and Markdown. All processing is client-side — your code never leaves your browser.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'JavaScript formatting',
    'TypeScript formatting',
    'JSON beautifier',
    'HTML formatter',
    'CSS formatter',
    'SQL formatter',
    'XML formatter',
    'Markdown formatter',
    'File upload support',
    'Configurable indent (2 spaces, 4 spaces, tabs)',
    'Download formatted output',
    'Client-side only — zero data sent',
  ],
}

const RELATED = [
  { name: 'Hash Generator', slug: 'hash-generator' },
  { name: 'JSON → TypeBox', slug: 'json-to-typebox' },
  { name: 'Text Analyzer', slug: 'text-analyzer' },
]

export default function CodeFormatterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout
        title="Code Formatter"
        description="Beautify and format JavaScript, TypeScript, JSON, HTML, CSS, SQL, XML & Markdown instantly. Configurable indentation, file upload, and one-click copy — all client-side."
        category="Developer"
        categoryHref="/tools/dev"
        icon={Code2}
        gradient="from-slate-500 to-zinc-600"
        accentColor="rgba(100, 116, 139, 0.3)"
        relatedTools={RELATED}
      >
        <CodeFormatterTool />
      </ToolLayout>
    </>
  )
}
