'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilePlus, Download, Loader2, CheckCircle2, Upload } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

type FontSize = '10' | '11' | '12' | '14'
type PageSz = 'A4' | 'Letter'

export function WordToPDFTool() {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [fontSize, setFontSize] = useState<FontSize>('12')
  const [pageSize, setPageSize] = useState<PageSz>('A4')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const convert = async () => {
    if (!text.trim()) { setError('Please enter some text first'); return }
    setLoading(true); setError('')
    try {
      const { PDFDocument, StandardFonts, rgb, PageSizes } = await import('pdf-lib')
      const pdf = await PDFDocument.create()
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)

      const [pw, ph] = pageSize === 'A4' ? PageSizes.A4 : PageSizes.Letter
      const margin = 60
      const fs = parseInt(fontSize)
      const lineH = fs * 1.5
      const maxW = pw - margin * 2

      // Word wrap function
      const wrapText = (str: string, maxWidth: number, f: typeof font, size: number): string[] => {
        const words = str.split(' ')
        const lines: string[] = []
        let current = ''
        for (const word of words) {
          const test = current ? `${current} ${word}` : word
          const w = f.widthOfTextAtSize(test, size)
          if (w > maxWidth && current) { lines.push(current); current = word }
          else current = test
        }
        if (current) lines.push(current)
        return lines
      }

      let page = pdf.addPage([pw, ph])
      let y = ph - margin

      // Title
      if (title.trim()) {
        const titleLines = wrapText(title, maxW, boldFont, fs + 4)
        for (const line of titleLines) {
          if (y < margin) { page = pdf.addPage([pw, ph]); y = ph - margin }
          page.drawText(line, { x: margin, y, font: boldFont, size: fs + 4, color: rgb(0, 0, 0) })
          y -= (fs + 4) * 1.6
        }
        y -= fs
      }

      // Body text - split into paragraphs
      const paragraphs = text.split('\n')
      for (const para of paragraphs) {
        if (!para.trim()) { y -= lineH * 0.5; continue }
        const lines = wrapText(para, maxW, font, fs)
        for (const line of lines) {
          if (y < margin + lineH) { page = pdf.addPage([pw, ph]); y = ph - margin }
          page.drawText(line, { x: margin, y, font, size: fs, color: rgb(0.1, 0.1, 0.1) })
          y -= lineH
        }
        y -= lineH * 0.3
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e) {
      setError('Failed to create PDF.')
    } finally {
      setLoading(false)
    }
  }

  // Load .txt file
  const loadTxt = async (f: File) => {
    const content = await f.text()
    setText(content)
    setTitle(f.name.replace(/\.[^/.]+$/, ''))
    setDone(false)
  }

  return (
    <div className="space-y-5">
      {/* Text input */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="flex items-center gap-2 text-sm font-medium">
            <FilePlus size={14} className="text-primary" /> Your Text
          </span>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:border-primary/30 cursor-pointer transition-all">
            <Upload size={12} /> Load .txt file
            <input type="file" accept=".txt" className="sr-only" onChange={e => e.target.files?.[0] && loadTxt(e.target.files[0])} />
          </label>
        </div>
        <div className="p-4 space-y-3">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Document title (optional)"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm font-semibold focus:border-primary focus:outline-none transition-all" />
          <textarea value={text} onChange={e => { setText(e.target.value); setDone(false) }}
            placeholder="Type or paste your text here…&#10;&#10;Supports multiple paragraphs.&#10;Each blank line creates a new paragraph."
            className="w-full min-h-[280px] bg-transparent text-sm resize-y outline-none placeholder:text-muted-foreground/50 leading-relaxed"
          />
        </div>
        <div className="px-4 py-2 border-t border-border bg-secondary/20 text-xs text-muted-foreground">
          {text.trim().split(/\s+/).filter(Boolean).length} words · {text.length} characters
        </div>
      </GlassCard>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard hover={false} className="p-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Page Size</label>
          <div className="flex gap-2">
            {(['A4', 'Letter'] as PageSz[]).map(s => (
              <button key={s} onClick={() => setPageSize(s)}
                className={cn('flex-1 py-2 rounded-xl text-sm font-medium transition-all border',
                  pageSize === s ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                )}>{s}</button>
            ))}
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Font Size</label>
          <div className="flex gap-1.5">
            {(['10', '11', '12', '14'] as FontSize[]).map(s => (
              <button key={s} onClick={() => setFontSize(s)}
                className={cn('flex-1 py-2 rounded-xl text-sm font-medium transition-all border',
                  fontSize === s ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                )}>{s}pt</button>
            ))}
          </div>
        </GlassCard>
      </div>

      {error && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

      <button onClick={convert} disabled={loading || !text.trim()}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Creating PDF...</>
          : done ? <><CheckCircle2 size={18} /> Create Again</>
          : <><Download size={18} /> Convert to PDF</>}
      </button>
    </div>
  )
}
