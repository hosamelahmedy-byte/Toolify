'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Palette, Copy, Check, Shuffle, RefreshCw } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

// ── Color Engine ───────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return [0, 0, 0, 100]
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ]
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // Simplified OKLCH approximation
  const [h, s, l] = rgbToHsl(r, g, b)
  const lOk = Math.round(l * 0.95 * 10) / 10
  const c = Math.round(s * 0.4 * 100) / 100
  return [lOk, c, h]
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const [r, g, b] = rgb
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function generatePalette(hex: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const [r, g, b] = rgb
  const [h, s] = rgbToHsl(r, g, b)
  return [10, 20, 35, 50, 65, 80, 90].map(l => rgbToHex(...hslToRgb(h, s, l)))
}

function generateAnalogous(hex: string): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  const [r, g, b] = rgb
  const [h, s, l] = rgbToHsl(r, g, b)
  return [-30, -15, 0, 15, 30].map(offset => {
    const hue = ((h + offset) + 360) % 360
    return rgbToHex(...hslToRgb(hue, s, l))
  })
}

const PRESETS = [
  '#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6',
  '#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316',
]

// ── Component ──────────────────────────────────────────────

export function ColorConverterTool() {
  const [hex, setHex] = useState('#6366f1')
  const [hexInput, setHexInput] = useState('#6366f1')
  const [copied, setCopied] = useState<string | null>(null)
  const [tab, setTab] = useState<'formats' | 'palette' | 'analogous'>('formats')

  const rgb = useMemo(() => hexToRgb(hex) || [99, 102, 241] as [number,number,number], [hex])
  const hsl = useMemo(() => rgbToHsl(...rgb), [rgb])
  const cmyk = useMemo(() => rgbToCmyk(...rgb), [rgb])
  const oklch = useMemo(() => rgbToOklch(...rgb), [rgb])
  const contrast = useMemo(() => getContrastColor(hex), [hex])
  const palette = useMemo(() => generatePalette(hex), [hex])
  const analogous = useMemo(() => generateAnalogous(hex), [hex])

  const applyHex = useCallback((val: string) => {
    const clean = val.startsWith('#') ? val : '#' + val
    const rgb = hexToRgb(clean)
    if (rgb) { setHex(clean); setHexInput(clean) }
  }, [])

  const copyVal = async (val: string, key: string) => {
    await copyToClipboard(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const randomColor = () => {
    const h = Math.floor(Math.random() * 360)
    const s = 60 + Math.floor(Math.random() * 30)
    const l = 45 + Math.floor(Math.random() * 20)
    const newHex = rgbToHex(...hslToRgb(h, s, l))
    setHex(newHex); setHexInput(newHex)
  }

  const FORMATS = [
    { key: 'hex',  label: 'HEX',   value: hex.toUpperCase() },
    { key: 'rgb',  label: 'RGB',   value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
    { key: 'rgba', label: 'RGBA',  value: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)` },
    { key: 'hsl',  label: 'HSL',   value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { key: 'hsla', label: 'HSLA',  value: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)` },
    { key: 'oklch',label: 'OKLCH', value: `oklch(${oklch[0]}% ${oklch[1]} ${oklch[2]})` },
    { key: 'cmyk', label: 'CMYK',  value: `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)` },
    { key: 'css',  label: 'CSS Var',value: `--color: ${hex.toUpperCase()};` },
  ]

  return (
    <div className="space-y-5">
      {/* Main color picker + preview */}
      <GlassCard hover={false}>
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Large color swatch */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shrink-0 cursor-pointer"
            style={{ background: hex, width: 140, height: 140, minWidth: 140 }}
            animate={{ background: hex }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="color"
              value={hex}
              onChange={e => { setHex(e.target.value); setHexInput(e.target.value) }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div className="absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}>
              Click to pick
            </div>
          </motion.div>

          <div className="flex-1 space-y-4">
            {/* HEX input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">HEX Color</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={e => { setHexInput(e.target.value); applyHex(e.target.value) }}
                  onBlur={() => applyHex(hexInput)}
                  placeholder="#6366f1"
                  maxLength={7}
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-mono uppercase"
                />
                <button onClick={randomColor}
                  className="px-3 py-3 rounded-xl glass-card hover:border-primary/30 transition-all" title="Random color">
                  <Shuffle size={15} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* RGB sliders */}
            <div className="space-y-2">
              {(['R', 'G', 'B'] as const).map((ch, i) => {
                const colors = ['#ef4444', '#22c55e', '#3b82f6']
                return (
                  <div key={ch} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-4" style={{ color: colors[i] }}>{ch}</span>
                    <input type="range" min={0} max={255} value={rgb[i]}
                      onChange={e => {
                        const newRgb = [...rgb] as [number,number,number]
                        newRgb[i] = parseInt(e.target.value)
                        const newHex = rgbToHex(...newRgb)
                        setHex(newHex); setHexInput(newHex)
                      }}
                      className="flex-1 accent-primary h-1.5"
                      style={{ accentColor: colors[i] }}
                    />
                    <span className="text-xs font-mono w-8 text-right text-muted-foreground">{rgb[i]}</span>
                  </div>
                )
              })}
            </div>

            {/* Contrast info */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">Contrast text:</div>
              <div className="flex gap-2">
                {['#ffffff', '#000000'].map(c => (
                  <div key={c} className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold"
                    style={{ background: hex, color: c, borderColor: 'rgba(128,128,128,0.2)' }}>
                    Aa
                  </div>
                ))}
                <span className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground">
                  Best: <span className="font-mono font-bold">{contrast}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={p} onClick={() => { setHex(p); setHexInput(p) }}
            className={cn('w-8 h-8 rounded-xl transition-all border-2', hex === p ? 'border-foreground scale-110' : 'border-transparent hover:scale-105')}
            style={{ background: p }} title={p} />
        ))}
        <span className="text-xs text-muted-foreground self-center ml-1">Presets</span>
      </div>

      {/* Tabs */}
      <GlassCard hover={false} className="p-0 overflow-hidden">
        <div className="flex border-b border-border">
          {['formats','palette','analogous'].map(t => (
            <button key={t} onClick={() => setTab(t as any)}
              className={cn('flex-1 py-3 text-sm font-medium capitalize transition-all',
                tab === t ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
              )}>{t}</button>
          ))}
        </div>
        <div className="p-4">

          {/* FORMATS */}
          {tab === 'formats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORMATS.map(f => (
                <div key={f.key} className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 group">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">{f.label}</div>
                    <div className="text-sm font-mono">{f.value}</div>
                  </div>
                  <button onClick={() => copyVal(f.value, f.key)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-secondary">
                    {copied === f.key
                      ? <Check size={13} className="text-emerald-500" />
                      : <Copy size={13} className="text-muted-foreground" />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PALETTE (tints & shades) */}
          {tab === 'palette' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">Tints & shades of your color — same hue, varying lightness</p>
              <div className="flex gap-2">
                {palette.map((c, i) => (
                  <div key={c} className="flex-1 group cursor-pointer" onClick={() => copyVal(c, c)}>
                    <motion.div className="rounded-xl mb-1.5 transition-all group-hover:scale-105"
                      style={{ background: c, height: i === 3 ? 64 : 48 }} />
                    <div className="text-[10px] font-mono text-center text-muted-foreground group-hover:text-foreground transition-colors">{c.toUpperCase()}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">Click any shade to copy its HEX</p>
            </div>
          )}

          {/* ANALOGOUS */}
          {tab === 'analogous' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">Analogous colors — adjacent hues on the color wheel</p>
              <div className="flex gap-2">
                {analogous.map((c, i) => (
                  <div key={c} className="flex-1 group cursor-pointer" onClick={() => copyVal(c, c)}>
                    <motion.div className="rounded-xl mb-1.5 h-16 transition-all group-hover:scale-105 border-2"
                      style={{ background: c, borderColor: i === 2 ? 'rgba(255,255,255,0.5)' : 'transparent' }} />
                    <div className="text-[10px] font-mono text-center text-muted-foreground group-hover:text-foreground">{c.toUpperCase()}</div>
                    {i === 2 && <div className="text-[9px] text-center text-primary font-bold mt-0.5">BASE</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}

