import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { QrCode } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const QRCodeGeneratorTool = dynamic(
  () => import('@/components/tools/QRCodeGeneratorTool').then((m) => ({ default: m.QRCodeGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Free QR Code Generator — URL, WiFi, Email & More | Toolify',
  description:
    'Generate custom QR codes for URLs, WiFi, emails, phone numbers, SMS, and plain text. Customize colors and size. Download as PNG — 100% free, no signup required.',
  keywords: [
    'QR code generator',
    'free QR code',
    'QR code maker',
    'custom QR code',
    'WiFi QR code',
    'URL QR code',
    'QR code online',
    'QR code download',
  ],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/qr-code-generator' },
  openGraph: {
    title: 'Free QR Code Generator | Toolify',
    description: 'Create QR codes for URLs, WiFi, emails & more. Custom colors, instant download.',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'QR Code Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/qr-code-generator',
  description:
    'Generate custom QR codes for URLs, WiFi networks, emails, phone numbers, SMS messages, and plain text. Customize colors and download as PNG.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'URL QR codes',
    'WiFi QR codes',
    'Email QR codes',
    'Phone & SMS QR codes',
    'Custom colors',
    'PNG download',
    '100% free',
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this QR code generator free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free. No signup, no watermarks, no limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of QR codes can I create?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can create QR codes for URLs, plain text, email addresses, phone numbers, SMS messages, and WiFi networks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I customize the QR code colors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can choose any foreground and background color using color pickers or presets, and adjust the QR code size from 150px to 500px.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I download the QR code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Click the Download PNG button to save your QR code as a high-quality PNG image.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I create a WiFi QR code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Select the WiFi type, enter your network name (SSID), password, and security type (WPA, WEP, or open). The QR code will be generated automatically.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ToolLayout
        title="QR Code Generator"
        description="Create QR codes for URLs, WiFi, email, phone, SMS & text. Customize colors, download as PNG — free & instant."
        category="Developer"
        categoryHref="/tools/dev"
        icon={QrCode}
        gradient="from-emerald-500 to-teal-600"
        accentColor="rgba(16, 185, 129, 0.3)"
        relatedTools={[
          { name: 'Password Generator', slug: 'password-generator' },
          { name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'URL Encoder', slug: 'url-encoder' },
        ]}
      >
        <QRCodeGeneratorTool />

        {/* ── SEO Content Block ─────────────────────────── */}
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Free QR Code Generator — All Types, No Limits
            </h2>
            <p className="leading-relaxed mb-3">
              Toolify&apos;s QR Code Generator lets you instantly create QR codes for any purpose —
              websites, WiFi login, contact info, email links, phone numbers, and SMS messages.
              No account required, no watermarks, completely free.
            </p>
            <p className="leading-relaxed">
              Customize your QR code with any foreground and background color combination, choose from
              8 color presets for quick styling, and set the output size from 150px to 500px. Your QR
              code is generated in real-time as you type and can be downloaded as a high-resolution PNG
              image instantly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
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

