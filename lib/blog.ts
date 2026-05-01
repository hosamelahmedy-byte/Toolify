import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

function parseMarkdown(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul]|<\/[hul])(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`)
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }
  
  const frontmatter: Record<string, any> = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(': ')
    if (!key) return
    const value = rest.join(': ').trim()
    if (value.startsWith('[')) {
      frontmatter[key.trim()] = value.slice(1, -1).split(',').map(s => s.trim().replace(/["\']/g, ''))
    } else {
      frontmatter[key.trim()] = value.replace(/["\']/g, '')
    }
  })
  
  return { frontmatter, content: match[2] }
}

function getReadingTime(text: string): string {
  const words = text.split(/\s+/).length
  const mins = Math.ceil(words / 200)
  return `${mins} min read`
}

export async function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { frontmatter, content } = parseFrontmatter(raw)
    const slug = file.replace('.md', '')
    
    return {
      slug,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      date: frontmatter.date || '',
      tags: frontmatter.tags || [],
      readingTime: getReadingTime(content),
    }
  })
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, content } = parseFrontmatter(raw)
  
  return {
    slug,
    title: frontmatter.title || slug,
    description: frontmatter.description || '',
    date: frontmatter.date || '',
    tags: frontmatter.tags || [],
    readingTime: getReadingTime(content),
    content: parseMarkdown(content),
  }
}
