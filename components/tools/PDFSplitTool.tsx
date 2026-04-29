'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Scissors, Upload, Download, Loader2, CheckCircle2, FileStack } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

type SplitMode = 'all' | 'range' | 'every'

export function PDFSplitTool() {
  const [file, setFile] = useState<{ name: string; buffer: ArrayBuffer; pages: number } | null>(null)
  const [mode, setMode] = useState<SplitMode>('all')
  const [range, setRange] = useState('')
  const [every, setEvery] = useState('1')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const loadFile = async (f: File) => {
    if (f.type !== 'application/pdf') { setError('Please select a PDF file'); return }
    setError('')
    setDone(false)
    const buffer = await f.arrayBuffer()
    try {
      const { PDFDocument } = await import('pdf-lib')
      const doc = await PDFDocument.load(buffer)
      setFile({ name: f.name, buffer, pages: doc.getPageCount() })
    } catch {
      setError('Could not read PDF. It may be encrypted.')
    }
  }

  const splitPDF = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(file.buffer)
      const total = src.getPageCount()

      // Build page groups
      let groups: number[][] = []

      if (mode === 'all') {
        groups = Array.from({ length: total }, (_, i) => [i])
      } else if (mode === 'every') {
        const n = parseInt(every) || 1
        for (let i = 0; i < total; i += n) {
          groups.push(Array.from({ length: Math.min(n, total - i) }, (_, j) => i + j))
        }
      } else if (mode === 'range') {
        // Parse range like "1-3,5,7-9"
        const parts = range.split(',').map(s => s.trim())
        const pages: number[] = []
        for (const part of parts) {
          if (part.includes('-')) {
            const [a, b] = part.split('-').map(Number)
            for (let i = a; i <= b; i++) pages.push(i - 1)
          } else {
            pages.push(Number(part) - 1)
          }
        }
        groups = [pages.filter(p => p >= 0 && p < total)]
      }

      if (groups.length === 1) {
        // Single output
        const out = await PDFDocument.create()
        const copied = await out.copyPages(src, groups[0])
        copied.forEach(p => out.addPage(p))
        const bytes = await out.save()
        downloadBlob(bytes, `split.pdf`)
      } else {
        // Multiple outputs — download each
        for (let i = 0; i < groups.length; i++) {
          const out = await PDFDocument.create()
          const copied = await out.copyPages(src, groups[i])
          copied.forEach(p => out.addPage(p))
          const bytes = await out.save()
          downloadBlob(bytes, `page-${groups[i][0] + 1}${groups[i].length > 1 ? `-${groups[i][groups[i].length - 1] + 1}` : ''}.pdf`)
          await new Promise(r => setTimeout(r, 300))
        }
      }
      setDone(true)
    } catch (e) {
      setError('Failed to split PDF.')
    } finally {
      setLoading(false)
    }
  }

  const downloadBlob = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]) }}
        className={cn('border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
        onClick={() => document.getElementById('split-input')?.click()}
      >
        <input id="split-input" type="file" accept="application/pdf" className="sr-only"
          onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold text-base mb-1">Drop a PDF file here or click to upload</p>
        <p className="text-sm text-muted-foreground">Single PDF · Processed locally</p>
      </div>

      {error && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 p-4 rounded-xl glass-card">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <FileStack size={18} className="text-orange-500" />
              </div>
              <div>
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.pages} pages</div>
              </div>
              <button onClick={() => { setFile(null); setDone(false) }}
                className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors">
                Remove
              </button>
            </div>

            {/* Split mode */}
            <GlassCard hover={false}>
              <h3 className="font-semibold text-sm mb-3">Split Mode</h3>
              <div className="space-y-3">
                {[
                  { id: 'all' as SplitMode, label: 'Extract all pages separately', desc: `Creates ${file.pages} individual PDFs` },
                  { id: 'every' as SplitMode, label: 'Split every N pages', desc: 'Creates equal-sized PDF chunks' },
                  { id: 'range' as SplitMode, label: 'Extract page range', desc: 'e.g. 1-3, 5, 7-9' },
                ].map(m => (
                  <div key={m.id}>
                    <label className={cn('flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border',
                      mode === m.id ? 'bg-primary/10 border-primary/40' : 'border-transparent hover:bg-secondary/50'
                    )}>
                      <input type="radio" name="mode" value={m.id} checked={mode === m.id}
                        onChange={() => setMode(m.id)} className="mt-0.5 accent-primary" />
                      <div>
                        <div className="text-sm font-medium">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.desc}</div>
                      </div>
                    </label>
                    {mode === 'every' && m.id === 'every' && (
                      <div className="mt-2 ml-6">
                        <input type="number" value={every} onChange={e => setEvery(e.target.value)}
                          min="1" max={file.pages} placeholder="Pages per chunk"
                          className="w-40 px-3 py-2 rounded-xl bg-secondary/50 border border-border text-sm focus:border-primary focus:outline-none" />
                      </div>
                    )}
                    {mode === 'range' && m.id === 'range' && (
                      <div className="mt-2 ml-6">
                        <input type="text" value={range} onChange={e => setRange(e.target.value)}
                          placeholder="e.g. 1-3, 5, 7-9"
                          className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border text-sm focus:border-primary focus:outline-none" />
                        <p className="text-xs text-muted-foreground mt-1">Use commas to separate ranges. Page numbers start at 1.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            <button onClick={splitPDF} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Splitting...</>
                : done ? <><CheckCircle2 size={18} /> Done! Split Again</>
                : <><Scissors size={18} /> Split PDF</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
