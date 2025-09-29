import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Bỏ qua API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const userCookie = request.cookies.get('user')?.value
  
  if (!userCookie) {
    return NextResponse.next()
  }

  try {
    const userData = JSON.parse(userCookie)
    
    if (userData.requiresEmailVerification && !userData.emailVerified) {
      if (!request.nextUrl.pathname.startsWith('/verify-email')) {
        return NextResponse.redirect(new URL('/verify-email', request.url))
      }
    }
  } catch (error) {
    // Nếu parse cookie lỗi, tiếp tục bình thường
    console.error('Error parsing user cookie in middleware:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}