import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) { // 👈 NextRequest, não Request
  
  // Pega a sessão via cookie diretamente (sem chamar auth.api)
  const sessionCookie = request.cookies.get('better-auth.session_token')?.value

  if (!sessionCookie) {
    // Não está logado — redireciona para login
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/inicio', '/configuracoes', '/completar-perfil'],
}