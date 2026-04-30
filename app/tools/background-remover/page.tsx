import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ImageIcon } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const BackgroundRemoverTool = dynamic(
  () => import('@/components/tools/BackgroundRemoverTool').then(m => ({ default: m.BackgroundRemoverTool })),
  { loading: () => <ToolSkeleton rows={6} />, ssr: false }
)

// ── SEO Metadata ───────────────────────────────────────────
export const metadata: Metadata = {
  title: 'AI Background Remover — Remove Image Background Free Online',
  description:
    'Remove image backgrounds instantly with AI. No signup, no watermark, processed in your browser for full privacy. Supports PNG, JPG, WebP.',
  keywords: [
    'background remover', 'remove background online', 'remove image background free',
    'AI background remover', 'transparent background', 'background eraser',
    'remove bg free', 'photo background remover', 'no watermark background remover',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/background-remover' },
  openGraph: {
    title: 'AI Background Remover — Free, No Watermark, No Signup',
    description: 'Remove image backgrounds instantly with AI. Private, free, processed in your browser.',
    url: 'https://toolify-iota-gules.vercel.app/tools/background-remover',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Background Remover — Free Online Tool',
    description: 'Remove image backgrounds with AI. No watermark, no signup, fully private.',
  },
}

// ── JSON-LD Schema ─────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Background Remover',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/background-remover',
  description:
    'Free AI-powered background removal tool. Remove image backgrounds instantly in your browser with no watermark and no signup required.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'AI-powered background removal',
    'Client-side processing (private)',
    'No watermark',
    'PNG transparent download',
    'Drag & Drop upload',
    'Before/after comparison',
  ],
}

// ── FAQ Schema ─────────────────────────────────────────────
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the Background Remover completely free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100% free. No signup, no subscription, no watermark on downloaded images.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my image uploaded to a server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All processing happens directly in your browser using WebAssembly. Your images never leave your device, ensuring complete privacy.',
      },
    },
    {
      '@type': 'Question',
      name: 'What image formats are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can upload PNG, JPG, JPEG, and WebP images. The result is always downloaded as a transparent PNG.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum image size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Images up to 10MB are supported. For best results, use images under 5MB.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is the AI background removal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The tool uses a state-of-the-art AI model optimized for edge detection, handling complex subjects like hair and fine details with high accuracy.',
      },
    },
  ],
}

// ── Page ───────────────────────────────────────────────────
export default function BackgroundRemoverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <ToolLayout
        title="AI Background Remover"
        description="Remove image backgrounds instantly with AI. Processed entirely in your browser — no uploads, no watermark, no signup required."
        category="Image Tools"
        categoryHref="/tools"
        icon={ImageIcon}
        gradient="from-pink-500 to-rose-500"
        accentColor="rgba(244, 63, 94, 0.3)"
        relatedTools={[
          { name: 'Image to PDF', slug: 'image-to-pdf' },
          { name: 'QR Code Generator', slug: 'qr-code-generator' },
          { name: 'Color Converter', slug: 'color-converter' },
          { name: 'PDF Summarizer', slug: 'pdf-summarizer' },
        ]}
      >
        <BackgroundRemoverTool />

        {/* SEO Text Block */}
        <div className="mt-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              Free AI Background Remover — No Watermark, No Signup
            </h2>
            <p>
              Toolify's AI Background Remover uses a cutting-edge on-device AI model to instantly
              remove backgrounds from any photo. Unlike other tools, <strong>all processing happens
              in your browser</strong> — your images are never uploaded to any server, giving you
              complete privacy and lightning-fast results.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">Why Use This Tool?</h2>
            <ul className="space-y-1.5 list-disc list-inside">
              <li><strong>100% Private</strong> — Images stay on your device, never sent to a server.</li>
              <li><strong>No Watermark</strong> — Download clean, transparent PNG files for free.</li>
              <li><strong>No Limits</strong> — Process as many images as you want, no daily cap.</li>
              <li><strong>High Accuracy</strong> — AI handles hair, fur, and complex edges with precision.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqJsonLd.mainEntity.map((item) => (
                <div key={item.name}>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-0.5">{item.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}
