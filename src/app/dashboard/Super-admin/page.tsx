import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, ClipboardList, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  // Obtener datos para las métricas
  const [
    totalRestaurantes,
    totalUsuarios,
    pedidosHoy,
    metricas
  ] = await Promise.all([
    prisma.restaurante.count({ where: { activo: true } }),
    prisma.user.count({ where: { activo: true } }),
    prisma.pedido.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.pedido.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        },
        estado: 'COMPLETADO'
      },
      _sum: { total: true },
      _avg: { total: true }
    })
  ])

  const ingresosUltimoMes = metricas._sum.total || 0
  const ticketPromedio = metricas._avg.total || 0

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Panel de Administración</h2>
            <p className="text-muted-foreground">
              Vista general del sistema
            </p>
          </div>
        </div>

        {/* Métricas con enlaces */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Card de Restaurantes - Clickable */}
          <Link href="/dashboard/super-admin/restaurantes">
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-orange-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Restaurantes Activos</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-orange-600">{totalRestaurantes}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Gestionar restaurantes
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Otras métricas (no clickeables por ahora) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">
                Empleados y clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{pedidosHoy}</div>
              <p className="text-xs text-muted-foreground">
                Pedidos del día de hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos (30 días)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${ingresosUltimoMes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Ticket promedio: ${ticketPromedio.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de acciones rápidas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Link href="/dashboard/super-admin/restaurantes">
            <Card className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-orange-300 transition-all group">
              <CardContent className="p-6 text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 group-hover:text-orange-500 mb-4" />
                <h3 className="font-semibold group-hover:text-orange-600">Gestionar Restaurantes</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Ver, crear y administrar todos los restaurantes
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Puedes agregar más acciones aquí */}
          <Card className="border-2 border-dashed border-gray-300 opacity-50">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-semibold">Gestionar Usuarios</h3>
              <p className="text-sm text-muted-foreground mt-2">
                
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 opacity-50">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-semibold">Reportes</h3>
              <p className="text-sm text-muted-foreground mt-2">
               
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}