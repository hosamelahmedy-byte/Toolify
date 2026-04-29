import type { Metadata } from 'next'
import { Braces } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { EditorSkeleton } from '@/components/ui/LazyTool'

const JSONToTypeBoxTool = dynamic(
  () => import('@/components/tools/JSONToTypeBoxTool').then(m => ({ default: m.JSONToTypeBoxTool })),
  { loading: () => <EditorSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'JSON to TypeBox Converter — Free TypeScript Schema Generator',
  description:
    'Convert JSON objects to TypeBox schemas instantly. Supports nested objects, arrays, and auto-detects string formats (email, UUID, date-time). Free, no signup.',
  keywords: ['JSON to TypeBox', 'TypeBox schema', 'TypeScript schema generator', 'JSON schema converter', 'typebox converter', 'typescript validation'],
  openGraph: {
    title: 'JSON → TypeBox Converter — Instant TypeScript Schema',
    description: 'Convert any JSON object to TypeBox schema with smart type inference.',
    url: 'https://toolify.io/tools/json-to-typebox',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON to TypeBox Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/json-to-typebox',
  description: 'Free JSON to TypeBox schema converter for TypeScript developers.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  programmingLanguage: 'TypeScript',
}

const RELATED = [
  { name: 'Code Formatter', slug: 'code-formatter' },
  { name: 'Hash Generator', slug: 'hash-generator' },
  { name: 'Color Converter', slug: 'color-converter' },
]

export default function JSONToTypeBoxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout
        title="JSON → TypeBox Converter"
        description="Convert any JSON object to a fully-typed TypeBox schema. Smart type inference detects emails, UUIDs, dates, nested objects & arrays automatically."
        category="Developer"
        categoryHref="/tools/dev"
        icon={Braces}
        gradient="from-emerald-500 to-teal-500"
        accentColor="rgba(16, 185, 129, 0.3)"
        relatedTools={RELATED}
      >
        <JSONToTypeBoxTool />
      </ToolLayout>
    </>
  )
}
