// ── Global tools loading skeleton ──────────────────────────
// Shown by Next.js during any /tools/* route transition

export default function Loading() {
  return (
    <div className="min-h-screen pt-20 animate-pulse">
      <div className="section-container py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          {[60, 14, 40, 14, 80, 14, 120].map((w, i) =>
            w === 14 ? (
              <span key={i} className="text-muted-foreground/30">/</span>
            ) : (
              <div key={i} className="h-4 rounded-full bg-secondary" style={{ width: w }} />
            )
          )}
        </div>

        {/* Title + icon skeleton */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-secondary shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-9 bg-secondary rounded-xl w-72" />
            <div className="h-4 bg-secondary rounded-xl w-full max-w-lg" />
            <div className="h-4 bg-secondary rounded-xl w-3/4 max-w-md" />
          </div>
        </div>

        {/* Ad slot skeleton */}
        <div className="h-[90px] bg-secondary/40 rounded-2xl mb-8" />

        {/* Tool + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-4">
            <div className="h-[260px] bg-secondary rounded-2xl" />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-secondary rounded-xl" />
              ))}
            </div>
            <div className="h-[180px] bg-secondary rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-[250px] bg-secondary rounded-2xl" />
            <div className="h-[160px] bg-secondary rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
