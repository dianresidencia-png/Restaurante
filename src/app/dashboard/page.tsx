'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Aún cargando
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Redirigir según el rol del usuario
    switch (session.user?.role) {
      case 'SUPER_ADMIN':
        router.push('/admin/super')
        break
      case 'ADMIN_LOCAL':
        router.push('/admin')
        break
      case 'MESERO':
        router.push('/mesero')
        break
      case 'CHEF':
        router.push('/chef')
        break
      case 'SUPERVISOR':
        router.push('/supervisor')
        break
      case 'CLIENTE':
      default:
        router.push('/cliente')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo a tu dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">
          Rol detectado: {session?.user?.role || 'No autenticado'}
        </p>
      </div>
    </div>
  )
}