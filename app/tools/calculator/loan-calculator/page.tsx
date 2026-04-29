import type { Metadata } from 'next'
import { DollarSign } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { CalcSkeleton } from '@/components/ui/LazyTool'

const LoanCalculatorTool = dynamic(
  () => import('@/components/tools/LoanCalculatorTool').then(m => ({ default: m.LoanCalculatorTool })),
  { loading: () => <CalcSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Loan Calculator — Monthly Payment, Total Interest & Amortization Schedule',
  description: 'Calculate monthly loan payments, total interest, and full amortization schedule for mortgages, car loans, personal loans & student loans. Free, instant.',
  keywords: ['loan calculator','mortgage calculator','monthly payment calculator','amortization schedule','interest calculator','car loan calculator'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Loan Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/loan-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Monthly payment','Total interest','Amortization schedule','Payment breakdown','Loan milestones'],
}

export default function LoanCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Loan Calculator"
        description="Calculate monthly payments, total interest paid & full amortization schedule for any loan. Supports mortgages, car loans, student loans & personal loans."
        category="Calculators" categoryHref="/tools/calculator"
        icon={DollarSign} gradient="from-yellow-400 to-amber-500"
        accentColor="rgba(245, 158, 11, 0.3)"
        relatedTools={[
          { name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' },
          { name: 'Age Calculator', slug: 'age-calculator' },
        ]}
      >
        <LoanCalculatorTool />
      </ToolLayout>
    </>
  )
}
