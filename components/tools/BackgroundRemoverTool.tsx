'use client'

import { useState, useCallback, useRef } from 'react'
import { UploadCloud, Download, RotateCcw, ImageIcon } from 'lucide-react'

type ProcessingState = 'idle' | 'loading-model' | 'processing' | 'done' | 'error'

export function BackgroundRemoverTool() {
  const [original, setOriginal] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [state, setState] = useState<ProcessingState>('idle')
  const [progress, setProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [view, setView] = useState<'split' | 'result' | 'original'>('split')
  const inputRef = useRef<HTMLInputElement>(null)

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image (PNG, JPG, WebP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image too large. Please use an image under 10MB.')
      return
    }

    setErrorMsg(null)
    setResult(null)
    setProgress(0)

    const originalUrl = URL.createObjectURL(file)
    setOriginal(originalUrl)

    try {
      setState('loading-model')
      setProgress(10)

      const { AutoModel, AutoProcessor, env, RawImage } =
        await import('@huggingface/transformers')

      env.allowLocalModels = false
      env.useBrowserCache = true

      setProgress(25)

      const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        config: { model_type: 'custom' },
      })

      const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
        config: {
          do_normalize: true,
          do_pad: false,
          do_rescale: true,
          do_resize: true,
          image_mean: [0.5, 0.5, 0.5],
          feature_extractor_type: 'ImageFeatureExtractor',
          image_std: [1, 1, 1],
          resample: 2,
          rescale_factor: 0.00392156862745098,
          size: { width: 1024, height: 1024 },
        },
      })

      setState('processing')
      setProgress(50)

      const img = await RawImage.fromURL(originalUrl)
      setProgress(65)

      const { pixel_values } = await processor(img)
      setProgress(75)

      const { output } = await model({ input: pixel_values })
      setProgress(88)

      // Apply mask to original image via canvas
      const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(img.width, img.height)

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      const imgEl = new Image()
      imgEl.crossOrigin = 'anonymous'
      imgEl.src = originalUrl
      await new Promise<void>((res) => { imgEl.onload = () => res() })
      ctx.drawImage(imgEl, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < mask.data.length; i++) {
        imageData.data[i * 4 + 3] = (mask.data as unknown as number[])[i]
      }
      ctx.putImageData(imageData, 0, 0)

      setProgress(100)
      setResult(canvas.toDataURL('image/png'))
      setState('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to remove background. Please try a different image.')
      setState('error')
    }
  }, [])

  const handleFile = (f: File) => processImage(f)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = 'background-removed.png'
    a.click()
  }

  const handleReset = () => {
    if (original) URL.revokeObjectURL(original)
    setOriginal(null)
    setResult(null)
    setState('idle')
    setProgress(0)
    setErrorMsg(null)
    setView('split')
  }

  const isProcessing = state === 'loading-model' || state === 'processing'

  const checkerStyle = {
    backgroundImage: `linear-gradient(45deg, #d1d5db 25%, transparent 25%),
      linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #d1d5db 75%),
      linear-gradient(-45deg, transparent 75%, #d1d5db 75%)`,
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    backgroundColor: '#f9fafb',
  }

  // ── Upload ─────────────────────────────────────────────────
  if (!original) {
    return (
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
            ${dragging ? 'border-pink-500 bg-pink-500/5' : 'border-border hover:border-pink-500/50 hover:bg-pink-500/5'}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-pink-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop your image here or <span className="text-pink-400">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP · Max 10MB</p>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Private', desc: 'Processed in browser' },
            { label: 'No Watermark', desc: 'Clean PNG download' },
            { label: 'No Limits', desc: 'Unlimited images' },
          ].map((f) => (
            <div key={f.label} className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Processing ─────────────────────────────────────────────
  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden bg-muted/40 aspect-video flex items-center justify-center">
          <img src={original} alt="Original" className="max-h-64 object-contain opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground text-center px-4">
              {state === 'loading-model'
                ? 'Loading AI model… (first time may take 10–20 seconds)'
                : 'Removing background…'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{state === 'loading-model' ? 'Loading model' : 'Processing'}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Result ─────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex gap-2 bg-muted rounded-xl p-1 w-fit mx-auto">
        {(['split', 'original', 'result'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg transition-all capitalize ${
              view === v ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'split' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden bg-muted/40 flex flex-col">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
              <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Original</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <img src={original!} alt="Original" className="max-h-52 w-full object-contain rounded-lg" />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden flex flex-col" style={checkerStyle}>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/40 bg-white/60">
              <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-pink-400 to-rose-400 flex-shrink-0" />
              <span className="text-xs text-zinc-600 font-medium">Result</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              {result && <img src={result} alt="Result" className="max-h-52 w-full object-contain rounded-lg" />}
            </div>
          </div>
        </div>
      )}

      {view === 'original' && (
        <div className="rounded-2xl bg-muted/40 flex items-center justify-center p-4 min-h-[280px]">
          <img src={original!} alt="Original" className="max-h-72 object-contain" />
        </div>
      )}

      {view === 'result' && result && (
        <div className="rounded-2xl flex items-center justify-center p-4 min-h-[280px]" style={checkerStyle}>
          <img src={result} alt="Result" className="max-h-72 object-contain" />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500
                     text-white font-semibold text-sm py-3 rounded-xl transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border
                     text-muted-foreground hover:text-foreground text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          New Image
        </button>
      </div>

      {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}
    </div>
  )
}
