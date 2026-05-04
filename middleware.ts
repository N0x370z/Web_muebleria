import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    // Protección de rutas de administrador
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Rutas que no requieren autenticación dentro de /cuenta
        if (pathname === '/cuenta/login' || pathname === '/cuenta/registro') {
          return true
        }

        // Requiere token para /cuenta y /admin
        if (pathname.startsWith('/cuenta') || pathname.startsWith('/admin')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/cuenta/:path*', '/admin/:path*'],
}
