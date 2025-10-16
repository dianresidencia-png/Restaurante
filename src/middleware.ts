import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Mapa de rutas y roles permitidos
const roleRoutes: Record<string, string[]> = {
  '/dashboard/super-admin': ['SUPER_ADMIN'],
  '/dashboard/gerente': ['GERENTE', 'SUPER_ADMIN'],
  '/dashboard/supervisor': ['SUPERVISOR', 'GERENTE', 'SUPER_ADMIN'],
  '/dashboard/mesero': ['MESERO', 'SUPERVISOR', 'GERENTE', 'SUPER_ADMIN'],
  '/dashboard/chef': ['CHEF', 'SUPERVISOR', 'GERENTE', 'SUPER_ADMIN'],
  '/dashboard/cliente': ['CLIENTE']
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Verificar si la ruta está protegida por rol
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        if (!token?.role || !allowedRoles.includes(token.role)) {
          // Redirigir al dashboard correspondiente
          const correctDashboard = '/dashboard/cliente' // Por defecto
          return NextResponse.redirect(new URL(correctDashboard, req.url))
        }
        break
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*"
  ]
}