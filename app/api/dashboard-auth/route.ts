import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>
  const secret = process.env.DASHBOARD_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  let authenticated = false

  // Password auth
  if (body.password && body.password === secret) {
    authenticated = true
  }

  // Biometric auth — WebAuthn verification done client-side
  if (body.biometric === true) {
    authenticated = true
  }

  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Set secure HTTP-only session cookie (24 hours)
  const response = NextResponse.json({ success: true })
  response.cookies.set('dashboard_session', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return response
}

