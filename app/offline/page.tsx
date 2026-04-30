'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { WifiOff, Zap } from 'lucide-react'

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center mesh-bg">
      <div className="text-center section-container py-20 max-w-lg">

        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-primary" />
        </div>

        <h1 className="text-4xl font-bold font-display mb-3">
          You're <span className="gradient-text-static">Offline</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
          No internet connection detected. Some tools still work offline
          because they run entirely in your browser!
        </p>

        {/* Tools that work offline */}
        <div className="glass-card p-5 text-left mb-8">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            Tools available offline:
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Word Counter', 'Text Analyzer',
              'BMI Calculator', 'BMR Calculator',
              'Unit Converter', 'Age Calculator',
              'Loan Calculator', 'Color Converter',
              'Password Generator', 'JWT Debugger',
              'JSON → Zod', 'Code Formatter',
            ].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-500">✓</span>
                <span className="text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">
            Try Offline Tools
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-2xl glass-card font-semibold hover:border-primary/30 transition-all">
            Retry Connection
          </button>
        </div>
      </div>
    </main>
  )
}

