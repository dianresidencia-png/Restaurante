"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ArrowLeft, UserPlus, Shield } from 'lucide-react'
import Link from 'next/link'
import { FiltrosUsuarios } from './components/FiltrosUsuarios'
import { UsuariosTable } from './components/UsuariosTable'

interface Usuario {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  activo: boolean
  createdAt: Date
  restaurante: {
    nombre: string
  } | null
}

interface UsuariosPageProps {
  searchParams: Promise<{
    rol?: string
    activo?: string
    restaurante?: string
    search?: string
  }>
}

export default function UsuariosPage({ searchParams }: UsuariosPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<any>({})

  // Cargar searchParams y datos
  useEffect(() => {
    const loadData = async () => {
      if (status === 'loading') return
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      if (session.user?.role !== 'SUPER_ADMIN') {
        router.push('/unauthorized')
        return
      }

      try {
        // Obtener searchParams
        const resolvedParams = await searchParams
        setParams(resolvedParams)

        // Construir query string para la API
        const queryParams = new URLSearchParams()
        if (resolvedParams.rol && resolvedParams.rol !== 'TODOS') queryParams.set('rol', resolvedParams.rol)
        if (resolvedParams.activo) queryParams.set('activo', resolvedParams.activo)
        if (resolvedParams.search) queryParams.set('search', resolvedParams.search)

        // Obtener usuarios desde la API
        const response = await fetch(`/api/users?${queryParams.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setUsuarios(data)
        } else {
          console.error('Error al cargar usuarios')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session, status, router, searchParams])

  // Estadísticas
  const totalUsuarios = usuarios.length
  const usuariosActivos = usuarios.filter(u => u.activo).length
  const gerentes = usuarios.filter(u => u.role === 'GERENTE').length
  const supervisores = usuarios.filter(u => u.role === 'SUPERVISOR').length
  const meseros = usuarios.filter(u => u.role === 'MESERO').length
  const chefs = usuarios.filter(u => u.role === 'CHEF').length
  const clientes = usuarios.filter(u => u.role === 'CLIENTE').length

  // Funciones para las acciones
  const handleEdit = (usuario: Usuario) => {
    console.log('Editar usuario:', usuario)
    // Aquí irá la lógica para editar
  }

  const handleToggleStatus = async (usuarioId: string, nuevoEstado: boolean) => {
    try {
      const response = await fetch(`/api/users/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado }),
      })

      if (response.ok) {
        // Actualizar el estado local
        setUsuarios(prev => 
          prev.map(usuario => 
            usuario.id === usuarioId 
              ? { ...usuario, activo: nuevoEstado }
              : usuario
          )
        )
      } else {
        console.error('Error al cambiar estado')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (usuarioId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${usuarioId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Actualizar el estado local
        setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioId))
      } else {
        console.error('Error al eliminar usuario')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header con navegación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
        
            <div className="h-6 w-px bg-border"></div>
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Gestión de Usuarios
              </h2>
              <p className="text-muted-foreground">
                Administra todos los usuarios del sistema
              </p>
            </div>
          </div>
          <button className="btn-restaurant flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FiltrosUsuarios searchParams={params} />
          </CardContent>
        </Card>


        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Usuarios</span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalUsuarios} usuario{totalUsuarios !== 1 ? 's' : ''} encontrado{totalUsuarios !== 1 ? 's' : ''}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UsuariosTable
              usuarios={usuarios}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}