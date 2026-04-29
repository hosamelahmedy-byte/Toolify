import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { CalcSkeleton } from '@/components/ui/LazyTool'

const AgeCalculatorTool = dynamic(
  () => import('@/components/tools/AgeCalculatorTool').then(m => ({ default: m.AgeCalculatorTool })),
  { loading: () => <CalcSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Age Calculator — Exact Age in Years, Months, Days & Hours',
  description: 'Calculate your exact age in years, months, days, hours & minutes. Find days until next birthday, zodiac sign, birthstone & fun life statistics. Free.',
  keywords: ['age calculator','how old am i','birthday calculator','age in days','zodiac calculator','days until birthday'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Age Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/age-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function AgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Age Calculator"
        description="Calculate your exact age in years, months, days, hours & minutes. Get birthday countdown, zodiac sign, birthstone, and fascinating life statistics."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Calendar} gradient="from-violet-400 to-purple-500"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[
          { name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' },
          { name: 'Loan Calculator', slug: 'loan-calculator' },
        ]}
      >
        <AgeCalculatorTool />
      </ToolLayout>
    </>
  )
}
