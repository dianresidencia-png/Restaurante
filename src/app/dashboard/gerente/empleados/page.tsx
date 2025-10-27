import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, Mail, Phone, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EmpleadosPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'GERENTE') redirect('/unauthorized')

  // Obtener el restaurante del gerente
  const restaurante = await prisma.restaurante.findFirst({
    where: {
      gerenteId: session.user.id
    }
  })

  if (!restaurante) {
    redirect('/unauthorized')
  }

  // Obtener empleados del restaurante
  const empleados = await prisma.user.findMany({
    where: {
      restauranteId: restaurante.id,
      role: {
        in: ['MESERO', 'CHEF', 'SUPERVISOR']
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      activo: true,
      createdAt: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPERVISOR': return 'bg-blue-100 text-blue-800'
      case 'CHEF': return 'bg-orange-100 text-orange-800'
      case 'MESERO': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const translateRole = (role: string) => {
    const roles: { [key: string]: string } = {
      'SUPERVISOR': 'Supervisor',
      'CHEF': 'Chef',
      'MESERO': 'Mesero'
    }
    return roles[role] || role
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
          
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <Users className="h-8 w-8 mr-3 text-blue-600" />
                Gestión de Empleados
              </h2>
              <p className="text-muted-foreground">
                Administra el personal de {restaurante.nombre}
              </p>
            </div>
          </div>
          <Button className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empleados.length}</div>
              <p className="text-xs text-muted-foreground">Personal activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meseros</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empleados.filter(e => e.role === 'MESERO').length}
              </div>
              <p className="text-xs text-muted-foreground">Servicio al cliente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chefs</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empleados.filter(e => e.role === 'CHEF').length}
              </div>
              <p className="text-xs text-muted-foreground">Personal de cocina</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empleados.filter(e => e.role === 'SUPERVISOR').length}
              </div>
              <p className="text-xs text-muted-foreground">Personal supervisor</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de empleados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Empleados</span>
              <span className="text-sm font-normal text-muted-foreground">
                {empleados.length} empleados
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empleados.map((empleado) => (
                <div key={empleado.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{empleado.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {empleado.email}
                      </div>
                      {empleado.phone && (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {empleado.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(empleado.role)}`}>
                      {translateRole(empleado.role)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Clock className="inline h-3 w-3 mr-1" />
                      Desde {new Date(empleado.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {empleados.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No hay empleados</h3>
                  <p className="text-muted-foreground mt-2">
                    Agrega el primer empleado a tu restaurante
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}