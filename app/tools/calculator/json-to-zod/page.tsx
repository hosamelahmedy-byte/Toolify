import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Braces } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { EditorSkeleton } from '@/components/ui/LazyTool'

const JSONToZodTool = dynamic(
  () => import('@/components/tools/JSONToZodTool').then(m => ({ default: m.JSONToZodTool })),
  { loading: () => <EditorSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'JSON to Zod & TypeBox Converter — Free Schema Generator',
  description: 'Convert JSON to Zod or TypeBox schemas instantly. Smart type inference: email, UUID, datetime, nested objects, arrays, optional fields & unions.',
  keywords: ['JSON to Zod', 'Zod schema', 'TypeBox', 'TypeScript schema', 'JSON schema converter', 'Zod validator'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/json-to-zod' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JSON to Zod & TypeBox Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/json-to-zod',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Zod schema generation', 'TypeBox schema generation', 'Smart type inference', 'Nested objects', 'Arrays', 'Optional fields'],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="JSON → Zod & TypeBox"
        description="Convert any JSON to Zod or TypeBox schemas with smart type inference. Detects emails, UUIDs, dates, nested objects, arrays, optional fields & unions automatically."
        category="Developer" categoryHref="/tools/dev"
        icon={Braces} gradient="from-emerald-500 to-teal-600"
        accentColor="rgba(16, 185, 129, 0.3)"
        relatedTools={[
          { name: 'JSON → TypeBox (Legacy)', slug: 'json-to-typebox' },
          { name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'JWT Debugger', slug: 'jwt-debugger' },
        ]}
      >
        <JSONToZodTool />
      </ToolLayout>
    </>
  )
}

