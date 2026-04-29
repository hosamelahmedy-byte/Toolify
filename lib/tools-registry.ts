import {
  FileText,
  Code2,
  Calculator,
  Hash,
  Sparkles,
  Braces,
  Wand2,
  Activity,
  Weight,
  Ruler,
  Calendar,
  DollarSign,
  Search,
  AlignLeft,
  Palette,
  KeyRound,
  type LucideIcon,
  FileStack,
  Scissors,
  FileArchive,
  ImageIcon,
  FilePlus,
  ShieldCheck,
} from 'lucide-react'

// ============================================================
// TOOL REGISTRY — Toolify
// Central source of truth for all tools
// ============================================================

export type ToolCategory = 'ai-content' | 'dev' | 'calculator' | 'seo' | 'pdf'

export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  category: ToolCategory
  icon: LucideIcon
  color: string          // Tailwind gradient classes
  accentColor: string    // HSL value for glow
  tags: string[]
  featured: boolean
  new?: boolean
  popular?: boolean
  schema?: object        // JSON-LD for this tool page
}

export const TOOLS: Tool[] = [
  // ── AI Content Tools ──────────────────────────────────────
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences & reading time. Real-time analysis with detailed statistics.',
    category: 'ai-content',
    icon: AlignLeft,
    color: 'from-violet-500 to-indigo-600',
    accentColor: '243, 75%, 59%',
    tags: ['writing', 'text', 'SEO', 'free'],
    featured: true,
    popular: true,
  },
  {
    id: 'keyword-generator',
    slug: 'keyword-generator',
    name: 'SEO Keyword Generator',
    description: 'Generate long-tail keywords, LSI terms & semantic variations for any topic.',
    category: 'ai-content',
    icon: Search,
    color: 'from-purple-500 to-pink-500',
    accentColor: '290, 70%, 55%',
    tags: ['SEO', 'keywords', 'marketing'],
    featured: true,
    new: true,
  },
  {
    id: 'text-analyzer',
    slug: 'text-analyzer',
    name: 'Text Analyzer',
    description: 'Analyze readability, sentiment, keyword density & Flesch-Kincaid score.',
    category: 'ai-content',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    accentColor: '210, 80%, 55%',
    tags: ['readability', 'SEO', 'writing'],
    featured: false,
  },
  {
    id: 'prompt-generator',
    slug: 'prompt-generator',
    name: 'AI Prompt Generator',
    description: 'Generate optimized prompts for ChatGPT, Claude, Midjourney & more.',
    category: 'ai-content',
    icon: Sparkles,
    color: 'from-amber-400 to-orange-500',
    accentColor: '35, 90%, 55%',
    tags: ['AI', 'prompts', 'ChatGPT'],
    featured: true,
    new: true,
  },

  // ── Dev Tools ─────────────────────────────────────────────
  {
    id: 'json-to-typebox',
    slug: 'json-to-typebox',
    name: 'JSON → TypeBox',
    description: 'Convert JSON objects to TypeBox schemas instantly. Supports nested objects & arrays.',
    category: 'dev',
    icon: Braces,
    color: 'from-emerald-500 to-teal-500',
    accentColor: '164, 71%, 50%',
    tags: ['TypeScript', 'JSON', 'schema', 'TypeBox'],
    featured: true,
    popular: true,
  },
  {
    id: 'code-formatter',
    slug: 'code-formatter',
    name: 'Code Formatter',
    description: 'Format & beautify HTML, CSS, JavaScript, TypeScript, JSON & more.',
    category: 'dev',
    icon: Code2,
    color: 'from-slate-500 to-zinc-600',
    accentColor: '220, 15%, 50%',
    tags: ['code', 'format', 'prettify'],
    featured: false,
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, OKLCH & CSS color formats instantly.',
    category: 'dev',
    icon: Palette,
    color: 'from-rose-400 to-pink-500',
    accentColor: '345, 80%, 55%',
    tags: ['CSS', 'design', 'colors'],
    featured: false,
    new: true,
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text or file.',
    category: 'dev',
    icon: Hash,
    color: 'from-cyan-500 to-blue-500',
    accentColor: '195, 80%, 50%',
    tags: ['security', 'hash', 'crypto'],
    featured: false,
  },

  // ── Calculators ───────────────────────────────────────────
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index with health category, ideal weight range & recommendations.',
    category: 'calculator',
    icon: Weight,
    color: 'from-green-500 to-emerald-600',
    accentColor: '148, 70%, 45%',
    tags: ['health', 'BMI', 'medical', 'fitness'],
    featured: true,
    popular: true,
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, volume, area, speed & more.',
    category: 'calculator',
    icon: Ruler,
    color: 'from-sky-500 to-blue-500',
    accentColor: '200, 75%, 50%',
    tags: ['conversion', 'units', 'measurement'],
    featured: false,
  },
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest & amortization schedule.',
    category: 'calculator',
    icon: DollarSign,
    color: 'from-yellow-400 to-amber-500',
    accentColor: '40, 90%, 50%',
    tags: ['finance', 'loan', 'mortgage'],
    featured: false,
    new: true,
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate exact age in years, months, days & hours. Find date differences.',
    category: 'calculator',
    icon: Calendar,
    color: 'from-violet-400 to-purple-500',
    accentColor: '270, 65%, 55%',
    tags: ['date', 'age', 'birthday'],
    featured: false,
  },

  // ── PDF Tools ──────────────────────────────────────────────
  {
    id: 'pdf-merge',
    slug: 'pdf-merge',
    name: 'PDF Merge',
    description: 'Combine multiple PDF files into one document instantly. Drag, reorder & merge. 100% in your browser.',
    category: 'pdf',
    icon: FileStack,
    color: 'from-red-500 to-rose-600',
    accentColor: '239, 68, 68',
    tags: ['PDF', 'merge', 'combine'],
    featured: true,
    popular: true,
  },
  {
    id: 'pdf-split',
    slug: 'pdf-split',
    name: 'PDF Split',
    description: 'Split a PDF into individual pages or extract specific page ranges. Fast & private.',
    category: 'pdf',
    icon: Scissors,
    color: 'from-orange-500 to-amber-500',
    accentColor: '249, 115, 22',
    tags: ['PDF', 'split', 'extract'],
    featured: true,
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality. Compress large PDFs for email or upload.',
    category: 'pdf',
    icon: FileArchive,
    color: 'from-yellow-500 to-orange-500',
    accentColor: '234, 179, 8',
    tags: ['PDF', 'compress', 'reduce size'],
    featured: true,
    popular: true,
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, WEBP images to PDF. Add multiple images into a single PDF document.',
    category: 'pdf',
    icon: ImageIcon,
    color: 'from-blue-500 to-indigo-500',
    accentColor: '59, 130, 246',
    tags: ['PDF', 'image', 'JPG', 'PNG'],
    featured: true,
    new: true,
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Extract text from PDF and convert to editable Word-style format. Works with text-based PDFs.',
    category: 'pdf',
    icon: FileText,
    color: 'from-blue-600 to-blue-700',
    accentColor: '37, 99, 235',
    tags: ['PDF', 'Word', 'convert', 'DOCX'],
    featured: true,
    popular: true,
  },
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Convert text content to a clean, formatted PDF document ready to download.',
    category: 'pdf',
    icon: FilePlus,
    color: 'from-indigo-500 to-violet-600',
    accentColor: '99, 102, 241',
    tags: ['PDF', 'Word', 'convert'],
    featured: false,
    new: true,
  },

  // ── Security Tools ─────────────────────────────────────────
  {
    id: 'jwt-debugger',
    slug: 'jwt-debugger',
    name: 'JWT Debugger',
    description: 'Decode and inspect JWT tokens. View header, payload, claims & expiry. 100% client-side.',
    category: 'dev',
    icon: ShieldCheck,
    color: 'from-slate-600 to-slate-800',
    accentColor: '100, 116, 139',
    tags: ['JWT', 'security', 'decode', 'token'],
    featured: true,
    new: true,
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate cryptographically secure passwords with entropy scoring and bulk generation.',
    category: 'dev',
    icon: KeyRound,
    color: 'from-violet-600 to-purple-700',
    accentColor: '139, 92, 246',
    tags: ['security', 'password', 'crypto'],
    featured: true,
    new: true,
  },
  // ── Advanced Medical ───────────────────────────────────────
  {
    id: 'bmr-calculator',
    slug: 'bmr-calculator',
    name: 'BMR & TDEE Calculator',
    description: 'Calculate Basal Metabolic Rate & daily calories using Mifflin-St Jeor with macro breakdown.',
    category: 'calculator',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    accentColor: '249, 115, 22',
    tags: ['BMR', 'TDEE', 'calories', 'health', 'macros'],
    featured: true,
    new: true,
  },

  // ── Advanced JSON ──────────────────────────────────────────
  {
    id: 'json-to-zod',
    slug: 'json-to-zod',
    name: 'JSON → Zod & TypeBox',
    description: 'Convert JSON to Zod or TypeBox schemas. Smart type inference: email, UUID, datetime, nested objects & unions.',
    category: 'dev',
    icon: Braces,
    color: 'from-emerald-500 to-teal-600',
    accentColor: '16, 185, 129',
    tags: ['Zod', 'TypeBox', 'JSON', 'TypeScript', 'schema'],
    featured: true,
    new: true,
  },
]

// ── Helpers ───────────────────────────────────────────────

export function getToolsByCategory(category: ToolCategory) {
  return TOOLS.filter((t) => t.category === category)
}

export function getFeaturedTools() {
  return TOOLS.filter((t) => t.featured)
}

export function getToolBySlug(slug: string) {
  return TOOLS.find((t) => t.slug === slug)
}

export const CATEGORY_META: Record<
  ToolCategory,
  { label: string; description: string; color: string; icon: LucideIcon }
> = {
  'ai-content': {
    label: 'AI Content',
    description: 'Writing, analysis & SEO tools',
    color: 'from-violet-500 to-purple-600',
    icon: Wand2,
  },
  dev: {
    label: 'Developer',
    description: 'Code, JSON, crypto & conversions',
    color: 'from-emerald-500 to-teal-600',
    icon: Code2,
  },
  calculator: {
    label: 'Calculators',
    description: 'Health, finance & unit tools',
    color: 'from-sky-500 to-blue-600',
    icon: Calculator,
  },
  seo: {
    label: 'SEO Tools',
    description: 'Ranking, keywords & analysis',
    color: 'from-amber-400 to-orange-500',
    icon: KeyRound,
  },
  pdf: {
    label: 'PDF Tools',
    description: 'Merge, split, compress & convert PDFs',
    color: 'from-red-500 to-rose-600',
    icon: FileStack,
  },
}
