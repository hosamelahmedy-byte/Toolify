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
  title: 'PDF Merge — Combine PDF Files Free Online (No Upload)',
  description: 'Merge multiple PDF files into one document instantly. Drag to reorder pages, combine PDFs in your browser. 100% free, no upload to server, no signup.',
  keywords: ['PDF merge', 'merge PDF online', 'combine PDF files', 'join PDF', 'PDF combiner', 'merge PDF free', 'online PDF merger', 'PDF joiner', 'merge multiple PDFs'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-merge' },
  openGraph: {
    title: 'PDF Merge — Combine PDF Files Free Online (No Upload)',
    description: 'Merge multiple PDF files into one document instantly. Drag to reorder pages, combine PDFs in your browser. 100% free, no upload to server, no signup.',
    url: 'https://toolify-iota-gules.vercel.app/tools/pdf-merge',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Merge',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/pdf-merge',
  description: 'Merge multiple PDF files into one document instantly. Drag to reorder pages, combine PDFs in your browser. 100% free, no upload to server, no signup.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Merge unlimited PDFs', 'Drag-to-reorder pages', 'Browser-based (no upload)', 'Instant download', 'No file size limit'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are my PDF files uploaded to a server?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. PDF Merge runs entirely in your browser using JavaScript. Your files never leave your device — they are processed locally, which means faster merging and complete privacy.' },
    },
    {
      '@type': 'Question',
      name: 'How many PDFs can I merge at once?',
      acceptedAnswer: { '@type': 'Answer', text: "There is no hard limit. You can add as many PDFs as you like. Performance depends on your device's memory, but the tool handles dozens of files efficiently." },
    },
    {
      '@type': 'Question',
      name: 'Can I reorder the PDFs before merging?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. After adding files, you can drag and drop them to set the desired order before merging.' },
    },
    {
      '@type': 'Question',
      name: 'Does it work on mobile?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool is fully responsive and works on iOS and Android mobile browsers.' },
    },
    {
      '@type': 'Question',
      name: 'Will the quality of my PDFs be affected?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. The merger combines PDF pages without re-rendering or compressing them, so output quality is identical to the original files.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="PDF Merge"
        description="Combine multiple PDF files into one instantly. Drag, reorder and merge. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileStack} gradient="from-red-500 to-rose-600"
        accentColor="rgba(239, 68, 68, 0.3)"
        relatedTools={[{ name: 'PDF Split', slug: 'pdf-split' },
          { name: 'Compress PDF', slug: 'compress-pdf' },
          { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <PDFMergeTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free PDF Merge — Combine PDF Files Online, No Upload</h2>
            <p className="leading-relaxed mb-3">
              Toolify's PDF Merge tool combines multiple PDF files into a single document — entirely in your browser. No files are ever uploaded to a server, so your documents stay private. Add as many PDFs as you need, drag to reorder them, and merge in seconds.
            </p>
            <p className="leading-relaxed">
              The output quality is identical to the originals — pages are combined without re-rendering or compression. Works on desktop and mobile browsers.
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

