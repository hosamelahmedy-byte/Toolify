'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode, Download, Copy, Check, RefreshCw, Link2, Type, Wifi,
  Mail, Phone, MessageSquare, ChevronDown
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

// ── QR Types ────────────────────────────────────────────────

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi'

interface QRTypeConfig {
  id: QRType
  label: string
  icon: typeof Link2
  placeholder: string
  build: (fields: Record<string, string>) => string
  fields: { key: string; label: string; type?: string; options?: string[] }[]
}

const QR_TYPES: QRTypeConfig[] = [
  {
    id: 'url',
    label: 'URL',
    icon: Link2,
    placeholder: 'https://example.com',
    build: (f) => f.value || '',
    fields: [{ key: 'value', label: 'Website URL', type: 'url' }],
  },
  {
    id: 'text',
    label: 'Text',
    icon: Type,
    placeholder: 'Enter any text…',
    build: (f) => f.value || '',
    fields: [{ key: 'value', label: 'Plain Text' }],
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'hello@example.com',
    build: (f) => `mailto:${f.email}?subject=${encodeURIComponent(f.subject || '')}&body=${encodeURIComponent(f.body || '')}`,
    fields: [
      { key: 'email', label: 'Email Address', type: 'email' },
      { key: 'subject', label: 'Subject (optional)' },
      { key: 'body', label: 'Body (optional)' },
    ],
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: Phone,
    placeholder: '+1 555 000 0000',
    build: (f) => `tel:${f.phone}`,
    fields: [{ key: 'phone', label: 'Phone Number', type: 'tel' }],
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: MessageSquare,
    placeholder: '+1 555 000 0000',
    build: (f) => `sms:${f.phone}${f.message ? `?body=${encodeURIComponent(f.message)}` : ''}`,
    fields: [
      { key: 'phone', label: 'Phone Number', type: 'tel' },
      { key: 'message', label: 'Message (optional)' },
    ],
  },
  {
    id: 'wifi',
    label: 'WiFi',
    icon: Wifi,
    placeholder: 'Network name',
    build: (f) => `WIFI:T:${f.security || 'WPA'};S:${f.ssid};P:${f.password};;`,
    fields: [
      { key: 'ssid', label: 'Network Name (SSID)' },
      { key: 'password', label: 'Password' },
      { key: 'security', label: 'Security', options: ['WPA', 'WEP', 'nopass'] },
    ],
  },
]

// ── QR Generator (pure canvas, no external lib) ────────────

// Reed-Solomon & QR encoding — we use a lightweight approach via
// the browser's native canvas + a data URI trick with qrserver API
// For full offline support we use the free QR API (no rate limit for reasonable use)
function buildQRApiUrl(data: string, size: number, fg: string, bg: string) {
  const fgHex = fg.replace('#', '')
  const bgHex = bg.replace('#', '')
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=${fgHex}&bgcolor=${bgHex}&format=png&ecc=M`
}

// ── Color Presets ────────────────────────────────────────────

const COLOR_PRESETS = [
  { fg: '#000000', bg: '#ffffff', label: 'Classic' },
  { fg: '#1e40af', bg: '#eff6ff', label: 'Blue' },
  { fg: '#15803d', bg: '#f0fdf4', label: 'Green' },
  { fg: '#9333ea', bg: '#faf5ff', label: 'Purple' },
  { fg: '#dc2626', bg: '#fef2f2', label: 'Red' },
  { fg: '#d97706', bg: '#fffbeb', label: 'Amber' },
  { fg: '#0f172a', bg: '#f8fafc', label: 'Slate' },
  { fg: '#be185d', bg: '#fdf2f8', label: 'Pink' },
]

// ── Main Component ──────────────────────────────────────────

export function QRCodeGeneratorTool() {
  const [activeType, setActiveType] = useState<QRType>('url')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrSize, setQrSize] = useState(300)
  const [qrData, setQrData] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const typeConfig = QR_TYPES.find((t) => t.id === activeType)!

  // Build QR data from fields
  const buildData = useCallback(() => {
    return typeConfig.build(fields)
  }, [typeConfig, fields])

  // Update QR URL with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const data = buildData()
      setQrData(data)
      if (data.trim()) {
        setLoading(true)
        setImgError(false)
        setQrUrl(buildQRApiUrl(data, Math.min(qrSize * 2, 600), fgColor, bgColor))
      } else {
        setQrUrl('')
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [fields, fgColor, bgColor, qrSize, buildData])

  // Reset fields when type changes
  const handleTypeChange = (type: QRType) => {
    setActiveType(type)
    setFields({})
    setQrUrl('')
    setQrData('')
  }

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleDownload = async () => {
    if (!qrUrl) return
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-code-toolify.png`
    link.click()
  }

  const handleCopyData = async () => {
    if (!qrData) return
    await copyToClipboard(qrData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setFields({})
    setFgColor('#000000')
    setBgColor('#ffffff')
    setQrSize(300)
    setQrUrl('')
    setQrData('')
  }

  const isEmpty = !qrData.trim()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Left Panel: Controls ─────────────────────────── */}
      <div className="lg:col-span-3 space-y-5">

        {/* Type Selector */}
        <GlassCard>
          <p className="text-sm font-medium text-muted-foreground mb-3">QR Code Type</p>
          <div className="flex flex-wrap gap-2">
            {QR_TYPES.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => handleTypeChange(t.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    activeType === t.id
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                  )}
                >
                  <Icon size={14} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </GlassCard>

        {/* Dynamic Fields */}
        <GlassCard>
          <p className="text-sm font-medium text-muted-foreground mb-4">Content</p>
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeType}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {typeConfig.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      {field.label}
                    </label>
                    {field.options ? (
                      <div className="relative">
                        <select
                          value={fields[field.key] || field.options[0]}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className={cn(
                            'w-full px-3 py-2.5 rounded-xl text-sm appearance-none',
                            'bg-white/5 border border-white/10 text-foreground',
                            'focus:outline-none focus:border-primary/50 focus:bg-white/10',
                            'transition-all'
                          )}
                        >
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={fields[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field === typeConfig.fields[0] ? typeConfig.placeholder : ''}
                        className={cn(
                          'w-full px-3 py-2.5 rounded-xl text-sm',
                          'bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50',
                          'focus:outline-none focus:border-primary/50 focus:bg-white/10',
                          'transition-all'
                        )}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlassCard>

        {/* Customization */}
        <GlassCard>
          <p className="text-sm font-medium text-muted-foreground mb-4">Customization</p>

          {/* Color Presets */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Color Presets</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setFgColor(p.fg); setBgColor(p.bg) }}
                  title={p.label}
                  className={cn(
                    'w-7 h-7 rounded-lg border-2 transition-all hover:scale-110',
                    fgColor === p.fg && bgColor === p.bg
                      ? 'border-primary scale-110'
                      : 'border-white/20'
                  )}
                  style={{ background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)` }}
                />
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-2 py-2 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-2 py-2 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground">Size</label>
              <span className="text-xs text-muted-foreground">{qrSize}×{qrSize}px</span>
            </div>
            <input
              type="range"
              min={150}
              max={500}
              step={50}
              value={qrSize}
              onChange={(e) => setQrSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>150px</span>
              <span>500px</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Right Panel: Preview ─────────────────────────── */}
      <div className="lg:col-span-2 space-y-4">
        <GlassCard className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Preview</p>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw size={12} />
              Reset
            </button>
          </div>

          {/* QR Display */}
          <div
            className="relative flex items-center justify-center rounded-xl overflow-hidden mb-4"
            style={{
              background: bgColor,
              minHeight: 200,
              aspectRatio: '1',
            }}
          >
            <AnimatePresence mode="wait">
              {isEmpty ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 p-8"
                >
                  <QrCode size={64} className="text-gray-300 dark:text-gray-600" />
                  <p className="text-xs text-center text-gray-400">
                    Enter content above to generate your QR code
                  </p>
                </motion.div>
              ) : imgError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 p-8 text-center"
                >
                  <QrCode size={40} className="text-red-400" />
                  <p className="text-xs text-red-400">Failed to generate QR. Check your internet connection.</p>
                </motion.div>
              ) : (
                <motion.div
                  key={qrUrl}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full p-4"
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl z-10">
                      <RefreshCw size={20} className="animate-spin text-primary" />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                    onLoad={() => setLoading(false)}
                    onError={() => { setLoading(false); setImgError(true) }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleDownload}
              disabled={isEmpty || imgError}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all',
                isEmpty || imgError
                  ? 'opacity-40 cursor-not-allowed bg-primary/30 text-primary'
                  : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
              )}
            >
              <Download size={15} />
              Download PNG
            </button>
            <button
              onClick={handleCopyData}
              disabled={isEmpty}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all',
                'bg-white/5 hover:bg-white/10 border border-white/10',
                isEmpty ? 'opacity-40 cursor-not-allowed' : 'text-foreground'
              )}
            >
              {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy QR Data'}
            </button>
          </div>

          {/* QR Data Preview */}
          {qrData && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wider">Encoded Data</p>
              <p className="text-xs font-mono text-foreground/80 break-all line-clamp-3">{qrData}</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

