/**
 * Toolify Global State Store
 * ─────────────────────────────────────────────
 * Handles:
 *   - Recent Tools (last 8 used)
 *   - Favorites (pinned tools)
 *   - Auto-save per-tool inputs
 *
 * Pure React Context + LocalStorage — no external dependencies.
 */

'use client'

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'

// ── Types ──────────────────────────────────────────────────

export interface RecentTool {
  slug: string
  name: string
  usedAt: number // timestamp
}

export interface ToolifyState {
  recentTools: RecentTool[]
  favorites: string[]          // slugs
  savedInputs: Record<string, Record<string, string>> // slug → { fieldKey → value }
}

type Action =
  | { type: 'USE_TOOL'; slug: string; name: string }
  | { type: 'TOGGLE_FAVORITE'; slug: string }
  | { type: 'SAVE_INPUT'; slug: string; key: string; value: string }
  | { type: 'CLEAR_SAVED_INPUTS'; slug: string }
  | { type: 'HYDRATE'; state: ToolifyState }

// ── Constants ──────────────────────────────────────────────

const STORAGE_KEY = 'toolify:state:v1'
const MAX_RECENT = 8

// ── Initial State ──────────────────────────────────────────

const INITIAL_STATE: ToolifyState = {
  recentTools: [],
  favorites: [],
  savedInputs: {},
}

// ── Reducer ────────────────────────────────────────────────

function reducer(state: ToolifyState, action: Action): ToolifyState {
  switch (action.type) {

    case 'HYDRATE':
      return action.state

    case 'USE_TOOL': {
      const now = Date.now()
      const existing = state.recentTools.filter(t => t.slug !== action.slug)
      const updated = [
        { slug: action.slug, name: action.name, usedAt: now },
        ...existing,
      ].slice(0, MAX_RECENT)
      return { ...state, recentTools: updated }
    }

    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites.includes(action.slug)
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(s => s !== action.slug)
          : [action.slug, ...state.favorites],
      }
    }

    case 'SAVE_INPUT': {
      return {
        ...state,
        savedInputs: {
          ...state.savedInputs,
          [action.slug]: {
            ...(state.savedInputs[action.slug] || {}),
            [action.key]: action.value,
          },
        },
      }
    }

    case 'CLEAR_SAVED_INPUTS': {
      const { [action.slug]: _, ...rest } = state.savedInputs
      return { ...state, savedInputs: rest }
    }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────

interface ToolifyContextValue {
  state: ToolifyState
  useTool: (slug: string, name: string) => void
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  saveInput: (slug: string, key: string, value: string) => void
  getSavedInput: (slug: string, key: string) => string
  clearSavedInputs: (slug: string) => void
}

const ToolifyContext = createContext<ToolifyContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────

export function ToolifyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  // Hydrate from LocalStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ToolifyState
        dispatch({ type: 'HYDRATE', state: parsed })
      }
    } catch {
      // Silent fail — corrupted storage
    }
  }, [])

  // Persist to LocalStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Silent fail — storage full or unavailable
    }
  }, [state])

  const useTool = useCallback((slug: string, name: string) => {
    dispatch({ type: 'USE_TOOL', slug, name })
  }, [])

  const toggleFavorite = useCallback((slug: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', slug })
  }, [])

  const isFavorite = useCallback(
    (slug: string) => state.favorites.includes(slug),
    [state.favorites]
  )

  const saveInput = useCallback((slug: string, key: string, value: string) => {
    dispatch({ type: 'SAVE_INPUT', slug, key, value })
  }, [])

  const getSavedInput = useCallback(
    (slug: string, key: string) => state.savedInputs[slug]?.[key] ?? '',
    [state.savedInputs]
  )

  const clearSavedInputs = useCallback((slug: string) => {
    dispatch({ type: 'CLEAR_SAVED_INPUTS', slug })
  }, [])

  return (
    <ToolifyContext.Provider
      value={{
        state,
        useTool,
        toggleFavorite,
        isFavorite,
        saveInput,
        getSavedInput,
        clearSavedInputs,
      }}
    >
      {children}
    </ToolifyContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────

export function useToolify() {
  const ctx = useContext(ToolifyContext)
  if (!ctx) throw new Error('useToolify must be used within <ToolifyProvider>')
  return ctx
}

/**
 * Auto-save hook for a specific tool input field.
 *
 * Usage:
 *   const [text, setText] = useAutoSave('word-counter', 'input', '')
 *   <textarea value={text} onChange={e => setText(e.target.value)} />
 */
export function useAutoSave(
  slug: string,
  key: string,
  defaultValue: string = ''
): [string, (v: string) => void] {
  const { getSavedInput, saveInput } = useToolify()

  const saved = getSavedInput(slug, key)
  const value = saved !== '' ? saved : defaultValue

  const setValue = useCallback(
    (v: string) => {
      saveInput(slug, key, v)
    },
    [slug, key, saveInput]
  )

  return [value, setValue]
}
