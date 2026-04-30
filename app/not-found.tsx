import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-20 mesh-bg">
        <div className="text-center section-container py-20">
          <div className="text-[120px] font-black font-display gradient-text-static leading-none mb-6">404</div>
          <h1 className="text-3xl font-bold font-display mb-4">Page Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The tool or page you're looking for doesn't exist yet. Browse our available tools below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/tools"
              className="px-8 py-3 rounded-2xl glass-card font-semibold hover:border-primary/30 transition-all"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

