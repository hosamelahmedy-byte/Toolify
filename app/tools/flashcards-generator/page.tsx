import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Layers } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const FlashcardsGeneratorTool = dynamic(
  () => import('@/components/tools/FlashcardsGeneratorTool').then(m => ({ default: m.FlashcardsGeneratorTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Flashcards Generator — Create Study Cards Instantly | Toolify',
  description: 'Turn any topic or text into study flashcards with AI. Perfect for students, teachers & lifelong learners. Free, no signup.',
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/flashcards-generator' },
}

export default function FlashcardsGeneratorPage() {
  return (
    <ToolLayout
      title="Flashcards Generator"
      description="Turn any topic or text into study flashcards instantly with AI. Free, no signup."
      category="AI Content"
      categoryHref="/tools/ai-content"
      icon={Layers}
      gradient="from-sky-500 to-cyan-500"
      accentColor="rgba(14, 165, 233, 0.3)"
      relatedTools={[
        { name: 'Quiz Generator', slug: 'quiz-generator' },
        { name: 'PDF Summarizer', slug: 'pdf-summarizer' },
        { name: 'AI Text Enhancer', slug: 'ai-text-enhancer' },
      ]}
    >
      <FlashcardsGeneratorTool />
    </ToolLayout>
  )
}
