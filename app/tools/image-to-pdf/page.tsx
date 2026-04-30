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
  title: 'Image to PDF — Convert JPG, PNG & WEBP to PDF Free Online',
  description: 'Convert JPG, PNG, WEBP & GIF images to PDF. Add multiple images into a single PDF document. Free, runs in browser, no upload needed. Instant download.',
  keywords: ['image to PDF', 'JPG to PDF', 'PNG to PDF', 'WEBP to PDF', 'convert image to PDF', 'photo to PDF', 'multiple images to PDF', 'free image to PDF converter'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/image-to-pdf' },
  openGraph: {
    title: 'Image to PDF — Convert JPG, PNG & WEBP to PDF Free Online',
    description: 'Convert JPG, PNG, WEBP & GIF images to PDF. Add multiple images into a single PDF document. Free, runs in browser, no upload needed. Instant download.',
    url: 'https://toolify-iota-gules.vercel.app/tools/image-to-pdf',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Image to PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/image-to-pdf',
  description: 'Convert JPG, PNG, WEBP & GIF images to PDF. Add multiple images into a single PDF document. Free, runs in browser, no upload needed. Instant download.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['JPG to PDF', 'PNG to PDF', 'WEBP to PDF', 'Multiple images to one PDF', 'Drag-to-reorder', 'Browser-based'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which image formats are supported?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool supports JPG/JPEG, PNG, WEBP, and GIF image formats.' },
    },
    {
      '@type': 'Question',
      name: 'Can I convert multiple images into one PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Add multiple images, drag to reorder them, and the tool combines them all into a single multi-page PDF document.' },
    },
    {
      '@type': 'Question',
      name: 'Will the image quality be preserved in the PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Images are embedded in the PDF at their original resolution without recompression.' },
    },
    {
      '@type': 'Question',
      name: 'Is there a limit to how many images I can convert?',
      acceptedAnswer: { '@type': 'Answer', text: 'There is no hard limit. You can add as many images as your device memory allows.' },
    },
    {
      '@type': 'Question',
      name: 'Do my images get uploaded to a server?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. The conversion happens entirely in your browser. Your photos never leave your device.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Image to PDF"
        description="Convert JPG, PNG and WEBP images to PDF. Multiple images supported. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={ImageIcon} gradient="from-blue-500 to-indigo-500"
        accentColor="rgba(59, 130, 246, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' },
          { name: 'Compress PDF', slug: 'compress-pdf' },
          { name: 'Word to PDF', slug: 'word-to-pdf' }]}
      >
        <ImageToPDFTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Image to PDF Converter — JPG, PNG & WEBP to PDF Online</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Image to PDF converter transforms JPG, PNG, and WEBP images into a PDF document instantly — all in your browser with no file upload. Add multiple images, drag them to set the order, and download a single multi-page PDF in seconds.
            </p>
            <p className="leading-relaxed">
              Images are embedded at their original resolution without recompression, preserving quality. Works on desktop and mobile without any software installation.
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
