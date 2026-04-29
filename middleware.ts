import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /dashboard
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Check session cookie
  const session = request.cookies.get('dashboard_session')?.value
  if (session === process.env.DASHBOARD_SECRET) {
    return NextResponse.next()
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/dashboard-login', request.url))
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
