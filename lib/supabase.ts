/**
 * Supabase client — prepared for future features:
 *   - User favorites (saved tools)
 *   - Tool usage analytics
 *   - Shared calculation history
 *
 * Install when ready:  npm install @supabase/supabase-js
 *
 * Uncomment the code below once you add the package.
 */

// import { createClient } from '@supabase/supabase-js'
// import type { Database } from './database.types'

// export const supabase = createClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// ── Type stubs (generated later with: supabase gen types typescript) ──

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      tool_views: {
        Row: {
          id: number
          slug: string
          views: number
          updated_at: string
        }
        Insert: {
          slug: string
          views?: number
        }
        Update: {
          views?: number
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: number
          user_id: string
          tool_slug: string
          created_at: string
        }
        Insert: {
          user_id: string
          tool_slug: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

// ── Placeholder export so the file is importable ──────────────
export const supabase = null as unknown as {
  from: (table: string) => unknown
}
