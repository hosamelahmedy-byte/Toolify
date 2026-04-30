import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Calendar } from 'lucide-react'
import { ToolLayout } from '@/components/layout/ToolLayout'
import { ToolSkeleton } from '@/components/ui/LazyTool'

const AgeCalculatorTool = dynamic(
  () => import('@/components/tools/AgeCalculatorTool').then(m => ({ default: m.AgeCalculatorTool })),
  { loading: () => <ToolSkeleton />, ssr: false }
)

export const metadata: Metadata = {
  title: 'Age Calculator — Calculate Exact Age in Years, Months & Days',
  description: 'Calculate your exact age in years, months, days, hours & minutes. Find the time between any two dates. Free online age calculator — fast & accurate.',
  keywords: ['age calculator', 'date of birth calculator', 'exact age calculator', 'age in days', 'date difference calculator', 'birthday calculator', 'how old am I', 'age finder'],
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/tools/age-calculator' },
  openGraph: {
    title: 'Age Calculator — Calculate Exact Age in Years, Months & Days',
    description: 'Calculate your exact age in years, months, days, hours & minutes. Find the time between any two dates. Free online age calculator — fast & accurate.',
    url: 'https://toolify-iota-gules.vercel.app/tools/age-calculator',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Age Calculator',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  url: 'https://toolify-iota-gules.vercel.app/tools/age-calculator',
  description: 'Calculate your exact age in years, months, days, hours & minutes. Find the time between any two dates. Free online age calculator — fast & accurate.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: ['Age in years/months/days', 'Time in hours & minutes', 'Next birthday countdown', 'Date difference calculator', 'Zodiac sign', 'Life statistics'],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the age calculator work?',
      acceptedAnswer: { '@type': 'Answer', text: 'Enter your date of birth and the tool calculates the precise time elapsed between then and today, broken down into years, months, days, hours, and minutes, accounting for leap years and varying month lengths.' },
    },
    {
      '@type': 'Question',
      name: 'Can I calculate the age between two specific dates?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can enter any start date and end date to calculate the exact duration between them — useful for calculating project durations, time since events, or anniversary differences.' },
    },
    {
      '@type': 'Question',
      name: 'Does it account for leap years?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator correctly handles February 29 birthdays and adjusts all calculations for leap years.' },
    },
    {
      '@type': 'Question',
      name: 'When is my next birthday?',
      acceptedAnswer: { '@type': 'Answer', text: 'The tool shows a countdown to your next birthday in days, hours, and minutes after you enter your date of birth.' },
    },
    {
      '@type': 'Question',
      name: 'Can I use this to determine legal age?',
      acceptedAnswer: { '@type': 'Answer', text: 'The calculator gives you the exact age, but legal definitions of adulthood vary by country and context. Always consult the relevant legal standards for your jurisdiction.' },
    }
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ToolLayout
        title="Age Calculator"
        description="Calculate your exact age in years, months, days, hours & minutes. Get birthday countdown, zodiac sign, birthstone, and fascinating life statistics."
        category="Calculators" categoryHref="/tools/calculator"
        icon={Calendar} gradient="from-violet-400 to-purple-500"
        accentColor="rgba(139, 92, 246, 0.3)"
        relatedTools={[{ name: 'BMI Calculator', slug: 'bmi-calculator' },
          { name: 'Loan Calculator', slug: 'loan-calculator' },
          { name: 'Unit Converter', slug: 'unit-converter' }]}
      >
        <AgeCalculatorTool />
        <section className="mt-12 space-y-8 text-sm text-muted-foreground">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-foreground mb-3">Free Age Calculator — Exact Age in Years, Months & Days</h2>
            <p className="leading-relaxed mb-3">
              Toolify's Age Calculator tells you your exact age in years, months, days, hours, and even minutes. It handles leap years, varying month lengths, and timezone differences to give you a precise result every time.
            </p>
            <p className="leading-relaxed">
              Beyond your age, the tool shows your zodiac sign, birthstone, the day of the week you were born, a countdown to your next birthday, and fun life statistics like how many days you've been alive.
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

