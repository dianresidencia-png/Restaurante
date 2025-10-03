'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }

    const rolePath = getDashboardPath(session.user?.role)
    router.push(`/${rolePath}`)
  }, [session, status, router])

  function getDashboardPath(role?: string) {
    switch (role) {
      case 'CLIENTE': return 'cliente'
      case 'MESERO': return 'mesero'
      case 'CHEF': return 'chef'
      case 'SUPERVISOR': return 'supervisor'
      case 'ADMIN_LOCAL': return 'admin-local'
      case 'SUPER_ADMIN': return 'Super-admin'
      default: return 'cliente'
    }
  }

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
