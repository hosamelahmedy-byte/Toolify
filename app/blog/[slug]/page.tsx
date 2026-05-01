import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://toolify-iota-gules.vercel.app/blog/${params.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readingTime}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 text-lg">{post.description}</p>

          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="text-xs bg-violet-500/10 text-violet-400 rounded-full px-3 py-1">{tag}</span>
            ))}
          </div>

          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-strong:text-foreground
            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    </main>
  )
}
