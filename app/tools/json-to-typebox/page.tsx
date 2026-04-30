import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Braces } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const JSONToTypeBoxTool = dynamic(
  () => import('@/components/tools/JSONToTypeBoxTool').then(m => ({ default: m.JSONToTypeBoxTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'JSON to TypeBox — Free JSON Schema Generator for TypeScript',
  description: 'Convert any JSON object to a TypeBox schema instantly. Supports nested objects, arrays, optional fields & TypeScript types. Free online developer tool.',
  keywords: ['JSON to TypeBox', 'TypeBox schema generator', 'JSON schema converter', 'TypeScript schema', 'JSON to TypeScript', 'TypeBox converter', 'JSON schema tool', 'developer tool'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/json-to-typebox' },
  openGraph: {
    title: 'JSON to TypeBox — Free JSON Schema Generator for TypeScript',
    description: 'Convert any JSON object to a TypeBox schema instantly. Supports nested objects, arrays, optional fields & TypeScript types. Free online developer tool.',
    url: 'https://toolify-iota-gules.vercel.app/tools/json-to-typebox',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON → TypeBox Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/json-to-typebox',
  description: 'Convert any JSON object to a TypeBox schema instantly. Supports nested objects, arrays, optional fields & TypeScript types. Free online developer tool.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['JSON to TypeBox conversion', 'Nested object support', 'Array type inference', 'Optional field handling', 'TypeScript-ready output', 'One-click copy'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is TypeBox?',
      acceptedAnswer: { '@type': 'Answer', text: 'TypeBox is a TypeScript runtime type-checking library. It allows you to define JSON Schema-compatible types that work both at compile time (TypeScript) and at runtime for validation — making it popular in Fastify, Elysia, and API-first applications.' },
    },
    {
      '@type': 'Question',
      name: 'How do I use the generated TypeBox schema?',
      acceptedAnswer: { '@type': 'Answer', text: 'Install TypeBox with `npm install @sinclair/typebox`, then paste the generated schema into your TypeScript file. Use `Type.Check()` or integrate with a validator like Ajv for runtime validation.' },
    },
    {
      '@type': 'Question',
      name: 'Does it support nested JSON objects?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The converter recursively processes nested objects and arrays, generating the correct Type.Object() and Type.Array() wrappers at each level.' },
    },
    {
      '@type': 'Question',
      name: 'What JSON types are supported?',
      acceptedAnswer: { '@type': 'Answer', text: 'All standard JSON types: string, number, boolean, null, object, and array. The tool also attempts to infer formats such as email addresses, URLs, and date strings.' },
    },
    {
      '@type': 'Question',
      name: 'Is my JSON data safe?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All conversion happens in your browser — no JSON is sent to any server.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="JSON → TypeBox Converter"
        description="Convert any JSON object to a fully-typed TypeBox schema. Smart type inference detects emails, UUIDs, dates, nested objects & arrays automatically."
        category="Developer" categoryHref="/tools/dev"
        icon={Braces} gradient="from-emerald-500 to-teal-500"
        accentColor="rgba(16, 185, 129, 0.3)"
        relatedTools={[{ name: 'JSON → Zod & TypeBox', slug: 'json-to-zod' },
          { name: 'Code Formatter', slug: 'code-formatter' },
          { name: 'Hash Generator', slug: 'hash-generator' }]}
      >
        <JSONToTypeBoxTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">JSON to TypeBox Schema Converter — Free TypeScript Tool</h2>
            <p className="leading-relaxed mb-3">
              Paste any JSON object and instantly get a fully-typed TypeBox schema ready to use in your TypeScript project. The converter recursively handles nested objects and arrays, detects string formats like email and UUID, and marks null values as optional fields.
            </p>
            <p className="leading-relaxed">
              TypeBox is the schema validation library of choice for Fastify and Elysia developers. This tool eliminates the tedious manual work of writing schemas from scratch.
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
