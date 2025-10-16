'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { navigationByRole, type UserRole } from '@/config/navigation/index'

interface RoleRedirectProps {
  allowedRoles: string[]
  children: React.ReactNode
}

export function RoleRedirect({ allowedRoles, children }: RoleRedirectProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    const userRole = session.user?.role as UserRole
    if (userRole && !allowedRoles.includes(userRole)) {
      // Buscar la primera ruta de navegación para el rol del usuario
      const userNavigation = navigationByRole[userRole]
      const dashboardRoute = userNavigation?.[0]?.href || '/dashboard'
      router.push(dashboardRoute)
    }
  }, [session, status, allowedRoles, router])

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-full">Cargando...</div>
  }

  if (!session || !session.user?.role || !allowedRoles.includes(session.user.role)) {
    return <div className="flex items-center justify-center h-full">Redirigiendo...</div>
  }

  return <>{children}</>
}