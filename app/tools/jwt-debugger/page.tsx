import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { ShieldCheck } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const JWTDebuggerTool = dynamic(
  () => import('@/components/tools/JWTDebuggerTool').then(m => ({ default: m.JWTDebuggerTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'JWT Debugger — Free Online Tool',
  description: 'Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & algorithm. 100% client-side.',
  keywords: ['JWT debugger', 'decode JWT', 'JWT inspector', 'JSON Web Token', 'JWT claims', 'JWT expiry'],
  alternates: { canonical: 'https://toolify.io/tools/jwt-debugger' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWT Debugger',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/jwt-debugger',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="JWT Debugger"
        description="Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & algorithm. 100% client-side."
        category="Security" categoryHref="/tools/dev"
        icon={ShieldCheck} gradient="from-slate-600 to-slate-800"
        accentColor="rgba(100, 116, 139, 0.3)"
        relatedTools={[]}
      >
        <JWTDebuggerTool />
      </ToolLayout>
    </>
  )
}
