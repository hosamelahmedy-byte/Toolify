import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Ruler } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const UnitConverterTool = dynamic(
  () => import('@/components/tools/UnitConverterTool').then(m => ({ default: m.UnitConverterTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Unit Converter — Free Length, Weight, Temperature & Volume Converter',
  description: 'Convert length, weight, temperature, volume, area, speed & time units instantly. Free online unit converter with 100+ measurement units. No signup required.',
  keywords: ['unit converter', 'length converter', 'weight converter', 'temperature converter', 'volume converter', 'metric to imperial', 'km to miles', 'kg to lbs', 'Celsius to Fahrenheit'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/unit-converter' },
  openGraph: {
    title: 'Unit Converter — Free Length, Weight, Temperature & Volume Converter',
    description: 'Convert length, weight, temperature, volume, area, speed & time units instantly. Free online unit converter with 100+ measurement units. No signup required.',
    url: 'https://toolify-iota-gules.vercel.app/tools/unit-converter',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Unit Converter',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/unit-converter',
  description: 'Convert length, weight, temperature, volume, area, speed & time units instantly. Free online unit converter with 100+ measurement units. No signup required.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Length conversion', 'Weight conversion', 'Temperature conversion', 'Volume conversion', 'Speed conversion', 'Area conversion', 'Digital storage'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What unit categories does the converter support?',
      acceptedAnswer: { '@type': 'Answer', text: 'The converter supports length (meters, feet, inches, miles, km), weight (kg, lbs, grams, ounces), temperature (Celsius, Fahrenheit, Kelvin), volume (liters, gallons, ml, fl oz), speed (mph, km/h, m/s), and area (m², ft², acres, hectares).' },
    },
    {
      '@type': 'Question',
      name: 'How do I convert Celsius to Fahrenheit?',
      acceptedAnswer: { '@type': 'Answer', text: 'Select the Temperature category, enter your Celsius value, and instantly see the Fahrenheit equivalent. The formula is °F = (°C × 9/5) + 32.' },
    },
    {
      '@type': 'Question',
      name: 'Can I convert km to miles?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Select Length, enter the distance in kilometers, and the tool shows the equivalent in miles (1 km = 0.621371 miles).' },
    },
    {
      '@type': 'Question',
      name: 'Does the tool support cooking measurements?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The volume category includes cups, tablespoons, teaspoons, and fluid ounces alongside metric volume units — great for recipe conversions.' },
    },
    {
      '@type': 'Question',
      name: 'Is this accurate for scientific use?',
      acceptedAnswer: { '@type': 'Answer', text: 'The converter uses precise conversion factors and is accurate for everyday and most scientific purposes.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Unit Converter"
        description="Convert between all units of length, weight, temperature, volume, area, speed & digital storage. See all conversions at once, filter by unit name."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Ruler} gradient="from-sky-500 to-blue-500"
        accentColor="rgba(14, 165, 233, 0.3)"
        relatedTools={[{ name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Age Calculator', slug: 'age-calculator' },
          { name: 'Loan Calculator', slug: 'loan-calculator' }]}
      >
        <UnitConverterTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Unit Converter — Length, Weight, Temperature & More</h2>
            <p className="leading-relaxed mb-3">
              Convert any measurement between metric and imperial units instantly. Toolify's Unit Converter covers 7 categories — length, weight/mass, temperature, volume, area, speed, and digital storage — and shows all equivalent values simultaneously so you don't have to convert one at a time.
            </p>
            <p className="leading-relaxed">
              Whether you're converting km to miles for a road trip, kg to lbs for a recipe, or Celsius to Fahrenheit for the weather, the result appears immediately with high precision.
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

