import { MetadataRoute } from 'next'
import { TOOLS } from '@/lib/tools-registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://toolify-iota-gules.vercel.app'
  const now = new Date()

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${base}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: tool.featured ? 0.9 : 0.7,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...toolRoutes,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}


