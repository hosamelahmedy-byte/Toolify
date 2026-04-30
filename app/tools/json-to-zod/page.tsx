import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Braces } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const JSONToZodTool = dynamic(
  () => import('@/components/tools/JSONToZodTool').then(m => ({ default: m.JSONToZodTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'JSON to Zod & TypeBox — Free TypeScript Schema Generator',
  description: 'Convert JSON to Zod or TypeBox schemas with smart type inference. Supports email, UUID, datetime, nested objects & unions. Free online TypeScript schema tool.',
  keywords: ['JSON to Zod', 'JSON to TypeBox', 'Zod schema generator', 'TypeScript schema', 'JSON schema converter', 'Zod validator generator', 'TypeBox schema tool', 'JSON type inference'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/json-to-zod' },
  openGraph: {
    title: 'JSON to Zod & TypeBox — Free TypeScript Schema Generator',
    description: 'Convert JSON to Zod or TypeBox schemas with smart type inference. Supports email, UUID, datetime, nested objects & unions. Free online TypeScript schema tool.',
    url: 'https://toolify-iota-gules.vercel.app/tools/json-to-zod',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON → Zod & TypeBox',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/json-to-zod',
  description: 'Convert JSON to Zod or TypeBox schemas with smart type inference. Supports email, UUID, datetime, nested objects & unions. Free online TypeScript schema tool.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Zod schema generation', 'TypeBox schema generation', 'Smart type inference', 'Email/UUID/datetime detection', 'Nested objects & arrays', 'Union types'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Zod and why should I use it?',
      acceptedAnswer: { '@type': 'Answer', text: "Zod is a TypeScript-first schema validation library. It lets you define data schemas that work for both static TypeScript types and runtime validation. It's popular in Next.js, tRPC, and React Hook Form projects." },
    },
    {
      '@type': 'Question',
      name: 'How does smart type inference work?',
      acceptedAnswer: { '@type': 'Answer', text: "The tool analyzes your JSON values to detect specific formats beyond the basic JSON types. For example, it recognizes 'user@example.com' as an email, '2024-01-15' as a date, and UUIDs — generating the appropriate Zod validators like z.string().email()." },
    },
    {
      '@type': 'Question',
      name: 'When should I use Zod vs TypeBox?',
      acceptedAnswer: { '@type': 'Answer', text: 'Use Zod for most TypeScript projects — it has excellent DX and ecosystem support. Use TypeBox when building APIs with Fastify or Elysia, or when you need JSON Schema compatibility.' },
    },
    {
      '@type': 'Question',
      name: 'Does it support optional fields?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. JSON fields with null values are inferred as optional (z.optional() in Zod, Type.Optional() in TypeBox).' },
    },
    {
      '@type': 'Question',
      name: 'Can I switch between Zod and TypeBox output?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Toggle between Zod and TypeBox output with a single click after generating the schema.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="JSON → Zod & TypeBox"
        description="Convert any JSON to Zod or TypeBox schemas with smart type inference. Detects emails, UUIDs, dates, nested objects, arrays, optional fields & unions automatically."
        category="Developer" categoryHref="/tools/dev"
        icon={Braces} gradient="from-emerald-500 to-teal-600"
        accentColor="rgba(16, 185, 129, 0.3)"
        relatedTools={[{ name: 'JSON → TypeBox', slug: 'json-to-typebox' },
          { name: 'Code Formatter', slug: 'code-formatter' },
          { name: 'JWT Debugger', slug: 'jwt-debugger' }]}
      >
        <JSONToZodTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free JSON to Zod & TypeBox Schema Generator</h2>
            <p className="leading-relaxed mb-3">
              Toolify's JSON to Zod & TypeBox converter is the most advanced schema generator available. Paste any JSON object and get a Zod or TypeBox schema with intelligent type inference — automatically detecting email addresses, UUIDs, datetime strings, nullable fields, nested objects, and arrays.
            </p>
            <p className="leading-relaxed">
              Toggle between Zod and TypeBox output with one click. The generated schema is ready to paste into your TypeScript project with zero modifications.
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
