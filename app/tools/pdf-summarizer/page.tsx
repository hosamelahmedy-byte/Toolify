'use client'

import { useState, useCallback, useRef } from 'react'
import { FileSearch, Sparkles, UploadCloud, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import Head from 'next/head'

// ─── SEO ──────────────────────────────────────────────────────────────────────

const PAGE_TITLE = 'AI PDF Summarizer — Summarize Any PDF Instantly | Toolify'
const PAGE_DESCRIPTION =
  'Upload a PDF and get an AI-generated summary with key points and highlights in seconds. Free, private, no signup required.'
const PAGE_URL = 'https://toolify.app/tools/pdf-summarizer'

const FAQ_ITEMS = [
  {
    q: 'How does the PDF Summarizer work?',
    a: 'Upload your PDF and the AI reads the text content, then generates a concise summary with the main ideas, key points, and important highlights — all in seconds.',
  },
  {
    q: 'Is my PDF kept private?',
    a: 'Yes. Your PDF is processed entirely in your browser session. We do not store, share, or retain your documents after the summary is generated.',
  },
  {
    q: 'What types of PDFs work best?',
    a: 'Text-based PDFs work best — research papers, reports, articles, ebooks, and contracts. Scanned PDFs without embedded text may not extract correctly.',
  },
  {
    q: 'What is the file size limit?',
    a: 'The tool works well with PDFs up to around 10MB. For very large documents, consider summarizing chapter by chapter for better results.',
  },
  {
    q: 'Can I summarize academic papers?',
    a: 'Absolutely. The PDF Summarizer is particularly useful for research papers, extracting the abstract, methodology, findings, and conclusions quickly.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI PDF Summarizer',
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  provider: { '@type': 'Organization', name: 'Toolify', url: 'https://toolify.app' },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryResult {
  title: string
  summary: string
  keyPoints: string[]
  wordCount: number
  readingTime: string
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className="mt-16" aria-label="Frequently Asked Questions">
      <h2 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-emerald-500 inline-block" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-zinc-200 hover:text-emerald-300 transition-colors"
              aria-expanded={openIndex === i}
            >
              <span>{item.q}</span>
              {openIndex === i ? (
                <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
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

export default function PDFSummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ') + '\n'
    }
    return text.slice(0, 12000)
  }

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setFile(f)
    setResult(null)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleGenerate = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const pdfText = await extractTextFromPDF(file)

      if (!pdfText.trim()) {
        setError('Could not extract text from this PDF. It may be a scanned image-only document.')
        setLoading(false)
        return
      }

      const systemPrompt = `You are a document summarizer. Return ONLY valid JSON — no markdown, no explanation.
Output must match this exact structure:
{
  "title": "string (inferred document title)",
  "summary": "string (2-4 paragraph summary of the document)",
  "keyPoints": ["string", "string", "string", "string", "string"],
  "wordCount": number (approximate word count of original),
  "readingTime": "string (e.g. '8 min read')"
}
keyPoints should be 5-7 concise bullet-point style strings.`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: `Please summarize the following document content:\n\n${pdfText}`,
            },
          ],
        }),
      })

      if (!res.ok) throw new Error('API request failed')
      const data = await res.json() as any
      const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed: SummaryResult = JSON.parse(clean)
      setResult(parsed)
    } catch {
      setError('Failed to summarize PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [file])

  const handleCopy = async () => {
    if (!result) return
    const text = `${result.title}\n\n${result.summary}\n\nKey Points:\n${result.keyPoints.map((p) => `• ${p}`).join('\n')}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <meta property="og:image" content="https://toolify.app/og/pdf-summarizer.png" />
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs font-medium text-emerald-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-3">PDF Summarizer</h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
              Upload any PDF and get an AI-generated summary with key points in seconds. Free, private, no signup.
            </p>
          </div>

          {/* Upload & Controls */}
          {!result && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                  ${dragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'}`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <UploadCloud className={`w-8 h-8 ${file ? 'text-emerald-400' : 'text-zinc-600'}`} />
                {file ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-emerald-300">{file.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">Drop your PDF here or <span className="text-emerald-400 font-medium">browse</span></p>
                    <p className="text-xs text-zinc-600 mt-1">PDF files only · Max ~10MB recommended</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !file}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500
                           disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
                           text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Summarizing PDF…
                  </>
                ) : (
                  <>
                    <FileSearch className="w-4 h-4" />
                    Summarize PDF
                  </>
                )}
              </button>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">{result.title}</h2>
                  <div className="flex gap-3 text-xs text-zinc-500">
                    <span>~{result.wordCount.toLocaleString()} words</span>
                    <span>·</span>
                    <span>{result.readingTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setResult(null); setFile(null) }}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New PDF
                </button>
              </div>

              {/* Summary */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Summary</h3>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{result.summary}</p>
              </div>

              {/* Key Points */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Key Points</h3>
                <ul className="space-y-3">
                  {result.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-700
                           text-zinc-400 hover:text-emerald-300 hover:border-emerald-500/50
                           text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
            </div>
          )}

          <FAQSection />
        </div>
      </main>
    </>
  )
}
