'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileStack, Upload, X, ArrowUp, ArrowDown, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface PDFFile {
  id: string
  name: string
  size: number
  arrayBuffer: ArrayBuffer
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PDFMergeTool() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    if (!arr.length) { setError('Please select PDF files only'); return }
    setError('')
    const loaded: PDFFile[] = await Promise.all(
      arr.map(async f => ({
        id: Math.random().toString(36).slice(2),
        name: f.name,
        size: f.size,
        arrayBuffer: await f.arrayBuffer(),
      }))
    )
    setFiles(prev => [...prev, ...loaded])
    setDone(false)
  }, [])

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id))

  const moveFile = (idx: number, dir: -1 | 1) => {
    setFiles(prev => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  const mergePDFs = async () => {
    if (files.length < 2) { setError('Please add at least 2 PDF files'); return }
    setLoading(true)
    setError('')
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()

      for (const file of files) {
        const doc = await PDFDocument.load(file.arrayBuffer)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }

      const bytes = await merged.save()
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e) {
      setError('Failed to merge PDFs. Make sure files are not encrypted.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
        onClick={() => document.getElementById('pdf-input')?.click()}
      >
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf"
          multiple
          className="sr-only"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold text-base mb-1">Drop PDF files here or click to upload</p>
        <p className="text-sm text-muted-foreground">Supports multiple PDFs · Processed locally in your browser</p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{files.length} PDF{files.length > 1 ? 's' : ''} added</h3>
              <button onClick={() => { setFiles([]); setDone(false) }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                Clear all
              </button>
            </div>

            {files.map((file, i) => (
              <motion.div key={file.id} layout
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-xl glass-card"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <FileStack size={14} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{formatSize(file.size)}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveFile(i, -1)} disabled={i === 0}
                    className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors">
                    <ArrowUp size={13} />
                  </button>
                  <button onClick={() => moveFile(i, 1)} disabled={i === files.length - 1}
                    className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors">
                    <ArrowDown size={13} />
                  </button>
                  <button onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <X size={13} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Merge button */}
            <button
              onClick={mergePDFs}
              disabled={loading || files.length < 2}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Merging PDFs...</>
              ) : done ? (
                <><CheckCircle2 size={18} /> Merged Successfully! Download Again</>
              ) : (
                <><Download size={18} /> Merge & Download PDF</>
              )}
            </button>

            {done && (
              <p className="text-center text-sm text-emerald-500 font-medium">
                ✅ Your merged PDF has been downloaded!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <GlassCard hover={false} className="text-sm text-muted-foreground space-y-1.5">
        <p className="font-semibold text-foreground">How it works:</p>
        <p>🔒 All processing happens in your browser — no files are uploaded to any server.</p>
        <p>📄 You can add as many PDFs as you want and reorder them by using the arrows.</p>
        <p>⚠️ Encrypted or password-protected PDFs cannot be merged.</p>
      </GlassCard>
    </div>
  )
}
