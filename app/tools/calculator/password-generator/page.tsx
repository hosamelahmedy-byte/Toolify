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
  title: 'Secure Password Generator — Free Online Tool',
  description: 'Generate cryptographically secure passwords with entropy scoring. Custom length, charset & bulk generation.',
  keywords: ['password generator', 'secure password', 'random password', 'entropy', 'strong password', 'cryptographic'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/password-generator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Secure Password Generator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/password-generator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Secure Password Generator"
        description="Generate cryptographically secure passwords with entropy scoring. Custom length, charset & bulk generation."
        category="Security" categoryHref="/tools/dev"
        icon={KeyRound} gradient="from-violet-600 to-purple-700"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[]}
      >
        <PasswordGeneratorTool />
      </ToolLayout>
    </>
  )
}
