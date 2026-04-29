import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FileText } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PDFToWordTool = dynamic(
  () => import('@/components/tools/PDFToWordTool').then(m => ({ default: m.PDFToWordTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'PDF to Word — Free Online PDF Tool',
  description: 'Extract text from PDF and convert to editable format. No signup required. Your files never leave your browser.',
  keywords: ['PDF to Word', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify.io/tools/pdf-to-word' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF to Word',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/pdf-to-word',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="PDF to Word"
        description="Extract text from PDF and convert to editable format. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileText} gradient="from-blue-600 to-blue-700"
        accentColor="rgba(37, 99, 235, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' }, { name: 'PDF Split', slug: 'pdf-split' }, { name: 'Compress PDF', slug: 'compress-pdf' }]}
      >
        <PDFToWordTool />
      </ToolLayout>
    </>
  )
}
