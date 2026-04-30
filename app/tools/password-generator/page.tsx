import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { KeyRound } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const PasswordGeneratorTool = dynamic(
  () => import('@/components/tools/PasswordGeneratorTool').then(m => ({ default: m.PasswordGeneratorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Password Generator — Free Secure Random Password Generator',
  description: 'Generate cryptographically secure random passwords with entropy scoring. Custom length, symbols, numbers & bulk generation. Free, no signup, 100% client-side.',
  keywords: ['password generator', 'secure password generator', 'random password generator', 'strong password generator', 'cryptographic password', 'bulk password generator', 'password entropy'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/password-generator' },
  openGraph: {
    title: 'Password Generator — Free Secure Random Password Generator',
    description: 'Generate cryptographically secure random passwords with entropy scoring. Custom length, symbols, numbers & bulk generation. Free, no signup, 100% client-side.',
    url: 'https://toolify-iota-gules.vercel.app/tools/password-generator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Secure Password Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/password-generator',
  description: 'Generate cryptographically secure random passwords with entropy scoring. Custom length, symbols, numbers & bulk generation. Free, no signup, 100% client-side.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Cryptographically secure', 'Entropy scoring', 'Custom length', 'Symbol/number options', 'Bulk generation', 'Client-side only'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What makes a password 'cryptographically secure'?",
      acceptedAnswer: { '@type': 'Answer', text: "The tool uses the browser's `window.crypto.getRandomValues()` API, which generates random numbers from the operating system's entropy source (hardware random number generators). This is far more secure than Math.random(), which is predictable." },
    },
    {
      '@type': 'Question',
      name: 'How long should my password be?',
      acceptedAnswer: { '@type': 'Answer', text: 'Security experts recommend at least 16 characters for most accounts, and 20+ for sensitive accounts like banking or email.' },
    },
    {
      '@type': 'Question',
      name: 'What is password entropy?',
      acceptedAnswer: { '@type': 'Answer', text: 'Entropy measures how unpredictable a password is, expressed in bits. Higher entropy means the password is harder to guess or brute-force.' },
    },
    {
      '@type': 'Question',
      name: 'Are the generated passwords stored anywhere?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Passwords are generated and displayed in your browser only and never saved or transmitted.' },
    },
    {
      '@type': 'Question',
      name: 'What is bulk password generation?',
      acceptedAnswer: { '@type': 'Answer', text: 'The bulk mode generates multiple unique passwords at once — useful for IT administrators setting up multiple accounts or testing systems.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Secure Password Generator"
        description="Generate cryptographically secure passwords with entropy scoring. Custom length, charset & bulk generation."
        category="Security" categoryHref="/tools/dev"
        icon={KeyRound} gradient="from-violet-600 to-purple-700"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[{ name: 'JWT Debugger', slug: 'jwt-debugger' },
          { name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'QR Code Generator', slug: 'qr-code-generator' }]}
      >
        <PasswordGeneratorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Secure Password Generator — Random, Strong & Cryptographic</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Password Generator uses the browser's built-in `window.crypto.getRandomValues()` API — the same randomness source used by security professionals — to generate truly unpredictable passwords. Choose length (8–128 characters), character sets, and generate one or many passwords at once.
            </p>
            <p className="leading-relaxed">
              The entropy score shows how strong each password is in bits. Higher entropy means exponentially harder to crack. Aim for 100+ bits for sensitive accounts.
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
