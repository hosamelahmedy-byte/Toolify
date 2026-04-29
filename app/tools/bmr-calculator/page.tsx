import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Activity } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const BMRCalculatorTool = dynamic(
  () => import('@/components/tools/BMRCalculatorTool').then(m => ({ default: m.BMRCalculatorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'BMR & TDEE Calculator — Free Online Tool',
  description: 'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure using Mifflin-St Jeor formula with macro breakdown.',
  keywords: ['BMR calculator', 'TDEE calculator', 'Mifflin St Jeor', 'calorie calculator', 'macros', 'daily calories'],
  alternates: { canonical: 'https://toolify.io/tools/bmr-calculator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BMR & TDEE Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/bmr-calculator',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="BMR & TDEE Calculator"
        description="Calculate Basal Metabolic Rate and Total Daily Energy Expenditure using Mifflin-St Jeor formula with macro breakdown."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Activity} gradient="from-orange-500 to-red-500"
        accentColor="rgba(249, 115, 22, 0.3)"
        relatedTools={[]}
      >
        <BMRCalculatorTool />
      </ToolLayout>
    </>
  )
}
