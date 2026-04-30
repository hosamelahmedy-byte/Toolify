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
  title: 'BMR & TDEE Calculator — Free Calorie & Macro Calculator',
  description: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor. Get daily calorie needs & macro breakdown for your fitness goal.',
  keywords: ['BMR calculator', 'TDEE calculator', 'calorie calculator', 'basal metabolic rate', 'total daily energy expenditure', 'macro calculator', 'calorie needs calculator', 'Mifflin-St Jeor'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/bmr-calculator' },
  openGraph: {
    title: 'BMR & TDEE Calculator — Free Calorie & Macro Calculator',
    description: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor. Get daily calorie needs & macro breakdown for your fitness goal.',
    url: 'https://toolify-iota-gules.vercel.app/tools/bmr-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BMR & TDEE Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/bmr-calculator',
  description: 'Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using Mifflin-St Jeor. Get daily calorie needs & macro breakdown for your fitness goal.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['BMR calculation', 'TDEE with activity levels', 'Macro breakdown', 'Mifflin-St Jeor equation', 'Weight loss/gain goals', 'Metric & imperial'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between BMR and TDEE?',
      acceptedAnswer: { '@type': 'Answer', text: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by your activity level — the total calories you burn in a day.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Mifflin-St Jeor equation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mifflin-St Jeor is the most widely accepted formula for estimating BMR: For men: (10 × weight kg) + (6.25 × height cm) − (5 × age) + 5. For women: (10 × weight kg) + (6.25 × height cm) − (5 × age) − 161.' },
    },
    {
      '@type': 'Question',
      name: 'How many calories should I eat to lose weight?',
      acceptedAnswer: { '@type': 'Answer', text: 'A caloric deficit of 500 calories per day below your TDEE leads to approximately 0.5 kg (1 lb) of fat loss per week.' },
    },
    {
      '@type': 'Question',
      name: 'What are macros and why do they matter?',
      acceptedAnswer: { '@type': 'Answer', text: 'Macronutrients — protein, carbohydrates, and fat — are the three main sources of calories. The tool calculates recommended macro ratios based on your goal.' },
    },
    {
      '@type': 'Question',
      name: 'Is TDEE the same as maintenance calories?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Eating at your TDEE maintains your current weight. Eating below it causes weight loss; eating above causes weight gain.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="BMR & TDEE Calculator"
        description="Calculate Basal Metabolic Rate and Total Daily Energy Expenditure using Mifflin-St Jeor formula with macro breakdown."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Activity} gradient="from-orange-500 to-red-500"
        accentColor="rgba(249, 115, 22, 0.3)"
        relatedTools={[{ name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' },
          { name: 'Age Calculator', slug: 'age-calculator' }]}
      >
        <BMRCalculatorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free BMR & TDEE Calculator — Daily Calories & Macro Breakdown</h2>
            <p className="leading-relaxed mb-3">
              Toolify's BMR & TDEE Calculator uses the Mifflin-St Jeor equation — the most accurate formula for estimating resting metabolic rate — to compute how many calories your body burns at rest (BMR) and how many calories you actually burn each day based on your activity level (TDEE).
            </p>
            <p className="leading-relaxed">
              Select your goal — weight loss, maintenance, or muscle gain — and get a tailored calorie target with a recommended protein, carbohydrate, and fat breakdown (macros).
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
