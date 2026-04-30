import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const QuizGeneratorTool = dynamic(
  () => import('@/components/tools/QuizGeneratorTool').then(m => ({ default: m.QuizGeneratorTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Quiz Generator | Toolify',
  description: 'Generate custom quizzes on any topic with AI. Multiple choice, true/false, or mixed. Free, no signup.',
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/quiz-generator' },
}

export default function QuizGeneratorToolPage() {
  return (
    <ToolLayout
      title="AI Quiz Generator"
      description="Generate custom quizzes on any topic with AI. Multiple choice, true/false, or mixed. Free, no signup."
      category="AI Content"
      categoryHref="/tools/ai-content"
      icon={undefined as any}
      gradient="from-violet-500 to-indigo-600"
      accentColor="rgba(139, 92, 246, 0.3)"
      relatedTools={[
          { name: 'Flashcards Generator', slug: 'flashcards-generator' },
          { name: 'PDF Summarizer', slug: 'pdf-summarizer' },
          { name: 'AI Text Enhancer', slug: 'ai-text-enhancer' }
      ]}
    >
      <QuizGeneratorTool />
    </ToolLayout>
  )
}
