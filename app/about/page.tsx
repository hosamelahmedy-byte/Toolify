import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Shield, Gauge, Globe, Code2, Heart } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { TOOLS } from '@/lib/tools-registry'

export const metadata: Metadata = {
  title: 'About Toolify — Free Online Tools for Everyone',
  description:
    'Toolify is a free collection of online tools for developers, writers, and creators. Learn about our mission, values, and the tools we offer.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/about' },
}

const VALUES = [
  {
    icon: Zap,
    title: 'Fast & Instant',
    description: 'All tools work instantly in your browser. No loading screens, no server processing delays.',
  },
  {
    icon: Shield,
    title: 'Private by Design',
    description: 'Your data never leaves your device. Files and text are processed locally — nothing is sent to our servers.',
  },
  {
    icon: Heart,
    title: 'Always Free',
    description: 'Every tool on Toolify is free forever. No paywalls, no trials, no credit cards required.',
  },
  {
    icon: Gauge,
    title: 'No Signup Required',
    description: 'Open any tool and start using it immediately. No account, no email, no friction.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description: 'Built with modern web standards, Toolify works on any device — desktop, tablet, or mobile.',
  },
  {
    icon: Code2,
    title: 'Built for Professionals',
    description: 'From developers to designers to writers, every tool is crafted for real-world professional use.',
  },
]

export default function AboutPage() {
  const toolCount = TOOLS.length

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20">
        <div className="section-container py-12 max-w-4xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6 shadow-lg">
              <Zap size={28} className="text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-display mb-4">
              About <span className="gradient-text-static">Toolify</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A growing collection of {toolCount}+ free online tools built for developers,
              writers, and creators who want fast, private, no-nonsense utilities.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold font-display mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The internet is full of tools that are slow, ad-heavy, require signups, or send your
              data to third-party servers. We built Toolify to be different.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every tool on this site is free, instant, and private. Whether you need to merge PDFs,
              generate a QR code, format code, calculate your BMI, or count words in an article —
              Toolify handles it directly in your browser with no registration and no data collection.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe productivity tools should be accessible to everyone, everywhere, without
              barriers. That&apos;s the only goal behind Toolify.
            </p>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-display mb-6 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="glass-card p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <h3 className="font-semibold">{v.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-8 rounded-2xl mb-12">
            <h2 className="text-2xl font-bold font-display mb-6 text-center">By the Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">{toolCount}+</div>
                <div className="text-sm text-muted-foreground">Free Tools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Free Forever</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">0</div>
                <div className="text-sm text-muted-foreground">Signups Required</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">∞</div>
                <div className="text-sm text-muted-foreground">Usage Limit</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-display mb-4">What Toolify Offers</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Toolify covers a wide range of use cases across multiple categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              {[
                { title: '📄 PDF Tools', desc: 'Merge, split, compress, convert PDFs — all in your browser' },
                { title: '🔧 Developer Tools', desc: 'QR codes, JSON schemas, code formatters, hash generators, JWT debugger' },
                { title: '📝 Text & Writing', desc: 'Word counter, case converter, Lorem Ipsum, text analyzer' },
                { title: '📊 Calculators', desc: 'BMI, BMR/TDEE, unit converter, loan calculator, age calculator' },
                { title: '🔐 Security', desc: 'Password generator, hash tools, JWT debugger' },
                { title: '🎨 Design', desc: 'Color converter, QR code customization' },
              ].map((cat) => (
                <div key={cat.title} className="glass-card p-4 rounded-xl">
                  <h3 className="font-semibold text-foreground mb-1">{cat.title}</h3>
                  <p>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95"
            >
              <Zap size={16} />
              Explore All Tools
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Have a suggestion? Email us at{' '}
              <a href="mailto:hello@toolify.app" className="text-primary hover:underline font-mono">
                hello@toolify.app
              </a>
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 flex gap-4 justify-center text-sm">
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

