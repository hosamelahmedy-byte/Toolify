import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FileArchive } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const CompressPDFTool = dynamic(
  () => import('@/components/tools/CompressPDFTool').then(m => ({ default: m.CompressPDFTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Compress PDF — Free Online PDF Tool',
  description: 'Reduce PDF file size without losing quality. Fast and private. No signup required. Your files never leave your browser.',
  keywords: ['Compress PDF', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify.io/tools/compress-pdf' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Compress PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/compress-pdf',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Compress PDF"
        description="Reduce PDF file size without losing quality. Fast and private. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileArchive} gradient="from-yellow-500 to-orange-500"
        accentColor="rgba(234, 179, 8, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' }, { name: 'PDF Split', slug: 'pdf-split' }, { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <CompressPDFTool />
      </ToolLayout>
    </>
  )
}
