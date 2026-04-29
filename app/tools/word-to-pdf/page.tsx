import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FilePlus } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const WordToPDFTool = dynamic(
  () => import('@/components/tools/WordToPDFTool').then(m => ({ default: m.WordToPDFTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Word to PDF — Free Online PDF Tool',
  description: 'Convert text content to a clean formatted PDF document. No signup required. Your files never leave your browser.',
  keywords: ['Word to PDF', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify.io/tools/word-to-pdf' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Word to PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/word-to-pdf',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Word to PDF"
        description="Convert text content to a clean formatted PDF document. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FilePlus} gradient="from-indigo-500 to-violet-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' }, { name: 'PDF Split', slug: 'pdf-split' }, { name: 'Compress PDF', slug: 'compress-pdf' }]}
      >
        <WordToPDFTool />
      </ToolLayout>
    </>
  )
}
