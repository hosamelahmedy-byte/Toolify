import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PromptGeneratorTool = dynamic(
  () => import('@/components/tools/PromptGeneratorTool').then(m => ({ default: m.PromptGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Prompt Generator — Free Prompt Builder for ChatGPT, Claude & Midjourney',
  description:
    'Build optimized AI prompts for ChatGPT, Claude, Gemini & Midjourney. Role assignment, chain-of-thought, few-shot templates & quality scoring.',
  keywords: ['AI prompt generator', 'ChatGPT prompt', 'Claude prompt', 'Midjourney prompt', 'prompt engineering', 'prompt builder', 'AI prompts'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Prompt Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/prompt-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function PromptGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="AI Prompt Generator"
        description="Build structured, high-quality prompts for ChatGPT, Claude, Gemini & Midjourney. Set role, tone, format, and advanced techniques like chain-of-thought."
        category="AI Content"
        categoryHref="/tools/ai-content"
        icon={Sparkles}
        gradient="from-amber-400 to-orange-500"
        accentColor="rgba(245, 158, 11, 0.3)"
        relatedTools={[
          { name: 'Keyword Generator', slug: 'keyword-generator' },
          { name: 'Word Counter', slug: 'word-counter' },
        ]}
      >
        <PromptGeneratorTool />
      </ToolLayout>
    </>
  )
}

