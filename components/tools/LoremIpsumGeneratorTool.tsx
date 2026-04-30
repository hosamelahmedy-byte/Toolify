'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlignLeft, Copy, Check, RefreshCw, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn, copyToClipboard } from '@/lib/utils'

// ── Lorem Ipsum Word Bank ───────────────────────────────────

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
  'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
  'magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation',
  'ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis',
  'aute','irure','in','reprehenderit','voluptate','velit','esse','cillum',
  'fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non',
  'proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id',
  'est','laborum','curabitur','pretium','tincidunt','lacus','nec','gravida',
  'arcu','lectus','praesent','faucibus','arcu','eget','elementum','felis',
  'blandit','viverra','orci','sagittis','eu','volutpat','odio','facilisis',
  'mauris','sit','amet','massa','vitae','tortor','condimentum','lacinia',
  'proin','nibh','nisl','condimentum','id','venenatis','a','condimentum',
  'vitae','sapien','pellentesque','habitant','morbi','tristique','senectus',
  'netus','malesuada','fames','turpis','egestas','integer','eget','aliquet',
  'nibh','praesent','tristique','magna','sit','amet','purus','gravida',
  'quis','blandit','turpis','cursus','in','hac','habitasse','platea',
  'dictumst','quisque','sagittis','purus','sit','amet','volutpat','consequat',
  'mauris','nunc','congue','nisi','vitae','suscipit','tellus','mauris',
  'pharetra','vel','turpis','nunc','eget','lorem','dolor','sed','viverra',
]

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

function randomSentenceLength(): number {
  return Math.floor(Math.random() * 10) + 8 // 8-17 words
}

function generateSentence(): string {
  const len = randomSentenceLength()
  const words = Array.from({ length: len }, randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

function generateParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, generateSentence).join(' ')
}

// ── Output Format ────────────────────────────────────────────

type OutputType = 'paragraphs' | 'sentences' | 'words' | 'bytes'

interface GenerateOptions {
  type: OutputType
  count: number
  startWithLorem: boolean
  htmlWrapped: boolean
  sentencesPerParagraph: number
}

function generate(opts: GenerateOptions): string {
  const { type, count, startWithLorem, htmlWrapped, sentencesPerParagraph } = opts

  let result = ''

  if (type === 'paragraphs') {
    const paragraphs = Array.from({ length: count }, (_, i) => {
      let para = generateParagraph(sentencesPerParagraph)
      if (i === 0 && startWithLorem) {
        para = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + para
      }
      return htmlWrapped ? `<p>${para}</p>` : para
    })
    result = paragraphs.join(htmlWrapped ? '\n' : '\n\n')
  } else if (type === 'sentences') {
    const sentences = Array.from({ length: count }, (_, i) => {
      if (i === 0 && startWithLorem) return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      return generateSentence()
    })
    result = sentences.join(' ')
    if (htmlWrapped) result = `<p>${result}</p>`
  } else if (type === 'words') {
    const words = Array.from({ length: count }, (_, i) => {
      if (i === 0 && startWithLorem) return 'Lorem'
      if (i === 1 && startWithLorem) return 'ipsum'
      return randomWord()
    })
    result = words.join(' ')
    if (htmlWrapped) result = `<p>${result}</p>`
  } else if (type === 'bytes') {
    // Generate approx N bytes
    let out = ''
    while (out.length < count) {
      out += generateParagraph(sentencesPerParagraph) + '\n\n'
    }
    result = out.slice(0, count)
    if (htmlWrapped) result = `<p>${result}</p>`
  }

  return result
}

// ── Component ────────────────────────────────────────────────

const TYPE_OPTIONS: { id: OutputType; label: string; unit: string; min: number; max: number; default: number; step: number }[] = [
  { id: 'paragraphs', label: 'Paragraphs', unit: 'paragraphs', min: 1, max: 20, default: 3, step: 1 },
  { id: 'sentences',  label: 'Sentences',  unit: 'sentences',  min: 1, max: 50, default: 5, step: 1 },
  { id: 'words',      label: 'Words',      unit: 'words',      min: 10, max: 500, default: 50, step: 10 },
  { id: 'bytes',      label: 'Bytes',      unit: 'bytes',      min: 100, max: 5000, default: 500, step: 100 },
]

export function LoremIpsumGeneratorTool() {
  const [type, setType] = useState<OutputType>('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [htmlWrapped, setHtmlWrapped] = useState(false)
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(4)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState(false)

  const typeOpt = TYPE_OPTIONS.find((t) => t.id === type)!

  const handleGenerate = useCallback(() => {
    const result = generate({ type, count, startWithLorem, htmlWrapped, sentencesPerParagraph })
    setOutput(result)
    setGenerated(true)
  }, [type, count, startWithLorem, htmlWrapped, sentencesPerParagraph])

  const handleTypeChange = (newType: OutputType) => {
    const opt = TYPE_OPTIONS.find((t) => t.id === newType)!
    setType(newType)
    setCount(opt.default)
    setOutput('')
    setGenerated(false)
  }

  const handleCopy = async () => {
    await copyToClipboard(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = output.trim() === '' ? 0 : output.trim().split(/\s+/).length
  const charCount = output.length

  return (
    <div className="space-y-5">

      {/* Controls */}
      <GlassCard>
        <p className="text-sm font-medium text-muted-foreground mb-4">Generator Options</p>

        {/* Type Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleTypeChange(opt.id)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                type === opt.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Count Slider */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Number of {typeOpt.unit}
            </label>
            <span className="text-xs font-mono text-foreground">{count} {typeOpt.unit}</span>
          </div>
          <input
            type="range"
            min={typeOpt.min}
            max={typeOpt.max}
            step={typeOpt.step}
            value={count}
            onChange={(e) => { setCount(Number(e.target.value)); setGenerated(false) }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{typeOpt.min}</span>
            <span>{typeOpt.max}</span>
          </div>
        </div>

        {/* Sentences per paragraph (only for paragraphs mode) */}
        {type === 'paragraphs' && (
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sentences per paragraph</label>
              <span className="text-xs font-mono text-foreground">{sentencesPerParagraph}</span>
            </div>
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={sentencesPerParagraph}
              onChange={(e) => { setSentencesPerParagraph(Number(e.target.value)); setGenerated(false) }}
              className="w-full accent-primary"
            />
          </div>
        )}

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => { setStartWithLorem((v) => !v); setGenerated(false) }}
              className={cn(
                'w-9 h-5 rounded-full relative transition-colors',
                startWithLorem ? 'bg-primary' : 'bg-white/20'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                startWithLorem ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </div>
            <span className="text-sm text-muted-foreground">Start with &ldquo;Lorem ipsum&rdquo;</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => { setHtmlWrapped((v) => !v); setGenerated(false) }}
              className={cn(
                'w-9 h-5 rounded-full relative transition-colors',
                htmlWrapped ? 'bg-primary' : 'bg-white/20'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                htmlWrapped ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </div>
            <span className="text-sm text-muted-foreground">Wrap in HTML &lt;p&gt; tags</span>
          </label>
        </div>
      </GlassCard>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
      >
        <AlignLeft size={16} />
        Generate Lorem Ipsum
      </button>

      {/* Output */}
      {generated && output && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{charCount.toLocaleString()} chars</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw size={12} />
                  Regenerate
                </button>
                <button
                  onClick={() => { setOutput(''); setGenerated(false) }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-all"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono text-xs max-h-96 overflow-y-auto">
              {output}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

