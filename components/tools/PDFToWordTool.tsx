'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, Download, Loader2, Copy, Check } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

export function PDFToWordTool() {
  const [file, setFile] = useState<{ name: string; buffer: ArrayBuffer } | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)

  const loadFile = async (f: File) => {
    if (f.type !== 'application/pdf') { setError('Please select a PDF file'); return }
    setError(''); setText('')
    const buffer = await f.arrayBuffer()
    setFile({ name: f.name, buffer })
  }

  const extract = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const doc = await PDFDocument.load(file.buffer)
      const pageCount = doc.getPageCount()

      // Extract text using basic string parsing from PDF bytes
      const bytes = new Uint8Array(file.buffer)
      const raw = new TextDecoder('utf-8', { fatal: false }).decode(bytes)

      // Extract text between stream markers
      const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g
      const textRegex = /\(([^)]{1,200})\)\s*Tj/g
      const bjRegex = /\[((?:[^[\]]*(?:\([^)]*\)[^[\]]*)*)*)\]\s*TJ/g

      let extracted = ''
      let match

      // Method 1: Extract from Tj operators
      while ((match = textRegex.exec(raw)) !== null) {
        const str = match[1]
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\')
          .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
        if (/[a-zA-Z\u0600-\u06FF0-9]/.test(str)) {
          extracted += str + ' '
        }
      }

      if (!extracted.trim()) {
        // Method 2: Try to find readable ASCII text blocks
        const readable = raw.match(/[a-zA-Z\u0600-\u06FF][a-zA-Z\u0600-\u06FF\s,.'"-]{10,}/g)
        if (readable) {
          extracted = readable.filter(s => s.trim().length > 5).join('\n')
        }
      }

      setText(
        extracted.trim() ||
        `No extractable text found in this PDF.\n\nPage count: ${pageCount}\n\nThis PDF likely contains scanned images rather than selectable text. OCR (Optical Character Recognition) would be needed to extract text from scanned PDFs.`
      )
    } catch {
      setError('Failed to read PDF. The file may be corrupted or encrypted.')
    } finally {
      setLoading(false)
    }
  }

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name.replace('.pdf', '.txt') || 'extracted.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]) }}
        className={cn('border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
        onClick={() => document.getElementById('ptw-input')?.click()}
      >
        <input id="ptw-input" type="file" accept="application/pdf" className="sr-only"
          onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        <FileText size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold text-base mb-1">Drop a PDF here or click to upload</p>
        <p className="text-sm text-muted-foreground">Extracts text from text-based PDFs · No upload to server</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>
      )}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl glass-card">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-muted-foreground">Ready to extract</div>
              </div>
              <button onClick={() => { setFile(null); setText('') }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                Remove
              </button>
            </div>

            <button onClick={extract} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Extracting text...</>
                : <><FileText size={18} /> Extract Text</>}
            </button>

            {text && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <GlassCard hover={false} className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-medium">Extracted Text</span>
                    <div className="flex gap-2">
                      <button onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:border-primary/30 transition-all">
                        {copied ? <><Check size={12} className="text-emerald-500" /> Copied!</> : <><Copy size={12} /> Copy</>}
                      </button>
                      <button onClick={downloadTxt}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all">
                        <Download size={12} /> Download .txt
                      </button>
                    </div>
                  </div>
                  <textarea readOnly value={text}
                    className="w-full min-h-[300px] p-4 bg-transparent text-sm font-mono leading-relaxed resize-y outline-none" />
                  <div className="px-4 py-2 border-t border-border bg-secondary/20 text-xs text-muted-foreground">
                    {text.split(/\s+/).filter(Boolean).length.toLocaleString()} words · {text.length.toLocaleString()} characters
                  </div>
                </GlassCard>
              </motion.div>
            )}

            <GlassCard hover={false} className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">⚠️ Note</p>
              <p>Works best with text-based PDFs. Scanned PDFs (images of documents) may not yield readable text without OCR technology.</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

