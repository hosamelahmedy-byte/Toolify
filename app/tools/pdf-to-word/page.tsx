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
  title: 'PDF to Word — Convert PDF to Editable Text Free Online',
  description: 'Extract text from PDF and convert to editable Word-style format. Free PDF to Word converter — works with text-based PDFs, instant download, no signup.',
  keywords: ['PDF to Word', 'PDF to DOCX', 'convert PDF to Word', 'PDF text extractor', 'PDF to editable text', 'PDF converter', 'free PDF to Word', 'extract text from PDF'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-to-word' },
  openGraph: {
    title: 'PDF to Word — Convert PDF to Editable Text Free Online',
    description: 'Extract text from PDF and convert to editable Word-style format. Free PDF to Word converter — works with text-based PDFs, instant download, no signup.',
    url: 'https://toolify-iota-gules.vercel.app/tools/pdf-to-word',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PDF to Word',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/pdf-to-word',
  description: 'Extract text from PDF and convert to editable Word-style format. Free PDF to Word converter — works with text-based PDFs, instant download, no signup.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['PDF text extraction', 'Editable Word format output', 'Preserves text formatting', 'Browser-based', 'Instant download'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of PDFs can be converted to Word?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool works best with text-based PDFs (created from Word, Excel, or other software). Scanned PDF documents are image-based and require OCR technology for text extraction.' },
    },
    {
      '@type': 'Question',
      name: 'Will formatting be preserved?',
      acceptedAnswer: { '@type': 'Answer', text: 'Basic text formatting such as headings, bold, and italics is preserved where possible. Complex layouts with columns, tables, and graphics may need manual adjustment after conversion.' },
    },
    {
      '@type': 'Question',
      name: 'Can I edit the converted file?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The output is an editable text file that you can open in Microsoft Word, Google Docs, or any word processor.' },
    },
    {
      '@type': 'Question',
      name: 'Is this free?',
      acceptedAnswer: { '@type': 'Answer', text: '100% free. No account required, no daily limits.' },
    },
    {
      '@type': 'Question',
      name: 'What if my PDF has images instead of text?',
      acceptedAnswer: { '@type': 'Answer', text: 'If your PDF is a scanned document (images of text), the tool cannot extract the text directly. For scanned PDFs, you would need an OCR tool.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="PDF to Word"
        description="Extract text from PDF and convert to editable format. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FileText} gradient="from-blue-600 to-blue-700"
        accentColor="rgba(37, 99, 235, 0.3)"
        relatedTools={[{ name: 'Word to PDF', slug: 'word-to-pdf' },
          { name: 'PDF Merge', slug: 'pdf-merge' },
          { name: 'Compress PDF', slug: 'compress-pdf' }]}
      >
        <PDFToWordTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free PDF to Word Converter — Extract & Edit PDF Text Online</h2>
            <p className="leading-relaxed mb-3">
              Toolify's PDF to Word tool extracts text from text-based PDF files and converts it into an editable format — all in your browser with no upload required. Open the result in Microsoft Word, Google Docs, or any word processor.
            </p>
            <p className="leading-relaxed">
              Works best with PDFs created from Word, Excel, or other software (not scanned image PDFs). Basic formatting such as headings and bold text is preserved where possible.
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
