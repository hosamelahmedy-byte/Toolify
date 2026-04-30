import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Weight } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const BMICalculatorTool = dynamic(
  () => import('@/components/tools/BMICalculatorTool').then(m => ({ default: m.BMICalculatorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'BMI Calculator — Free Body Mass Index Calculator with Health Analysis',
  description: 'Calculate your BMI instantly. Get health category, ideal weight range, health risk assessment & personalized recommendations. Supports metric & imperial units. Free, no signup.',
  keywords: ['BMI calculator', 'body mass index calculator', 'ideal weight calculator', 'BMI chart', 'obesity calculator', 'health calculator', 'free BMI calculator'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/bmi-calculator' },
  openGraph: {
    title: 'BMI Calculator — Free Body Mass Index Calculator with Health Analysis',
    description: 'Calculate your BMI instantly. Get health category, ideal weight range, health risk assessment & personalized recommendations. Supports metric & imperial units. Free, no signup.',
    url: 'https://toolify-iota-gules.vercel.app/tools/bmi-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BMI Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/bmi-calculator',
  description: 'Calculate your BMI instantly. Get health category, ideal weight range, health risk assessment & personalized recommendations. Supports metric & imperial units. Free, no signup.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['BMI calculation', 'Health category classification', 'Ideal weight range', 'Metric & Imperial units', 'Health risk assessment'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is BMI and how is it calculated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Body Mass Index (BMI) is a measure of body fat based on height and weight. It is calculated by dividing your weight in kilograms by the square of your height in meters (kg/m²).' },
    },
    {
      '@type': 'Question',
      name: 'What are the BMI categories?',
      acceptedAnswer: { '@type': 'Answer', text: 'According to the WHO: Below 18.5 is Underweight, 18.5–24.9 is Normal weight, 25.0–29.9 is Overweight, and 30.0 and above is Obese.' },
    },
    {
      '@type': 'Question',
      name: 'Is BMI accurate for everyone?',
      acceptedAnswer: { '@type': 'Answer', text: 'BMI is a useful screening tool but has limitations. It may overestimate body fat in athletes with high muscle mass, and underestimate it in older adults who have lost muscle. Always consult a healthcare professional for a complete assessment.' },
    },
    {
      '@type': 'Question',
      name: 'What is a healthy BMI range?',
      acceptedAnswer: { '@type': 'Answer', text: 'A BMI between 18.5 and 24.9 is generally considered healthy for adults. However, optimal ranges can vary by age, sex, and ethnicity.' },
    },
    {
      '@type': 'Question',
      name: 'Does the calculator work with feet and pounds?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool supports both metric (kg/cm) and imperial (lbs/ft-in) units. Switch between them with the unit toggle.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="BMI Calculator"
        description="Calculate your Body Mass Index with full health analysis. Get your health category, ideal weight range, risk assessment & personalized recommendations."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Weight} gradient="from-green-500 to-emerald-600"
        accentColor="rgba(34, 197, 94, 0.3)"
        relatedTools={[{ name: 'BMR & TDEE Calculator', slug: 'bmr-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' },
          { name: 'Age Calculator', slug: 'age-calculator' }]}
      >
        <BMICalculatorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free BMI Calculator — Instant Body Mass Index & Health Analysis</h2>
            <p className="leading-relaxed mb-3">
              Toolify's BMI Calculator computes your Body Mass Index instantly from your height and weight. It supports both metric (kg/cm) and imperial (lbs/ft-in) units and shows your health category — Underweight, Normal, Overweight, or Obese — along with your ideal weight range and health risk level.
            </p>
            <p className="leading-relaxed">
              The calculator also provides personalized recommendations based on your result. While BMI is a useful screening tool, it has limitations — always consult a healthcare professional for a complete assessment.
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
