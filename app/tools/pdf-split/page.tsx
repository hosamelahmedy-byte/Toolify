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
  title: 'PDF Split — Extract Pages & Split PDF Free Online',
  description: 'Split a PDF into individual pages or extract specific page ranges. Free, fast & private — runs in your browser. No upload, no signup, instant PDF download.',
  keywords: ['PDF split', 'split PDF online', 'extract PDF pages', 'PDF page extractor', 'separate PDF pages', 'PDF splitter free', 'split PDF by page', 'divide PDF'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-split' },
  openGraph: {
    title: 'PDF Split — Extract Pages & Split PDF Free Online',
    description: 'Split a PDF into individual pages or extract specific page ranges. Free, fast & private — runs in your browser. No upload, no signup, instant PDF download.',
    url: 'https://toolify-iota-gules.vercel.app/tools/pdf-split',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF Split',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/pdf-split',
  description: 'Split a PDF into individual pages or extract specific page ranges. Free, fast & private — runs in your browser. No upload, no signup, instant PDF download.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Split into individual pages', 'Extract page ranges', 'Browser-based processing', 'Instant download', 'Privacy-first (no upload)'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I extract specific pages from a PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Upload your PDF, select the page range or individual pages you want to extract, and click Split. The tool generates a new PDF with only those pages, ready to download instantly.' },
    },
    {
      '@type': 'Question',
      name: 'Can I split a PDF into individual pages?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes. Choose the 'Split all pages' option and the tool creates a separate PDF file for each page in your document." },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: { '@type': 'Answer', text: "Since processing happens in your browser, the only limit is your device's available memory. Most standard PDFs under 200MB process without issues." },
    },
    {
      '@type': 'Question',
      name: 'Does splitting reduce PDF quality?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Pages are extracted at their original quality without any re-rendering or compression.' },
    },
    {
      '@type': 'Question',
      name: 'Can I download multiple pages as one file?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can specify a page range (e.g., pages 3–7) and download those as a single PDF.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="PDF Split"
        description="Split PDF into individual pages or extract specific page ranges. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={Scissors} gradient="from-orange-500 to-amber-500"
        accentColor="rgba(249, 115, 22, 0.3)"
        relatedTools={[{ name: 'PDF Merge', slug: 'pdf-merge' },
          { name: 'Compress PDF', slug: 'compress-pdf' },
          { name: 'PDF to Word', slug: 'pdf-to-word' }]}
      >
        <PDFSplitTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free PDF Split — Extract & Separate PDF Pages Online</h2>
            <p className="leading-relaxed mb-3">
              Toolify's PDF Split tool lets you extract individual pages or specific page ranges from any PDF file — all in your browser with no upload required. Choose to split every page into a separate file, or enter a custom range like pages 3–7 to extract as one document.
            </p>
            <p className="leading-relaxed">
              Pages are extracted at their original quality without any re-rendering. Works on desktop and mobile browsers with no file size restrictions.
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

