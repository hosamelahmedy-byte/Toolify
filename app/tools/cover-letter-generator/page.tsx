import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { FileEdit } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const CoverLetterTool = dynamic(
  () => import('@/components/tools/CoverLetterTool').then(m => ({ default: m.CoverLetterTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator — Free, Tailored, No Signup | Toolify',
  description: 'Generate a professional cover letter tailored to any job in seconds. Paste your experience and the job description — AI writes the perfect cover letter. Free, no signup.',
  keywords: ['cover letter', 'AI cover letter generator', 'job application', 'resume', 'career', 'free cover letter'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/cover-letter-generator' },
  openGraph: {
    title: 'AI Cover Letter Generator — Free, Tailored, No Signup',
    description: 'Generate a professional cover letter tailored to any job in seconds. Free, no signup.',
    url: 'https://toolify-iota-gules.vercel.app/tools/cover-letter-generator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Cover Letter Generator',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/cover-letter-generator',
  description: 'Generate a professional, tailored cover letter in seconds using AI. Free, no signup required.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function CoverLetterGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="AI Cover Letter Generator"
        description="Paste the job description and your experience — get a tailored, professional cover letter in seconds. Free, no signup."
        category="AI Content"
        categoryHref="/tools/ai-content"
        icon={FileEdit}
        gradient="from-blue-500 to-indigo-600"
        accentColor="rgba(99, 102, 241, 0.3)"
        relatedTools={[
          { name: 'AI Text Enhancer', slug: 'ai-text-enhancer' },
          { name: 'Quiz Generator', slug: 'quiz-generator' },
          { name: 'Word Counter', slug: 'word-counter' },
        ]}
      >
        <CoverLetterTool />
      </ToolLayout>
    </>
  )
}
