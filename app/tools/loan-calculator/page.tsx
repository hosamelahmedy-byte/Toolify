import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { DollarSign } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const LoanCalculatorTool = dynamic(
  () => import('@/components/tools/LoanCalculatorTool').then(m => ({ default: m.LoanCalculatorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Loan Calculator — Free Monthly Payment & Amortization Calculator',
  description: 'Calculate loan monthly payments, total interest paid & full amortization schedule. Works for mortgages, car loans, personal loans & student loans. Free, instant.',
  keywords: ['loan calculator', 'mortgage calculator', 'monthly payment calculator', 'amortization calculator', 'car loan calculator', 'interest calculator', 'personal loan calculator', 'EMI calculator'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/loan-calculator' },
  openGraph: {
    title: 'Loan Calculator — Free Monthly Payment & Amortization Calculator',
    description: 'Calculate loan monthly payments, total interest paid & full amortization schedule. Works for mortgages, car loans, personal loans & student loans. Free, instant.',
    url: 'https://toolify-iota-gules.vercel.app/tools/loan-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Loan Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/loan-calculator',
  description: 'Calculate loan monthly payments, total interest paid & full amortization schedule. Works for mortgages, car loans, personal loans & student loans. Free, instant.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Monthly payment calculation', 'Total interest computation', 'Full amortization schedule', 'Works for all loan types', 'Instant results'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is the monthly loan payment calculated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Monthly payment is calculated using the standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where P is the principal, r is the monthly interest rate, and n is the number of monthly payments.' },
    },
    {
      '@type': 'Question',
      name: 'What is an amortization schedule?',
      acceptedAnswer: { '@type': 'Answer', text: 'An amortization schedule shows how each monthly payment is split between principal repayment and interest over the life of the loan. Early payments are mostly interest; later payments are mostly principal.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for mortgage calculations?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enter the home loan amount, the annual interest rate offered by your lender, and the loan term (typically 15 or 30 years) to see your monthly mortgage payment.' },
    },
    {
      '@type': 'Question',
      name: 'What happens if I make extra payments?',
      acceptedAnswer: { '@type': 'Answer', text: 'Making extra principal payments reduces the outstanding balance, which reduces future interest charges and shortens your loan term. Check with your lender about any prepayment penalties.' },
    },
    {
      '@type': 'Question',
      name: 'Is this a replacement for financial advice?',
      acceptedAnswer: { '@type': 'Answer', text: 'This calculator is for educational and planning purposes. For actual loan decisions, consult a qualified financial advisor or lender.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Loan Calculator"
        description="Calculate monthly payments, total interest paid & full amortization schedule for any loan. Supports mortgages, car loans, student loans & personal loans."
        category="Calculators" categoryHref="/tools/calculator"
        icon={DollarSign} gradient="from-yellow-400 to-amber-500"
        accentColor="rgba(245, 158, 11, 0.3)"
        relatedTools={[{ name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Age Calculator', slug: 'age-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' }]}
      >
        <LoanCalculatorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Loan Calculator — Monthly Payments & Amortization Schedule</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Loan Calculator computes your exact monthly payment, total interest, and full amortization schedule for any loan type. Enter the principal amount, annual interest rate, and loan term to see a complete breakdown of how each payment is split between principal and interest over time.
            </p>
            <p className="leading-relaxed">
              Works for mortgages, car loans, personal loans, and student loans. The amortization table shows payment milestones — when you'll have paid off 25%, 50%, and 75% of the principal.
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
