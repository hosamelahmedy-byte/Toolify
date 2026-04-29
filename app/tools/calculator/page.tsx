export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { getToolsByCategory, CATEGORY_META } from '@/lib/tools-registry'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Online Calculators — Free BMI, Loan, Unit & Age Calculators',
  description: 'Free online calculators: BMI calculator with health ranges, loan & mortgage calculator with amortization, unit converter (length/weight/temperature), and age calculator.',
  keywords: ['online calculators','BMI calculator','loan calculator','mortgage calculator','unit converter','age calculator','free calculators online','health calculator','finance calculator'],
  openGraph: { title: 'Online Calculators — Toolify', description: 'BMI, loan, unit converter & age calculator. Free, instant, no signup.', url: 'https://toolify.io/tools/calculator', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Online Calculators — Toolify', description: 'Free calculators: BMI, loan, unit conversion & age — all in your browser.' },
  alternates: { canonical: 'https://toolify.io/tools/calculator' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Online Calculators',
  url: 'https://toolify.io/tools/calculator',
  description: 'Free online calculators including BMI calculator, loan calculator, unit converter, and age calculator.',
  inLanguage: 'en',
  isPartOf: { '@type': 'WebSite', name: 'Toolify', url: 'https://toolify.io' },
  hasPart: getToolsByCategory('calculator').map((t) => ({
    '@type': 'SoftwareApplication',
    name: t.name,
    url: `https://toolify.io/tools/${t.slug}`,
    description: t.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })),
}

export default function CalculatorPage() {
  const tools = getToolsByCategory('calculator')
  const meta = CATEGORY_META['calculator']
  const Icon = meta.icon
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20 blur-[80px] bg-sky-500" />
          <div className="absolute bottom-1/3 left-1/5 w-64 h-64 rounded-full opacity-10 blur-[60px] bg-blue-400" />
        </div>
        <div className="section-container py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Calculators</span>
          </nav>
          <div className="mb-10">
            <div className={cn('w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5', meta.color)}>
              <Icon size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              Online <span className="gradient-text-static">Calculators</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">{meta.description} — all free, no signup, runs in your browser.</p>
            <div className="flex flex-wrap gap-4 mt-5">
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">{tools.length}</strong> calculators available</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">100%</strong> free & private</span>
              <span className="text-sm text-muted-foreground"><strong className="text-foreground">No</strong> account needed</span>
            </div>
          </div>
          <AdSlot size="leaderboard" id="calculator-top" className="mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => {
              const TIcon = tool.icon
              return (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <div className="tool-card h-full group">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110', tool.color)}>
                      <TIcon size={22} className="text-white" />
                    </div>
                    <div className="flex gap-2 mb-2 min-h-[20px]">
                      {tool.popular && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">🔥 Popular</span>}
                      {tool.new && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">✨ New</span>}
                    </div>
                    <h2 className="font-bold font-display text-lg mb-2 group-hover:text-primary transition-colors">{tool.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm font-medium text-primary mt-auto">
                      Use Tool <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <AdSlot size="inline" id="calculator-mid" className="mt-10" />
          <section className="mt-12 glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold font-display mb-4">Accurate, Private & Free</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-1">⚖️ BMI & Health</h3>
                <p>Calculate your Body Mass Index using WHO standard formulas. Get your health category, ideal weight range, and personalized recommendations — supports both metric and imperial units.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">💰 Loan & Mortgage</h3>
                <p>Calculate monthly repayments, total interest paid, and view a full amortization schedule for any loan. Supports fixed-rate mortgages, car loans, and personal loans.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">📐 Unit Conversion</h3>
                <p>Convert over 200 units across length, weight, temperature, volume, area, speed, energy, and more. Results update instantly as you type.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">🎂 Age Calculator</h3>
                <p>Find your exact age in years, months, days, hours, and even seconds. Calculate the time until any future date or difference between two dates.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
