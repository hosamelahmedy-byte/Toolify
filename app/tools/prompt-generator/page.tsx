import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Sparkles } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PromptGeneratorTool = dynamic(
  () => import('@/components/tools/PromptGeneratorTool').then(m => ({ default: m.PromptGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Prompt Generator — Free ChatGPT, Claude & Midjourney Prompts',
  description: 'Generate optimized AI prompts for ChatGPT, Claude, Midjourney, DALL-E & Stable Diffusion. Free prompt generator with templates for writing, coding, images & more.',
  keywords: ['AI prompt generator', 'ChatGPT prompts', 'Claude prompts', 'Midjourney prompts', 'DALL-E prompt', 'AI prompt templates', 'prompt engineering tool', 'stable diffusion prompts', 'free prompt generator'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/prompt-generator' },
  openGraph: {
    title: 'AI Prompt Generator — Free ChatGPT, Claude & Midjourney Prompts',
    description: 'Generate optimized AI prompts for ChatGPT, Claude, Midjourney, DALL-E & Stable Diffusion. Free prompt generator with templates for writing, coding, images & more.',
    url: 'https://toolify-iota-gules.vercel.app/tools/prompt-generator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Prompt Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/prompt-generator',
  description: 'Generate optimized AI prompts for ChatGPT, Claude, Midjourney, DALL-E & Stable Diffusion. Free prompt generator with templates for writing, coding, images & more.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['ChatGPT prompt templates', 'Midjourney image prompts', 'Claude prompt optimization', 'Writing & creative prompts', 'Coding & developer prompts', 'One-click copy'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is prompt engineering?',
      acceptedAnswer: { '@type': 'Answer', text: 'Prompt engineering is the practice of crafting clear, specific instructions for AI models to get better, more accurate outputs. A well-structured prompt includes context, the desired output format, tone, and any constraints or examples.' },
    },
    {
      '@type': 'Question',
      name: 'Which AI models does this tool support?',
      acceptedAnswer: { '@type': 'Answer', text: 'The generator creates prompts optimized for ChatGPT (GPT-4), Claude (Anthropic), Midjourney, DALL-E 3, and Stable Diffusion. Each model has different strengths, and the tool adjusts prompt structure accordingly.' },
    },
    {
      '@type': 'Question',
      name: 'What makes a good AI prompt?',
      acceptedAnswer: { '@type': 'Answer', text: 'A good prompt is specific, provides context, states the desired format (list, essay, code, etc.), includes examples when helpful, and specifies tone or style. Vague prompts produce vague results.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use these prompts for image generation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool includes a dedicated image prompt mode optimized for Midjourney and DALL-E, using the correct syntax, style descriptors, and aspect ratio parameters.' },
    },
    {
      '@type': 'Question',
      name: 'Is this free to use?',
      acceptedAnswer: { '@type': 'Answer', text: 'Completely free. Generate as many prompts as you need without any account or payment.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="AI Prompt Generator"
        description="Build structured, high-quality prompts for ChatGPT, Claude, Gemini & Midjourney. Set role, tone, format, and advanced techniques like chain-of-thought."
        category="AI Content" categoryHref="/tools/ai-content"
        icon={Sparkles} gradient="from-amber-400 to-orange-500"
        accentColor="rgba(245, 158, 11, 0.3)"
        relatedTools={[{ name: 'AI Text Enhancer', slug: 'ai-text-enhancer' },
          { name: 'Word Counter', slug: 'word-counter' },
          { name: 'Text Analyzer', slug: 'text-analyzer' }]}
      >
        <PromptGeneratorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free AI Prompt Generator — ChatGPT, Claude & Midjourney</h2>
            <p className="leading-relaxed mb-3">
              Toolify's AI Prompt Generator helps you craft structured, effective prompts for the most popular AI models. Set a role for the AI, define the task, choose an output format (list, essay, code, table), select the tone, and add advanced techniques like chain-of-thought or few-shot examples.
            </p>
            <p className="leading-relaxed">
              The prompt quality score shows how comprehensive your prompt is before you use it — so you get better AI outputs on the first try.
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

