import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — AI Tools Tips & Guides | Toolify',
  description: 'Guides, tips and tutorials about AI tools, productivity, and developer tools. Updated weekly.',
  alternates: { canonical: 'https://toolify-iota-gules.vercel.app/blog' },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-violet-400 mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Blog
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">AI Tools Guides & Tips</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Weekly articles about AI tools, productivity hacks, and how to get the most out of Toolify.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p>No posts yet — check back soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="block glass-card hover:border-violet-500/40 rounded-2xl p-6 transition-all group">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readingTime}</span>
                  </div>
                  <h2 className="text-base font-bold mb-2 group-hover:text-violet-400 transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs bg-violet-500/10 text-violet-400 rounded-full px-3 py-1">{tag}</span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
