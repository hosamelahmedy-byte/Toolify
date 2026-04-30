import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FilePlus } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const WordToPDFTool = dynamic(
  () => import('@/components/tools/WordToPDFTool').then(m => ({ default: m.WordToPDFTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Word to PDF — Convert Text to PDF Free Online',
  description: 'Convert text or Word content to a clean, formatted PDF document. Free online Word to PDF converter — instant download, no signup, no upload to server.',
  keywords: ['Word to PDF', 'DOCX to PDF', 'convert Word to PDF', 'text to PDF', 'Word to PDF converter', 'free Word to PDF', 'document to PDF', 'create PDF from text'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/word-to-pdf' },
  openGraph: {
    title: 'Word to PDF — Convert Text to PDF Free Online',
    description: 'Convert text or Word content to a clean, formatted PDF document. Free online Word to PDF converter — instant download, no signup, no upload to server.',
    url: 'https://toolify-iota-gules.vercel.app/tools/word-to-pdf',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Word to PDF',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/word-to-pdf',
  description: 'Convert text or Word content to a clean, formatted PDF document. Free online Word to PDF converter — instant download, no signup, no upload to server.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Text to PDF conversion', 'Clean PDF formatting', 'Instant download', 'Browser-based', 'No signup required'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert Word to PDF?',
      acceptedAnswer: { '@type': 'Answer', text: 'Paste your text or Word document content into the editor, adjust any formatting options, and click Convert to PDF. The download starts immediately.' },
    },
    {
      '@type': 'Question',
      name: 'Does it preserve fonts and formatting?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool generates clean, professional PDFs with standard fonts. Complex formatting from Word (like multi-column layouts) is simplified into a clean document layout.' },
    },
    {
      '@type': 'Question',
      name: 'Is my document content kept private?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. All conversion happens in your browser — your content is never sent to our servers.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for professional documents?',
      acceptedAnswer: { '@type': 'Answer', text: 'Absolutely. The generated PDF is clean and suitable for resumes, letters, reports, and other professional documents.' },
    },
    {
      '@type': 'Question',
      name: "What's the difference between this and PDF Merge?",
      acceptedAnswer: { '@type': 'Answer', text: 'Word to PDF creates a new PDF from text content. PDF Merge combines existing PDF files into one. Use this tool when starting from text; use Merge when combining existing PDFs.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Word to PDF"
        description="Convert text content to a clean formatted PDF document. All processing happens locally in your browser — your files never leave your device."
        category="PDF Tools" categoryHref="/tools/pdf"
        icon={FilePlus} gradient="from-indigo-500 to-violet-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[{ name: 'PDF to Word', slug: 'pdf-to-word' },
          { name: 'PDF Merge', slug: 'pdf-merge' },
          { name: 'Image to PDF', slug: 'image-to-pdf' }]}
      >
        <WordToPDFTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Word to PDF Converter — Text to PDF Instant Download</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Word to PDF converter turns any text content into a clean, professional PDF document — instantly, in your browser. Paste your text, adjust formatting options, and download the PDF. No upload, no account, no waiting.
            </p>
            <p className="leading-relaxed">
              The generated PDF uses standard fonts and clean layout suitable for resumes, letters, reports, and business documents.
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

