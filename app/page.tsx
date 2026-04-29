export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { HeroSection } from '@/components/layout/HeroSection'
import { ToolsGrid } from '@/components/layout/ToolsGrid'
import { FeaturesSection } from '@/components/layout/FeaturesSection'
import { PopularToolsStrip } from '@/components/layout/PopularToolsStrip'
import { AdSlot } from '@/components/ui/AdSlot'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Toolify — Free Online Tools for Developers & Creators',
  description:
    'Fast, free online tools: word counter, JSON converter, BMI calculator, keyword generator & more. No signup required.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        <HeroSection />
        <div className="section-container py-5">
          <AdSlot size="leaderboard" id="home-hero-bottom" />
        </div>
        <FeaturesSection />
        <PopularToolsStrip />
        <div className="section-container py-4">
          <AdSlot size="inline" id="home-mid-inline" />
        </div>
        <section id="tools" className="section-container py-16">
          <ToolsGrid />
        </section>
        <div className="section-container flex justify-center py-4">
          <AdSlot size="rectangle" id="home-btm-rect" />
        </div>
        <CTASection />
        <div className="section-container py-6">
          <AdSlot size="leaderboard" id="home-footer-top" />
        </div>
      </main>
      <Footer />
    </>
  )
}

function CTASection() {
  return (
    <section className="section-container py-24">
      <div className="glass-card-heavy mesh-bg rounded-3xl p-12 text-center relative overflow-hidden">
        {/* Orbs */}
        <div className="orb orb-primary absolute -top-20 -left-20 w-64 h-64 animate-glow-pulse" />
        <div className="orb orb-accent absolute -bottom-20 -right-20 w-64 h-64 animate-float-slow" />

        <div className="relative z-10">
          <span className="category-badge mb-6 inline-flex">
            <span className="text-primary">✦</span>
            100% Free · No Signup · No Limits
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4 text-balance">
            All Tools Are{' '}
            <span className="gradient-text-static">Completely Free</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 text-pretty">
            No account needed. No watermarks. No hidden fees. Just powerful tools
            that work instantly in your browser.
          </p>
          <a
            href="#tools"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-glow-brand"
          >
            Explore All Tools →
          </a>
        </div>
      </div>
    </section>
  )
}
