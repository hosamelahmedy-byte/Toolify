import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSlot } from '@/components/ui/AdSlot'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  category: string
  categoryHref: string
  icon: LucideIcon
  gradient: string   // e.g. "from-violet-500 to-indigo-600"
  accentColor: string
  relatedTools?: { name: string; slug: string }[]
}

export function ToolLayout({
  children,
  title,
  description,
  category,
  categoryHref,
  icon: Icon,
  gradient,
  accentColor,
  relatedTools = [],
}: ToolLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20">
        {/* Subtle bg orbs */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-[80px]"
            style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
          />
        </div>

        <div className="section-container py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <ChevronRight size={14} />
            <Link href={categoryHref} className="hover:text-foreground transition-colors">{category}</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{title}</span>
          </nav>

          {/* Tool Header */}
          <div className="flex items-start gap-5 mb-8">
            <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0', gradient)}>
              <Icon size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">{title}</h1>
              <p className="text-muted-foreground text-base max-w-2xl">{description}</p>
            </div>
          </div>

          {/* Top Ad — horizontal */}
          <div className="mb-8">
            <AdSlot size="leaderboard" id={`tool-top-${title.toLowerCase().replace(/\s/g, '-')}`} />
          </div>

          {/* Main content + Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
            {/* Tool */}
            <div>{children}</div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <AdSlot size="sticky-sidebar" id={`tool-sidebar-${title.toLowerCase().replace(/\s/g, '-')}`} />

              {relatedTools.length > 0 && (
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-sm mb-3">Related Tools</h3>
                  <div className="space-y-2">
                    {relatedTools.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/tools/${t.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                      >
                        <span>{t.name}</span>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
