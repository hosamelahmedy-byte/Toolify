export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { BookOpen, ArrowRight, Calendar } from 'lucide-react'
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

export default async function HomePage() {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        <HeroSection />
        <BlogPreviewSection posts={latestPosts} />
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

function BlogPreviewSection({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null
  return (
    <section className="section-container py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs font-medium text-violet-400 mb-3">
            <BookOpen className="w-3 h-3" />
            From the Blog
          </div>
          <h2 className="text-2xl font-bold font-display">Latest AI Tools Guides</h2>
        </div>
        <Link href="/blog" className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="glass-card p-5 rounded-2xl hover:border-violet-500/30 transition-all group">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </div>
            <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{post.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 md:hidden text-center">
        <Link href="/blog" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          View all posts →
        </Link>
      </div>
    </section>
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

