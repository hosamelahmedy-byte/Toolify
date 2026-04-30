'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileArchive, Upload, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function CompressPDFTool() {
  const [file, setFile] = useState<{ name: string; buffer: ArrayBuffer; size: number } | null>(null)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ size: number; saved: number } | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const loadFile = async (f: File) => {
    if (f.type !== 'application/pdf') { setError('Please select a PDF file'); return }
    setError(''); setResult(null)
    const buffer = await f.arrayBuffer()
    setFile({ name: f.name, buffer, size: f.size })
  }

  const compress = async () => {
    if (!file) return
    setLoading(true); setError('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const src = await PDFDocument.load(file.buffer, { ignoreEncryption: true })

      // Create new PDF and copy pages (this removes unused objects & compresses)
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, src.getPageIndices())
      pages.forEach(p => out.addPage(p))

      // Save with compression options
      const useObjectStreams = quality !== 'high'
      const bytes = await out.save({ useObjectStreams, addDefaultPage: false })

      const saved = file.size - bytes.length
      const savedPct = Math.round((saved / file.size) * 100)

      // Download
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compressed-${file.name}`
      a.click()
      URL.revokeObjectURL(url)

      setResult({ size: bytes.length, saved: Math.max(0, saved) })
    } catch {
      setError('Failed to compress PDF. It may be encrypted or corrupted.')
    } finally {
      setLoading(false)
    }
  }

  const QUALITY_OPTIONS = [
    { id: 'low' as const, label: 'Maximum Compression', desc: 'Smallest file, may reduce quality slightly' },
    { id: 'medium' as const, label: 'Balanced', desc: 'Good compression with minimal quality loss' },
    { id: 'high' as const, label: 'High Quality', desc: 'Minimal compression, best quality' },
  ]

  return (
    <div className="space-y-5">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]) }}
        className={cn('border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
        onClick={() => document.getElementById('compress-input')?.click()}
      >
        <input id="compress-input" type="file" accept="application/pdf" className="sr-only"
          onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
        <FileArchive size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold text-base mb-1">Drop a PDF here or click to upload</p>
        <p className="text-sm text-muted-foreground">Compressed locally · No upload to server</p>
      </div>

      {error && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* File info */}
            <div className="flex items-center gap-3 p-4 rounded-xl glass-card">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <FileArchive size={18} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{file.name}</div>
                <div className="text-xs text-muted-foreground">Original size: {formatSize(file.size)}</div>
              </div>
            </div>

            {/* Quality options */}
            <GlassCard hover={false}>
              <h3 className="font-semibold text-sm mb-3">Compression Level</h3>
              <div className="space-y-2">
                {QUALITY_OPTIONS.map(opt => (
                  <label key={opt.id} className={cn('flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border',
                    quality === opt.id ? 'bg-primary/10 border-primary/40' : 'border-transparent hover:bg-secondary/50'
                  )}>
                    <input type="radio" name="quality" value={opt.id} checked={quality === opt.id}
                      onChange={() => setQuality(opt.id)} className="accent-primary" />
                    <div>
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </GlassCard>

            {/* Result */}
            {result && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Original', value: formatSize(file.size), color: '#6366f1' },
                  { label: 'Compressed', value: formatSize(result.size), color: '#22c55e' },
                  { label: 'Saved', value: result.saved > 0 ? formatSize(result.saved) : '~0 KB', color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="glass-card p-3 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={compress} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Compressing...</>
                : result ? <><Download size={18} /> Download Again</>
                : <><FileArchive size={18} /> Compress & Download</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

