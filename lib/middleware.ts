import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) { 
  
  const sessionCookie = request.cookies.get('better-auth.session_token')?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/inicio', '/feed', '/perfil', 'produtos/[id]'],
}