import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Palette } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const ColorConverterTool = dynamic(
  () => import('@/components/tools/ColorConverterTool').then(m => ({ default: m.ColorConverterTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Color Converter — HEX to RGB, HSL, OKLCH & CSS Converter',
  description: 'Convert colors between HEX, RGB, HSL, OKLCH and CSS color formats instantly. Free online color converter for designers and developers. Live preview included.',
  keywords: ['color converter', 'HEX to RGB', 'RGB to HEX', 'HSL converter', 'OKLCH converter', 'CSS color converter', 'color format converter', 'online color tool', 'hex color picker'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/color-converter' },
  openGraph: {
    title: 'Color Converter — HEX to RGB, HSL, OKLCH & CSS Converter',
    description: 'Convert colors between HEX, RGB, HSL, OKLCH and CSS color formats instantly. Free online color converter for designers and developers. Live preview included.',
    url: 'https://toolify-iota-gules.vercel.app/tools/color-converter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Color Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/color-converter',
  description: 'Convert colors between HEX, RGB, HSL, OKLCH and CSS color formats instantly. Free online color converter for designers and developers. Live preview included.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['HEX conversion', 'RGB conversion', 'HSL conversion', 'OKLCH conversion', 'Live color preview', 'CSS variable output', 'Tints & shades palette'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert a HEX color to RGB?',
      acceptedAnswer: { '@type': 'Answer', text: 'Paste your HEX code (e.g., #3b82f6) into the input field and the tool instantly shows the equivalent RGB, HSL, and OKLCH values.' },
    },
    {
      '@type': 'Question',
      name: 'What is OKLCH and why should I use it?',
      acceptedAnswer: { '@type': 'Answer', text: "OKLCH is a modern CSS color space that is perceptually uniform — meaning its lightness, chroma, and hue values match how humans perceive color. It's supported in modern browsers via the CSS color() function and produces more consistent gradients than RGB or HSL." },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for Tailwind CSS colors?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Tailwind CSS uses specific color values that you can convert to any format. Paste a Tailwind HEX value and get the RGB or HSL equivalent for custom CSS.' },
    },
    {
      '@type': 'Question',
      name: 'Does the tool support alpha / transparency?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can input RGBA and HSLA values with an alpha channel, and the tool displays the transparent color in the preview.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for accessibility checks?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool shows relative luminance values which you can use to manually check WCAG contrast ratios.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Color Converter"
        description="Convert between HEX, RGB, RGBA, HSL, HSLA, OKLCH & CMYK. Live color picker, tints & shades palette generator, analogous colors & CSS variables."
        category="Developer" categoryHref="/tools/dev"
        icon={Palette} gradient="from-rose-400 to-pink-500"
        accentColor="rgba(236, 72, 153, 0.3)"
        relatedTools={[{ name: 'Code Formatter', slug: 'code-formatter' },
          { name: 'Case Converter', slug: 'case-converter' },
          { name: 'QR Code Generator', slug: 'qr-code-generator' }]}
      >
        <ColorConverterTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Color Converter — HEX, RGB, HSL & OKLCH Instant Conversion</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Color Converter instantly translates any color between HEX, RGB, RGBA, HSL, HSLA, OKLCH, and CMYK formats. Enter a HEX code, pick a color with the live color picker, or paste an RGB value — all other formats update instantly.
            </p>
            <p className="leading-relaxed">
              The tints & shades palette generates 10 lighter and darker variations of your color, perfect for building design systems. Copy CSS variables, Tailwind config values, or raw color codes with one click.
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
