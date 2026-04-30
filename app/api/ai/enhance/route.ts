import { NextRequest, NextResponse } from 'next/server'

// ── Rate limiting (simple in-memory, per deployment) ──────
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 10      // max requests
const RATE_WINDOW = 60_000 // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── POST /api/ai/enhance ──────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  // 2. Parse body
  let text: string
  let mode: string
  try {
    const body = await req.json() as Record<string, string>
    text = (body.text ?? '').trim()
    mode = body.mode ?? 'enhance'
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!text) {
    return NextResponse.json({ error: 'Text is required.' }, { status: 400 })
  }
  if (text.length > 3000) {
    return NextResponse.json(
      { error: 'Text is too long. Maximum 3000 characters.' },
      { status: 400 }
    )
  }

  // 3. Build prompt based on mode
  const prompts: Record<string, string> = {
    enhance:
      'Fix all grammar mistakes, improve sentence flow, and make the text more professional and clear. Keep the original meaning. Return ONLY the improved text, no explanations.',
    simplify:
      'Rewrite this text in simple, easy-to-understand language. Use short sentences and common words. Return ONLY the rewritten text, no explanations.',
    formal:
      'Rewrite this text in a formal, professional tone suitable for business communication. Return ONLY the rewritten text, no explanations.',
    concise:
      'Rewrite this text to be shorter and more concise. Remove redundancy, keep all key points. Return ONLY the rewritten text, no explanations.',
  }

  const systemPrompt = prompts[mode] ?? prompts.enhance

  // 4. Call Groq API
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured. Please contact support.' },
      { status: 500 }
    )
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}))
      console.error('Groq error:', err)
      return NextResponse.json(
        { error: 'AI service error. Please try again.' },
        { status: 502 }
      )
    }

    const data = await groqRes.json() as { choices?: { message?: { content?: string } }[] }
    const result = data.choices?.[0]?.message?.content?.trim()

    if (!result) {
      return NextResponse.json({ error: 'Empty response from AI.' }, { status: 502 })
    }

    return NextResponse.json({ result })
  } catch (err) {
    console.error('Fetch error:', err)
    return NextResponse.json(
      { error: 'Network error. Please try again.' },
      { status: 500 }
    )
  }
}
