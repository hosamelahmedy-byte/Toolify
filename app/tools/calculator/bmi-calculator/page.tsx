import type { Metadata } from 'next'
import { Weight } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { CalcSkeleton } from '@/components/ui/LazyTool'

const BMICalculatorTool = dynamic(
  () => import('@/components/tools/BMICalculatorTool').then(m => ({ default: m.BMICalculatorTool })),
  { loading: () => <CalcSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'BMI Calculator — Free Body Mass Index Calculator with Health Analysis',
  description:
    'Calculate your BMI instantly. Get health category, ideal weight range, health risk level & personalized recommendations. Supports metric & imperial units.',
  keywords: ['BMI calculator', 'body mass index', 'ideal weight', 'health calculator', 'obesity calculator', 'BMI chart'],
  openGraph: {
    title: 'Free BMI Calculator — Instant Body Mass Index Analysis',
    description: 'Calculate BMI with health category, ideal weight range & personalized health tips.',
    url: 'https://toolify-iota-gules.vercel.app/tools/bmi-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BMI Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/bmi-calculator',
  description: 'Free BMI calculator with health category classification and personalized recommendations.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['BMI calculation', 'Health category', 'Ideal weight range', 'Metric & Imperial units', 'Health recommendations'],
}

const RELATED = [
  { name: 'Unit Converter', slug: 'unit-converter' },
  { name: 'Age Calculator', slug: 'age-calculator' },
  { name: 'Loan Calculator', slug: 'loan-calculator' },
]

export default function BMICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolLayout
        title="BMI Calculator"
        description="Calculate your Body Mass Index with full health analysis. Get your health category, ideal weight range, risk assessment & personalized recommendations."
        category="Calculators"
        categoryHref="/tools/calculator"
        icon={Weight}
        gradient="from-green-500 to-emerald-600"
        accentColor="rgba(34, 197, 94, 0.3)"
        relatedTools={RELATED}
      >
        <BMICalculatorTool />
      </ToolLayout>
    </>
  )
}
