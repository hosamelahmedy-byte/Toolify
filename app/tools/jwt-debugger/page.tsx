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
  title: 'JWT Debugger — Decode & Inspect JWT Tokens Free Online',
  description: 'Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & signature. 100% client-side — your tokens never leave your browser.',
  keywords: ['JWT debugger', 'JWT decoder', 'decode JWT token', 'JWT inspector', 'JSON Web Token decoder', 'JWT viewer', 'JWT claims', 'JWT expiry checker', 'free JWT tool'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/jwt-debugger' },
  openGraph: {
    title: 'JWT Debugger — Decode & Inspect JWT Tokens Free Online',
    description: 'Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & signature. 100% client-side — your tokens never leave your browser.',
    url: 'https://toolify-iota-gules.vercel.app/tools/jwt-debugger',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JWT Debugger',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/jwt-debugger',
  description: 'Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & signature. 100% client-side — your tokens never leave your browser.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['JWT decoding', 'Header inspection', 'Payload viewer', 'Claims display', 'Expiry check', '100% client-side'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a JWT token?',
      acceptedAnswer: { '@type': 'Answer', text: 'JSON Web Token (JWT) is a compact, URL-safe format for representing claims between parties. It consists of three Base64URL-encoded parts separated by dots: a header (algorithm & type), a payload (claims/data), and a signature.' },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to paste my JWT here?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The debugger runs 100% in your browser — your token is never sent to any server. However, be careful about sharing JWTs in general, as they grant access until they expire.' },
    },
    {
      '@type': 'Question',
      name: 'Can this tool verify the JWT signature?',
      acceptedAnswer: { '@type': 'Answer', text: 'You can inspect the signature data, but full verification requires your secret or public key. The tool displays the signature algorithm and allows you to confirm expiry dates and claims.' },
    },
    {
      '@type': 'Question',
      name: "What is the 'exp' claim in a JWT?",
      acceptedAnswer: { '@type': 'Answer', text: "The 'exp' (expiration) claim specifies when the token expires, as a Unix timestamp (seconds since January 1, 1970). The debugger converts this to a human-readable date and shows whether the token is still valid." },
    },
    {
      '@type': 'Question',
      name: 'What JWT algorithms are supported?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool supports decoding JWTs signed with HS256, HS384, HS512, RS256, RS384, RS512, ES256, and more.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="JWT Debugger"
        description="Decode and inspect JWT tokens instantly. View header, payload, claims, expiry & algorithm. 100% client-side."
        category="Security" categoryHref="/tools/dev"
        icon={ShieldCheck} gradient="from-slate-600 to-slate-800"
        accentColor="rgba(100, 116, 139, 0.3)"
        relatedTools={[{ name: 'Hash Generator', slug: 'hash-generator' },
          { name: 'Password Generator', slug: 'password-generator' },
          { name: 'JSON → TypeBox', slug: 'json-to-typebox' }]}
      >
        <JWTDebuggerTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free JWT Debugger — Decode & Inspect JSON Web Tokens</h2>
            <p className="leading-relaxed mb-3">
              Toolify's JWT Debugger decodes any JSON Web Token and displays the header, payload, claims, algorithm, and expiry date — all in your browser with no data sent to any server. Paste a JWT token to instantly see its contents in a readable format.
            </p>
            <p className="leading-relaxed">
              The tool highlights whether the token is expired or still valid, converts Unix timestamps to human-readable dates, and color-codes the three token sections (header, payload, signature).
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

