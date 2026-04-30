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
  title: 'Compress PDF — Reduce PDF File Size Free Online',
  description: 'Compress PDF files to reduce their size for email or upload. Free online PDF compressor — no quality loss, no upload to server, instant download.',
  keywords: ['compress PDF', 'PDF compressor', 'reduce PDF size', 'shrink PDF', 'PDF size reducer', 'compress PDF online free', 'optimize PDF', 'PDF file compression'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/compress-pdf' },
  openGraph: {
    title: 'Compress PDF — Reduce PDF File Size Free Online',
    description: 'Compress PDF files to reduce their size for email or upload. Free online PDF compressor — no quality loss, no upload to server, instant download.',
    url: 'https://toolify-iota-gules.vercel.app/tools/compress-pdf',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Compress PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/compress-pdf',
  description: 'Compress PDF files to reduce their size for email or upload. Free online PDF compressor — no quality loss, no upload to server, instant download.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['PDF compression', 'File size reduction', 'Browser-based (no upload)', 'Instant download', 'Maintains readability'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much can the PDF size be reduced?',
      acceptedAnswer: { '@type': 'Answer', text: 'Compression results depend on the content of the PDF. Image-heavy PDFs can be reduced by 50–80%. Text-only PDFs typically see a 10–30% reduction.' },
    },
    {
      '@type': 'Question',
      name: 'Will compression affect the readability of my PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool uses lossless compression techniques where possible. For image-heavy PDFs, slight quality reduction may occur at high compression levels, but text remains crisp and readable.' },
    },
    {
      '@type': 'Question',
      name: 'Why do I need to compress a PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Email systems often have attachment size limits (typically 10–25MB). File upload forms on websites may also cap uploads. Compressed PDFs are faster to share, store, and open.' },
    },
    {
      '@type': 'Question',
      name: 'Is my PDF sent to a server?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. All compression runs in your browser — your document is never uploaded anywhere.' },
    },
    {
      '@type': 'Question',
      name: 'Can I compress a scanned PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Scanned PDFs are essentially image files, and compressing their images can significantly reduce the file size.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Compress PDF"
        description="Reduce PDF file size without losing quality. Fast and private. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileArchive} gradient="from-yellow-500 to-orange-500"
        accentColor="rgba(234, 179, 8, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' },
          { name: 'PDF Split', slug: 'pdf-split' },
          { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <CompressPDFTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free PDF Compressor — Reduce PDF Size Without Losing Quality</h2>
            <p className="leading-relaxed mb-3">
              Toolify's PDF Compressor reduces your PDF file size for easy sharing via email or uploading to web forms — without sending your files to any server. Image-heavy PDFs can be reduced by 50–80%; text-based PDFs typically see a 10–30% reduction.
            </p>
            <p className="leading-relaxed">
              All compression runs in your browser using JavaScript. Your documents stay completely private and the output is immediately available to download.
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

