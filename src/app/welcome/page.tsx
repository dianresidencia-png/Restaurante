'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 ¡Bienvenido, {session.user?.name}!
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Información de tu cuenta</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div>
              <p><strong>Nombre:</strong> {session.user?.name || 'No especificado'}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Rol:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{session.user?.role}</span></p>
            </div>
            <div>
              <p><strong>ID:</strong> {session.user?.id}</p>
              <p><strong>Autenticado:</strong> ✅ Sí</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Estado del sistema</h3>
          <p className="text-yellow-700">
            ✅ Autenticación funcionando correctamente<br/>
            ⚠️ Los dashboards específicos por rol están en desarrollo
          </p>
        </div>

        <div className="space-x-4">
          <Button onClick={() => router.push('/auth/login')}>
            Volver al Login
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Ir al Inicio
          </Button>
          <Button variant="outline" onClick={() => {
            fetch('/api/auth/signout', { method: 'POST' })
              .then(() => router.push('/auth/login'))
          }}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}