'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, Upload, X, ArrowUp, ArrowDown, Download, Loader2, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface ImageFile {
  id: string
  name: string
  url: string
  buffer: ArrayBuffer
  width: number
  height: number
}

type PageSize = 'A4' | 'Letter' | 'fit'

export function ImageToPDFTool() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('A4')
  const [margin, setMargin] = useState(20)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const addImages = useCallback(async (files: FileList | File[]) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const arr = Array.from(files).filter(f => allowed.includes(f.type))
    if (!arr.length) { setError('Please select image files (JPG, PNG, WEBP)'); return }
    setError('')

    const loaded: ImageFile[] = await Promise.all(arr.map(async f => {
      const buffer = await f.arrayBuffer()
      const url = URL.createObjectURL(f)
      const dims = await new Promise<{ w: number; h: number }>(res => {
        const img = new Image()
        img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight })
        img.src = url
      })
      return { id: Math.random().toString(36).slice(2), name: f.name, url, buffer, width: dims.w, height: dims.h }
    }))
    setImages(prev => [...prev, ...loaded])
    setDone(false)
  }, [])

  const remove = (id: string) => setImages(prev => prev.filter(i => i.id !== id))
  const move = (idx: number, dir: -1 | 1) => {
    setImages(prev => {
      const arr = [...prev]; const t = idx + dir
      if (t < 0 || t >= arr.length) return arr
      ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
      return arr
    })
  }

  const convert = async () => {
    if (!images.length) { setError('Please add at least one image'); return }
    setLoading(true); setError('')
    try {
      const { PDFDocument, PageSizes } = await import('pdf-lib')
      const pdf = await PDFDocument.create()

      for (const img of images) {
        const bytes = new Uint8Array(img.buffer)
        const isJpeg = img.name.toLowerCase().match(/\.(jpg|jpeg)$/)
        const embedded = isJpeg
          ? await pdf.embedJpg(bytes)
          : await pdf.embedPng(bytes)

        let pw: number, ph: number
        if (pageSize === 'A4') { [pw, ph] = PageSizes.A4 }
        else if (pageSize === 'Letter') { [pw, ph] = PageSizes.Letter }
        else { pw = embedded.width + margin * 2; ph = embedded.height + margin * 2 }

        const page = pdf.addPage([pw, ph])
        const maxW = pw - margin * 2
        const maxH = ph - margin * 2
        const scale = Math.min(maxW / embedded.width, maxH / embedded.height)
        const w = embedded.width * scale
        const h = embedded.height * scale
        page.drawImage(embedded, {
          x: (pw - w) / 2,
          y: (ph - h) / 2,
          width: w,
          height: h,
        })
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'images.pdf'; a.click()
      URL.revokeObjectURL(url)
      setDone(true)
    } catch (e) {
      setError('Failed to convert images. Try JPG or PNG format.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addImages(e.dataTransfer.files) }}
        className={cn('border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer',
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
        onClick={() => document.getElementById('img-input')?.click()}
      >
        <input id="img-input" type="file" accept="image/*" multiple className="sr-only"
          onChange={e => e.target.files && addImages(e.target.files)} />
        <ImageIcon size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="font-semibold text-base mb-1">Drop images here or click to upload</p>
        <p className="text-sm text-muted-foreground">JPG, PNG, WEBP · Multiple images supported</p>
      </div>

      {error && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>}

      <AnimatePresence>
        {images.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Settings */}
            <GlassCard hover={false}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Page Size</label>
                  <div className="flex gap-2">
                    {(['A4', 'Letter', 'fit'] as PageSize[]).map(s => (
                      <button key={s} onClick={() => setPageSize(s)}
                        className={cn('flex-1 py-2 rounded-xl text-sm font-medium transition-all border',
                          pageSize === s ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                        )}>
                        {s === 'fit' ? 'Fit Image' : s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Margin: {margin}px</label>
                  <input type="range" min={0} max={60} value={margin} onChange={e => setMargin(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 mt-3" />
                </div>
              </div>
            </GlassCard>

            {/* Image list */}
            <div className="space-y-2">
              {images.map((img, i) => (
                <motion.div key={img.id} layout className="flex items-center gap-3 p-3 rounded-xl glass-card">
                  <img src={img.url} alt={img.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{img.name}</div>
                    <div className="text-xs text-muted-foreground">{img.width}×{img.height}px</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30"><ArrowUp size={13} /></button>
                    <button onClick={() => move(i, 1)} disabled={i === images.length - 1} className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30"><ArrowDown size={13} /></button>
                    <button onClick={() => remove(img.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive"><X size={13} /></button>
                  </div>
                </motion.div>
              ))}
            </div>

            <button onClick={convert} disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-base hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Converting...</>
                : done ? <><CheckCircle2 size={18} /> Convert Again</>
                : <><Download size={18} /> Convert to PDF</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

