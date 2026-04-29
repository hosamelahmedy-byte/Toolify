import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ImageIcon } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const ImageToPDFTool = dynamic(
  () => import('@/components/tools/ImageToPDFTool').then(m => ({ default: m.ImageToPDFTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Image to PDF — Free Online PDF Tool',
  description: 'Convert JPG, PNG and WEBP images to PDF. Multiple images supported. No signup required. Your files never leave your browser.',
  keywords: ['Image to PDF', 'PDF', 'free PDF tool', 'online PDF', 'no upload'],
  alternates: { canonical: 'https://toolify.io/tools/image-to-pdf' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Image to PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/image-to-pdf',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Image to PDF"
        description="Convert JPG, PNG and WEBP images to PDF. Multiple images supported. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={ImageIcon} gradient="from-blue-500 to-indigo-500"
        accentColor="rgba(59, 130, 246, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' }, { name: 'PDF Split', slug: 'pdf-split' }, { name: 'Compress PDF', slug: 'compress-pdf' }]}
      >
        <ImageToPDFTool />
      </ToolLayout>
    </>
  )
}
