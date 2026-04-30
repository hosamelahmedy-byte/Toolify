'use client'

import { useState, useCallback } from 'react'
import { FileEdit, Sparkles, Copy, Check, RotateCcw, Download, ChevronDown, ChevronUp } from 'lucide-react'
import Head from 'next/head'

// ─── SEO ──────────────────────────────────────────────────────────────────────

const PAGE_TITLE = 'AI Cover Letter Generator — Free, Tailored, No Signup | Toolify'
const PAGE_DESCRIPTION =
  'Generate a professional cover letter tailored to any job in seconds. Paste your experience and the job description — AI writes the perfect cover letter. Free, no signup.'
const PAGE_URL = 'https://toolify-iota-gules.vercel.app/tools/cover-letter-generator'

const FAQ_ITEMS = [
  {
    q: 'How does the AI Cover Letter Generator work?',
    a: 'Paste the job description and your relevant experience or skills. The AI analyzes both and generates a tailored, professional cover letter that matches the job requirements and highlights your strengths.',
  },
  {
    q: 'Is the cover letter unique each time?',
    a: 'Yes. Every cover letter is generated fresh based on your specific inputs. The AI creates personalized content rather than using templates.',
  },
  {
    q: 'Can I edit the generated cover letter?',
    a: 'Absolutely. The generated letter is a strong starting point. You can copy it and customize any section to add personal touches or specific details.',
  },
  {
    q: 'What tone options are available?',
    a: 'You can choose between Professional (formal business tone), Enthusiastic (energetic and passionate), or Concise (brief and to-the-point). Each style is appropriate for different industries and roles.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your input is sent directly to the AI model for processing and is not stored or shared. Each session is independent.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Cover Letter Generator',
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  provider: { '@type': 'Organization', name: 'Toolify', url: 'https://toolify-iota-gules.vercel.app' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Tone = 'professional' | 'enthusiastic' | 'concise'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1 block">
      {children}
    </span>
  )
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="mt-16" aria-label="Frequently Asked Questions">
      <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-200 hover:text-blue-300 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoverLetterGeneratorPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [experience, setExperience] = useState('')
  const [applicantName, setApplicantName] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!jobDescription.trim() || !experience.trim()) return
    setLoading(true)
    setError(null)
    setResult('')

    const toneInstructions = {
      professional: 'Use a formal, polished, and professional tone suitable for corporate environments.',
      enthusiastic: 'Use an energetic, passionate tone that conveys genuine excitement for the role.',
      concise: 'Be brief and direct. Keep it under 200 words. Every sentence must add value.',
    }

    const systemPrompt = `You are an expert career coach and professional writer specializing in cover letters. 
Write a compelling, tailored cover letter based on the job description and candidate experience provided.
${toneInstructions[tone]}
Structure: Opening hook → Why this company/role → Key relevant achievements → Call to action.
Do NOT include placeholder brackets like [Company Name] — write naturally without them.
Return ONLY the cover letter text, no explanations or headers.`

    const userPrompt = `Job Description:
${jobDescription.slice(0, 2000)}

My Experience & Skills:
${experience.slice(0, 1500)}
${applicantName ? `\nApplicant Name: ${applicantName}` : ''}`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (!res.ok) throw new Error('API request failed')
      const data = await res.json() as any
      const text = data.content?.find((b: any) => b.type === 'text')?.text ?? ''
      setResult(text.trim())
    } catch {
      setError('Failed to generate cover letter. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [jobDescription, experience, applicantName, tone])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cover-letter.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setResult('')
    setError(null)
  }

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }} />
      </Head>

      <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Hero */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
              AI Cover Letter Generator
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              Paste the job description and your experience — get a tailored, professional cover letter in seconds. Free, no signup.
            </p>
          </div>

          {/* Form */}
          {!result && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">

              {/* Your Name (optional) */}
              <div>
                <Label>Your Name (optional)</Label>
                <input
                  type="text"
                  placeholder="e.g. John Smith"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                             placeholder:text-zinc-600 focus:outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500/40 transition-all"
                />
              </div>

              {/* Job Description */}
              <div>
                <Label>Job Description *</Label>
                <textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                             placeholder:text-zinc-600 focus:outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500/40 transition-all resize-none"
                />
              </div>

              {/* Your Experience */}
              <div>
                <Label>Your Experience & Skills *</Label>
                <textarea
                  placeholder="Describe your relevant experience, skills, and achievements..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={5}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100
                             placeholder:text-zinc-600 focus:outline-none focus:border-blue-500
                             focus:ring-1 focus:ring-blue-500/40 transition-all resize-none"
                />
              </div>

              {/* Tone */}
              <div>
                <Label>Tone</Label>
                <div className="flex gap-2">
                  {(['professional', 'enthusiastic', 'concise'] as Tone[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`flex-1 text-xs font-medium py-2.5 rounded-xl border transition-all capitalize ${
                        tone === t
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !jobDescription.trim() || !experience.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                           disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                           text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating cover letter…
                  </>
                ) : (
                  <>
                    <FileEdit className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-blue-400" />
                    Your Cover Letter
                  </h2>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {result}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                             text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Letter'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700
                             text-zinc-400 hover:text-blue-300 hover:border-blue-500/50
                             text-sm font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}

          <FAQSection />
        </div>
      </main>
    </>
  )
}
