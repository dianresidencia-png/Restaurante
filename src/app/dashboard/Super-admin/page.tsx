import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, ChefHat, ClipboardList, DollarSign, TrendingUp } from 'lucide-react'
import { AdminRestaurantsTable } from '@/app/dashboard/Super-admin/components/AdminRestaurantsTable'
import { CreateRestaurantDialog } from '@/app/dashboard/Super-admin/components/CreateRestaurantDialog'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  // Obtener datos reales de la base de datos
  const [
    restaurantes,
    usuarios,
    pedidosHoy,
    metricas
  ] = await Promise.all([
    // 1. Restaurantes con conteos
    prisma.restaurante.findMany({
      include: {
        _count: {
          select: {
            usuarios: true,
            pedidos: {
              where: {
                createdAt: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
              }
            }
          }
        },
        gerente: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

    // 2. Total de usuarios
    prisma.user.count({
      where: { activo: true }
    }),

    // 3. Pedidos de hoy
    prisma.pedido.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),

    // 4. Métricas financieras
    prisma.pedido.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        },
        estado: 'COMPLETADO'
      },
      _sum: {
        total: true
      },
      _avg: {
        total: true
      }
    })
  ])

  const totalRestaurantes = restaurantes.length
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
              Gestión centralizada de todos los restaurantes
            </p>
          </div>
          <CreateRestaurantDialog />
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurantes Activos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRestaurantes}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios}</div>
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
              <div className="text-2xl font-bold">{pedidosHoy}</div>
              <p className="text-xs text-muted-foreground">
                +12% respecto a ayer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos (30 días)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ingresosUltimoMes.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Ticket promedio: ${ticketPromedio.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Restaurantes</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminRestaurantsTable restaurantes={restaurantes} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}