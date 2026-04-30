'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, ArrowLeftRight, Search } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { CopyButton } from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

// ── Unit Definitions ───────────────────────────────────────

type Category = { label: string; emoji: string; units: { key: string; label: string; toBase: number; symbol: string }[] }

const CATEGORIES: Record<string, Category> = {
  length: {
    label: 'Length', emoji: '📏',
    units: [
      { key: 'mm',    label: 'Millimeter',    toBase: 0.001,      symbol: 'mm' },
      { key: 'cm',    label: 'Centimeter',    toBase: 0.01,       symbol: 'cm' },
      { key: 'm',     label: 'Meter',         toBase: 1,          symbol: 'm' },
      { key: 'km',    label: 'Kilometer',     toBase: 1000,       symbol: 'km' },
      { key: 'in',    label: 'Inch',          toBase: 0.0254,     symbol: 'in' },
      { key: 'ft',    label: 'Foot',          toBase: 0.3048,     symbol: 'ft' },
      { key: 'yd',    label: 'Yard',          toBase: 0.9144,     symbol: 'yd' },
      { key: 'mi',    label: 'Mile',          toBase: 1609.344,   symbol: 'mi' },
      { key: 'nmi',   label: 'Nautical Mile', toBase: 1852,       symbol: 'nmi' },
      { key: 'ly',    label: 'Light Year',    toBase: 9.461e15,   symbol: 'ly' },
    ],
  },
  weight: {
    label: 'Weight / Mass', emoji: '⚖️',
    units: [
      { key: 'mg',    label: 'Milligram',  toBase: 0.000001,     symbol: 'mg' },
      { key: 'g',     label: 'Gram',       toBase: 0.001,        symbol: 'g' },
      { key: 'kg',    label: 'Kilogram',   toBase: 1,            symbol: 'kg' },
      { key: 't',     label: 'Metric Ton', toBase: 1000,         symbol: 't' },
      { key: 'oz',    label: 'Ounce',      toBase: 0.0283495,    symbol: 'oz' },
      { key: 'lb',    label: 'Pound',      toBase: 0.453592,     symbol: 'lb' },
      { key: 'st',    label: 'Stone',      toBase: 6.35029,      symbol: 'st' },
      { key: 'ton',   label: 'Short Ton',  toBase: 907.185,      symbol: 'ton' },
    ],
  },
  temperature: {
    label: 'Temperature', emoji: '🌡️',
    units: [
      { key: 'c',  label: 'Celsius',    toBase: 1, symbol: '°C' },
      { key: 'f',  label: 'Fahrenheit', toBase: 1, symbol: '°F' },
      { key: 'k',  label: 'Kelvin',     toBase: 1, symbol: 'K' },
      { key: 'r',  label: 'Rankine',    toBase: 1, symbol: '°R' },
    ],
  },
  volume: {
    label: 'Volume', emoji: '🧪',
    units: [
      { key: 'ml',   label: 'Milliliter', toBase: 0.001,       symbol: 'mL' },
      { key: 'l',    label: 'Liter',      toBase: 1,           symbol: 'L' },
      { key: 'm3',   label: 'Cubic Meter',toBase: 1000,        symbol: 'm³' },
      { key: 'tsp',  label: 'Teaspoon',   toBase: 0.00492892,  symbol: 'tsp' },
      { key: 'tbsp', label: 'Tablespoon', toBase: 0.0147868,   symbol: 'tbsp' },
      { key: 'cup',  label: 'Cup',        toBase: 0.236588,    symbol: 'cup' },
      { key: 'pt',   label: 'Pint',       toBase: 0.473176,    symbol: 'pt' },
      { key: 'qt',   label: 'Quart',      toBase: 0.946353,    symbol: 'qt' },
      { key: 'gal',  label: 'Gallon (US)',toBase: 3.78541,     symbol: 'gal' },
      { key: 'floz', label: 'Fl Ounce',   toBase: 0.0295735,   symbol: 'fl oz' },
    ],
  },
  area: {
    label: 'Area', emoji: '📐',
    units: [
      { key: 'mm2', label: 'mm²',           toBase: 0.000001,   symbol: 'mm²' },
      { key: 'cm2', label: 'cm²',           toBase: 0.0001,     symbol: 'cm²' },
      { key: 'm2',  label: 'Meter²',        toBase: 1,          symbol: 'm²' },
      { key: 'km2', label: 'Kilometer²',    toBase: 1e6,        symbol: 'km²' },
      { key: 'ha',  label: 'Hectare',       toBase: 10000,      symbol: 'ha' },
      { key: 'ac',  label: 'Acre',          toBase: 4046.86,    symbol: 'ac' },
      { key: 'ft2', label: 'Foot²',         toBase: 0.0929,     symbol: 'ft²' },
      { key: 'mi2', label: 'Mile²',         toBase: 2.59e6,     symbol: 'mi²' },
    ],
  },
  speed: {
    label: 'Speed', emoji: '🚀',
    units: [
      { key: 'mps',  label: 'm/s',         toBase: 1,          symbol: 'm/s' },
      { key: 'kph',  label: 'km/h',        toBase: 0.277778,   symbol: 'km/h' },
      { key: 'mph',  label: 'mph',         toBase: 0.44704,    symbol: 'mph' },
      { key: 'knot', label: 'Knot',        toBase: 0.514444,   symbol: 'kn' },
      { key: 'fps',  label: 'ft/s',        toBase: 0.3048,     symbol: 'ft/s' },
      { key: 'mach', label: 'Mach',        toBase: 343,        symbol: 'Mach' },
      { key: 'c',    label: 'Speed of Light', toBase: 299792458, symbol: 'c' },
    ],
  },
  data: {
    label: 'Digital Storage', emoji: '💾',
    units: [
      { key: 'bit',  label: 'Bit',       toBase: 1,             symbol: 'bit' },
      { key: 'B',    label: 'Byte',      toBase: 8,             symbol: 'B' },
      { key: 'KB',   label: 'Kilobyte',  toBase: 8192,          symbol: 'KB' },
      { key: 'MB',   label: 'Megabyte',  toBase: 8388608,       symbol: 'MB' },
      { key: 'GB',   label: 'Gigabyte',  toBase: 8589934592,    symbol: 'GB' },
      { key: 'TB',   label: 'Terabyte',  toBase: 8796093022208, symbol: 'TB' },
      { key: 'Kib',  label: 'Kibibyte',  toBase: 8192,          symbol: 'KiB' },
      { key: 'Mib',  label: 'Mebibyte',  toBase: 8388608,       symbol: 'MiB' },
    ],
  },
}

// Temperature special case
function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number
  switch (from) {
    case 'c': celsius = value; break
    case 'f': celsius = (value - 32) * 5 / 9; break
    case 'k': celsius = value - 273.15; break
    case 'r': celsius = (value - 491.67) * 5 / 9; break
    default:  celsius = value
  }
  switch (to) {
    case 'c': return celsius
    case 'f': return celsius * 9 / 5 + 32
    case 'k': return celsius + 273.15
    case 'r': return (celsius + 273.15) * 9 / 5
    default:  return celsius
  }
}

function convert(value: number, from: string, to: string, catKey: string): number {
  if (catKey === 'temperature') return convertTemperature(value, from, to)
  const cat = CATEGORIES[catKey]
  if (!cat) return 0
  const fromUnit = cat.units.find(u => u.key === from)
  const toUnit = cat.units.find(u => u.key === to)
  if (!fromUnit || !toUnit) return 0
  return (value * fromUnit.toBase) / toUnit.toBase
}

function formatResult(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—'
  if (Math.abs(n) >= 1e12) return n.toExponential(4)
  if (Math.abs(n) >= 1000) return n.toLocaleString('en', { maximumFractionDigits: 4 })
  if (Math.abs(n) >= 0.001) return String(parseFloat(n.toFixed(6)))
  if (n === 0) return '0'
  return n.toExponential(4)
}

// ── Component ──────────────────────────────────────────────

export function UnitConverterTool() {
  const [catKey, setCatKey] = useState('length')
  const [input, setInput] = useState('1')
  const [fromUnit, setFromUnit] = useState('m')
  const [search, setSearch] = useState('')

  const cat = CATEGORIES[catKey]

  // Reset units when category changes
  const setCategory = (k: string) => {
    setCatKey(k)
    setFromUnit(CATEGORIES[k].units[0].key)
    setSearch('')
  }

  // All conversions from current input
  const results = useMemo(() => {
    const val = parseFloat(input)
    if (isNaN(val)) return []
    return cat.units
      .filter(u => u.key !== fromUnit)
      .filter(u => !search || u.label.toLowerCase().includes(search.toLowerCase()) || u.symbol.toLowerCase().includes(search.toLowerCase()))
      .map(u => ({
        ...u,
        result: convert(val, fromUnit, u.key, catKey),
      }))
  }, [input, fromUnit, catKey, search, cat])

  const fromUnitObj = cat.units.find(u => u.key === fromUnit)

  return (
    <div className="space-y-5">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => setCategory(k)}
            className={cn('flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
              catKey === k
                ? 'bg-primary text-primary-foreground shadow-glow-brand'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}>
            <span>{v.emoji}</span> {v.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <GlassCard hover={false}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">Value</label>
            <input type="number" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Enter value…"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-semibold"
            />
          </div>
          <div className="w-full sm:w-56">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">From Unit</label>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm">
              {cat.units.map(u => (
                <option key={u.key} value={u.key}>{u.label} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>
        {input && fromUnitObj && (
          <div className="mt-3 text-sm text-muted-foreground">
            Converting <span className="font-semibold text-foreground">{input} {fromUnitObj.symbol}</span> to all other {cat.label.toLowerCase()} units
          </div>
        )}
      </GlassCard>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Filter units…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-card text-sm focus:border-primary focus:outline-none transition-all"
        />
      </div>

      {/* Results grid */}
      <AnimatePresence>
        {results.length > 0 && parseFloat(input) !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {results.map(u => (
              <motion.div key={u.key} layout
                className="flex items-center justify-between p-4 rounded-xl glass-card hover:border-primary/30 transition-all group"
              >
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">{u.label}</div>
                  <div className="text-xl font-bold font-display text-primary">
                    {formatResult(u.result)}
                    <span className="text-sm font-normal text-muted-foreground ml-1.5">{u.symbol}</span>
                  </div>
                </div>
                <CopyButton
                  text={`${formatResult(u.result)} ${u.symbol}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

