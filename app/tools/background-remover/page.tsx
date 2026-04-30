import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const BackgroundRemoverTool = dynamic(
  () => import('@/components/tools/BackgroundRemoverTool').then(m => ({ default: m.BackgroundRemoverTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

export const metadata: Metadata = {
  title: 'AI Background Remover | Toolify',
  description: 'Remove image backgrounds instantly with AI. No watermark, no signup, processed privately.',
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/background-remover' },
}

export default function BackgroundRemoverToolPage() {
  return (
    <ToolLayout
      title="AI Background Remover"
      description="Remove image backgrounds instantly with AI. No watermark, no signup, processed privately."
      category="AI Content"
      categoryHref="/tools/ai-content"
      icon={undefined as any}
      gradient="from-pink-500 to-rose-500"
      accentColor="rgba(244, 63, 94, 0.3)"
      relatedTools={[
          { name: 'Image to PDF', slug: 'image-to-pdf' },
          { name: 'QR Code Generator', slug: 'qr-code-generator' },
          { name: 'Color Converter', slug: 'color-converter' }
      ]}
    >
      <BackgroundRemoverTool />
    </ToolLayout>
  )
}
