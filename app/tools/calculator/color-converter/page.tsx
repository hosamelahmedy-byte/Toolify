import type { Metadata } from 'next'
import { Palette } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const ColorConverterTool = dynamic(
  () => import('@/components/tools/ColorConverterTool').then(m => ({ default: m.ColorConverterTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Color Converter — HEX, RGB, HSL, OKLCH & CMYK Converter',
  description: 'Convert colors between HEX, RGB, RGBA, HSL, OKLCH & CMYK instantly. Live preview, tints & shades palette, analogous colors. Free CSS color tool.',
  keywords: ['color converter','hex to rgb','rgb to hex','hsl converter','oklch','cmyk converter','css colors','color palette'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Color Converter',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/color-converter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function ColorConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Color Converter"
        description="Convert between HEX, RGB, RGBA, HSL, HSLA, OKLCH & CMYK. Live color picker, tints & shades palette generator, analogous colors & CSS variables."
        category="Developer" categoryHref="/tools/dev"
        icon={Palette} gradient="from-rose-400 to-pink-500"
        accentColor="rgba(236, 72, 153, 0.3)"
        relatedTools={[
          { name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'Code Formatter', slug: 'code-formatter' },
        ]}
      >
        <ColorConverterTool />
      </ToolLayout>
    </>
  )
}
