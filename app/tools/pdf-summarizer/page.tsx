import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FileSearch } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PDFSummarizerTool = dynamic(
  () => import('@/components/tools/PDFSummarizerTool').then(m => ({ default: m.PDFSummarizerTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

export const metadata: Metadata = {
  title: 'PDF Summarizer | Toolify',
  description: 'Upload a PDF and get an AI-powered summary with key points. Fast, private, free.',
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/pdf-summarizer' },
}

export default function PDFSummarizerToolPage() {
  return (
    <ToolLayout
      title="PDF Summarizer"
      description="Upload a PDF and get an AI-powered summary with key points. Fast, private, free."
      category="AI Content"
      categoryHref="/tools/ai-content"
      icon={FileSearch}
      gradient="from-emerald-500 to-teal-500"
      accentColor="rgba(16, 185, 129, 0.3)"
      relatedTools={[
          { name: 'Flashcards Generator', slug: 'flashcards-generator' },
          { name: 'Quiz Generator', slug: 'quiz-generator' },
          { name: 'PDF Merge', slug: 'pdf-merge' },
      ]}
    >
      <PDFSummarizerTool />
    </ToolLayout>
  )
}
