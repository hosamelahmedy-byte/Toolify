import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FileStack } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PDFMergeTool = dynamic(
  () => import('@/components/tools/PDFMergeTool').then(m => ({ default: m.PDFMergeTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'PDF Merge — Free Online PDF Tool',
  description: 'Combine multiple PDF files into one instantly. Drag, reorder and merge. No signup required. Your files never leave your browser.',
  keywords: ['PDF Merge', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-merge' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Merge',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/pdf-merge',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="PDF Merge"
        description="Combine multiple PDF files into one instantly. Drag, reorder and merge. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileStack} gradient="from-red-500 to-rose-600"
        accentColor="rgba(239, 68, 68, 0.3)"
        relatedTools={[{ name: 'PDF Split', slug: 'pdf-split' }, { name: 'Compress PDF', slug: 'compress-pdf' }, { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <PDFMergeTool />
      </ToolLayout>
    </>
  )
}
