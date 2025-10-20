
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, ArrowLeft, Mail, Building2 } from 'lucide-react'
import Link from 'next/link'

export default async function AdministradoresPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  const administradores = await prisma.user.findMany({
    where: {
      activo: true,
      role: {
        in: ['GERENTE', 'SUPERVISOR']
      }
    },
    include: {
      restaurante: {
        select: {
          nombre: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  const totalAdministradores = administradores.length
  const gerentes = administradores.filter(a => a.role === 'GERENTE').length
  const supervisores = administradores.filter(a => a.role === 'SUPERVISOR').length

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
                Gestión de Administradores
              </h2>
              <p className="text-muted-foreground">
                Administra gerentes y supervisores del sistema
              </p>
            </div>
          </div>
          <button className="btn-restaurant flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Administrador
          </button>
        </div>

        {/* Métricas rápidas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Administradores</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalAdministradores}</div>
              <p className="text-xs text-muted-foreground">
                Activos en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
              <Building2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{gerentes}</div>
              <p className="text-xs text-muted-foreground">
                Gestionando restaurantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">{supervisores}</div>
              <p className="text-xs text-muted-foreground">
                Supervisando operaciones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de administradores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Administradores</span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalAdministradores} administradores
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {administradores.length > 0 ? (
              <div className="space-y-4">
                {administradores.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{admin.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {admin.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="badge-role badge-admin-local capitalize">
                        {admin.role.toLowerCase()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {admin.restaurante?.nombre || 'Sin restaurante asignado'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No hay administradores</h3>
                <p className="text-muted-foreground mt-2">
                  Crea el primer administrador del sistema
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}