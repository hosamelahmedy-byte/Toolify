import type { Metadata } from 'next'
import { Ruler } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import dynamic from 'next/dynamic'
import { CalcSkeleton } from '@/components/ui/LazyTool'

const UnitConverterTool = dynamic(
  () => import('@/components/tools/UnitConverterTool').then(m => ({ default: m.UnitConverterTool })),
  { loading: () => <CalcSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Unit Converter — Length, Weight, Temperature, Volume & More',
  description: 'Free unit converter: length, weight/mass, temperature, volume, area, speed & digital storage. Instant multi-unit conversion with all results at once.',
  keywords: ['unit converter','length converter','weight converter','temperature converter','metric imperial','unit conversion calculator'],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Unit Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify.io/tools/unit-converter',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Length','Weight','Temperature','Volume','Area','Speed','Digital Storage'],
}

export default function UnitConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolLayout
        title="Unit Converter"
        description="Convert between all units of length, weight, temperature, volume, area, speed & digital storage. See all conversions at once, filter by unit name."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Ruler} gradient="from-sky-500 to-blue-500"
        accentColor="rgba(14, 165, 233, 0.3)"
        relatedTools={[
          { name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Loan Calculator', slug: 'loan-calculator' },
          { name: 'Age Calculator', slug: 'age-calculator' },
        ]}
      >
        <UnitConverterTool />
      </ToolLayout>
    </>
  )
}
