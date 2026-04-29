import type { Metadata } from 'next'
import { Hash } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const HashGeneratorTool = dynamic(
  () => import('@/components/tools/HashGeneratorTool').then(m => ({ default: m.HashGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Hash Generator — MD5, SHA-1, SHA-256 & SHA-512 Online',
  description: 'Generate MD5, SHA-1, SHA-256 & SHA-512 hashes from text or files instantly. 100% client-side — your data never leaves your browser. Free, secure.',
  keywords: ['hash generator','MD5 generator','SHA-256','SHA-512','SHA-1','file hash','checksum','crypto hash online'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Hash Generator',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/hash-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['MD5','SHA-1','SHA-256','SHA-512','File hashing','Client-side only'],
}

export default function HashGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256 & SHA-512 cryptographic hashes from text or any file. All processing happens in your browser — zero data sent to servers."
        category="Developer" categoryHref="/tools/dev"
        icon={Hash} gradient="from-cyan-500 to-blue-500"
        accentColor="rgba(6, 182, 212, 0.3)"
        relatedTools={[
          { name: 'JSON → TypeBox', slug: 'json-to-typebox' },
          { name: 'Code Formatter', slug: 'code-formatter' },
          { name: 'Color Converter', slug: 'color-converter' },
        ]}
      >
        <HashGeneratorTool />
      </ToolLayout>
    </>
  )
}
