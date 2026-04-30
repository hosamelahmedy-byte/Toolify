import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Hash } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const HashGeneratorTool = dynamic(
  () => import('@/components/tools/HashGeneratorTool').then(m => ({ default: m.HashGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Hash Generator — Free MD5, SHA-1, SHA-256 & SHA-512 Online',
  description: 'Generate cryptographic hashes from text or files. Supports MD5, SHA-1, SHA-256, SHA-512 & more. Free, fast, secure hash generator — runs in your browser.',
  keywords: ['hash generator', 'MD5 generator', 'SHA-256 generator', 'SHA-512', 'SHA-1 hash', 'checksum generator', 'online hash tool', 'text to hash', 'file hash', 'cryptographic hash'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/hash-generator' },
  openGraph: {
    title: 'Hash Generator — Free MD5, SHA-1, SHA-256 & SHA-512 Online',
    description: 'Generate cryptographic hashes from text or files. Supports MD5, SHA-1, SHA-256, SHA-512 & more. Free, fast, secure hash generator — runs in your browser.',
    url: 'https://toolify-iota-gules.vercel.app/tools/hash-generator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Hash Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/hash-generator',
  description: 'Generate cryptographic hashes from text or files. Supports MD5, SHA-1, SHA-256, SHA-512 & more. Free, fast, secure hash generator — runs in your browser.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['MD5 hashing', 'SHA-1 hashing', 'SHA-256 hashing', 'SHA-512 hashing', 'File hash support', 'Uppercase/lowercase output'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a hash and what is it used for?',
      acceptedAnswer: { '@type': 'Answer', text: "A cryptographic hash is a fixed-length string generated from input data. It's used to verify file integrity, store passwords securely, and create digital signatures. The same input always produces the same hash output." },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between MD5 and SHA-256?',
      acceptedAnswer: { '@type': 'Answer', text: 'MD5 produces a 128-bit hash and is fast, but is no longer considered cryptographically secure. SHA-256 (part of the SHA-2 family) is 256 bits and remains secure for most use cases. Use SHA-256 or SHA-512 for security-critical applications.' },
    },
    {
      '@type': 'Question',
      name: 'Can I hash a file with this tool?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes. You can upload a file and the tool will compute its checksum. This is useful for verifying downloaded software matches the publisher's checksum." },
    },
    {
      '@type': 'Question',
      name: 'Is my data sent to your servers?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. All hashing runs in your browser using the Web Crypto API. Your text and files never leave your device.' },
    },
    {
      '@type': 'Question',
      name: 'Can a hash be reversed to get the original text?',
      acceptedAnswer: { '@type': 'Answer', text: 'No — hashing is a one-way process. You cannot mathematically reverse a hash to retrieve the original input.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256 & SHA-512 cryptographic hashes from text or any file. All processing happens in your browser — zero data sent to servers."
        category="Developer" categoryHref="/tools/dev"
        icon={Hash} gradient="from-cyan-500 to-blue-500"
        accentColor="rgba(6, 182, 212, 0.3)"
        relatedTools={[{ name: 'JWT Debugger', slug: 'jwt-debugger' },
          { name: 'Password Generator', slug: 'password-generator' },
          { name: 'Code Formatter', slug: 'code-formatter' }]}
      >
        <HashGeneratorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Hash Generator — MD5, SHA-1, SHA-256 & SHA-512 Online</h2>
            <p className="leading-relaxed mb-3">
              Generate cryptographic hashes from any text or file upload. Toolify's Hash Generator supports MD5, SHA-1, SHA-256, and SHA-512 — all computed locally in your browser using the Web Crypto API, so your data never leaves your device.
            </p>
            <p className="leading-relaxed">
              Use it to verify file integrity checksums, generate password hashes for testing, or compare hash outputs across algorithms. Toggle between uppercase and lowercase output as needed.
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

