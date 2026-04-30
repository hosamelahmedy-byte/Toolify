import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Scissors } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PDFSplitTool = dynamic(
  () => import('@/components/tools/PDFSplitTool').then(m => ({ default: m.PDFSplitTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'PDF Split — Free Online PDF Tool',
  description: 'Split PDF into individual pages or extract specific page ranges. No signup required. Your files never leave your browser.',
  keywords: ['PDF Split', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-split' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Split',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/pdf-split',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="PDF Split"
        description="Split PDF into individual pages or extract specific page ranges. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={Scissors} gradient="from-orange-500 to-amber-500"
        accentColor="rgba(249, 115, 22, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' }, { name: 'Compress PDF', slug: 'compress-pdf' }, { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <PDFSplitTool />
      </ToolLayout>
    </>
  )
}

