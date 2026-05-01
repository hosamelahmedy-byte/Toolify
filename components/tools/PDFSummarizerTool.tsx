'use client'

import { useState, useCallback, useRef } from 'react'
import { FileSearch, UploadCloud, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react'

interface SummaryResult {
  title: string
  summary: string
  keyPoints: string[]
  wordCount: number
  readingTime: string
}

export function PDFSummarizerTool() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) { resolve((window as any).pdfjsLib); return }
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload = () => {
        const lib = (window as any).pdfjsLib
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve(lib)
      }
      script.onerror = () => reject(new Error('pdf_parse_failed'))
      document.head.appendChild(script)
    })
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    setLoadingStep('Reading PDF...')
    try {
      const pdfjsLib = await loadPdfJs()
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let text = ''
      const pagesToRead = Math.min(pdf.numPages, 30)
      setLoadingStep(`Extracting text from ${pagesToRead} pages...`)
      for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item: any) => item.str || '').join(' ') + '\n'
      }
      return text.slice(0, 12000)
    } catch (e: any) {
      if (e?.message === 'pdf_parse_failed') throw e
      throw new Error('pdf_parse_failed')
    }
  }

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return }
    if (f.size > 20 * 1024 * 1024) { setError('File too large. Please upload a PDF under 20MB.'); return }
    setFile(f); setResult(null); setError(null)
  }

  const handleGenerate = useCallback(async () => {
    if (!file) return
    setLoading(true); setError(null); setLoadingStep('Starting...')
    try {
      const pdfText = await extractTextFromPDF(file)
      
      if (!pdfText.trim()) {
        setError('Could not extract text from this PDF. This may be a scanned image-based PDF — please try a text-based PDF.')
        setLoading(false); return
      }

      if (pdfText.trim().length < 100) {
        setError('The PDF contains very little text. Make sure it\'s not a scanned image or an empty document.')
        setLoading(false); return
      }

      setLoadingStep('Summarizing with AI...')
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 1000,
          messages: [
            { 
              role: 'system', 
              content: `You are a document summarizer. Return ONLY valid JSON with no markdown or extra text:
{"title":"string","summary":"string","keyPoints":["string","string","string"],"wordCount":number,"readingTime":"X min read"}` 
            },
            { role: 'user', content: `Summarize this document:\n\n${pdfText}` }
          ],
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as any
        if (res.status === 429) throw new Error('rate_limit')
        if (res.status === 413) throw new Error('too_large')
        throw new Error('api_failed')
      }

      const data = await res.json() as any
      const text = data.choices?.[0]?.message?.content ?? ''
      
      if (!text) throw new Error('empty_response')
      
      const clean = text.replace(/```json|```/g, '').trim()
      setResult(JSON.parse(clean))
      
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg === 'pdf_parse_failed') {
        setError('Failed to read the PDF. It may be password-protected, corrupted, or an image-based scan.')
      } else if (msg === 'rate_limit') {
        setError('Too many requests. Please wait a moment and try again.')
      } else if (msg === 'too_large') {
        setError('The extracted text is too long. Try a shorter document or fewer pages.')
      } else if (msg === 'empty_response') {
        setError('AI returned an empty response. Please try again.')
      } else if (msg.includes('JSON')) {
        setError('AI response was not in the expected format. Please try again.')
      } else {
        setError('Failed to summarize. Please check your internet connection and try again.')
      }
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }, [file])

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(`${result.title}\n\n${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `• ${p}`).join('\n')}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {!result && (
        <>
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }} 
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all ${dragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-border hover:border-emerald-500/50 hover:bg-emerald-500/5'}`}>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <UploadCloud className="w-8 h-8 text-emerald-400" />
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium text-emerald-400">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-foreground">Drop your PDF here or <span className="text-emerald-400 font-medium">browse</span></p>
                <p className="text-xs text-muted-foreground mt-1">Text-based PDF only · Max 20MB</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading || !file}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {loadingStep || 'Summarizing…'}
              </>
            ) : (
              <><FileSearch className="w-4 h-4" />Summarize PDF</>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <div className="bg-muted/40 border border-border rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Note:</span> Works best with text-based PDFs (not scanned images). Password-protected files are not supported.
            </p>
          </div>
        </>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-muted/40 border border-border rounded-2xl p-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold mb-1">{result.title}</h2>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span>~{result.wordCount.toLocaleString()} words</span>
                <span>·</span>
                <span>{result.readingTime}</span>
              </div>
            </div>
            <button onClick={() => { setResult(null); setFile(null) }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />New PDF
            </button>
          </div>

          <div className="bg-muted/40 border border-border rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Summary</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{result.summary}</p>
          </div>

          <div className="bg-muted/40 border border-border rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">Key Points</h3>
            <ul className="space-y-3">
              {result.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={handleCopy} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-emerald-400 text-xs font-medium transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Summary'}
          </button>
        </div>
      )}
    </div>
  )
}
