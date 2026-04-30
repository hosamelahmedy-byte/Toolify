'use client'

import importDynamic from 'next/dynamic'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const AnalyticsDashboard = importDynamic(
  () => import('@/components/ui/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })),
  { ssr: false }
)

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="section-container py-10">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-muted-foreground mb-3">
              🔒 Private · Not indexed by search engines
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
              Analytics <span className="gradient-text-static">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">
              Monitor your site's performance, top tools & estimated revenue.
            </p>
          </div>

          <AnalyticsDashboard />
        </div>
      </main>
      <Footer />
    </>
  )
}

