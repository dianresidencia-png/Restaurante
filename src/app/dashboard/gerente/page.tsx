import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Utensils, DollarSign, Clock, TrendingUp, Package } from 'lucide-react'

export default async function GerenteDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'GERENTE') redirect('/unauthorized')

  // Obtener el restaurante del gerente
  const restaurante = await prisma.restaurante.findFirst({
    where: {
      gerenteId: session.user.id
    },
    include: {
      _count: {
        select: {
          usuarios: {
            where: { activo: true }
          },
          menus: {
            where: { activo: true }
          },
          pedidos: {
            where: {
              createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
              }
            }
          }
        }
      }
    }
  })

  if (!restaurante) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No tienes un restaurante asignado</h2>
          <p className="text-muted-foreground">Contacta al administrador del sistema.</p>
        </div>
      </div>
    )
  }

  // Obtener estadísticas del día
  const pedidosHoy = await prisma.pedido.aggregate({
    where: {
      restauranteId: restaurante.id,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    },
    _sum: {
      total: true
    },
    _count: {
      id: true
    }
  })

  const cards = [
    {
      title: "Empleados Activos",
      value: restaurante._count.usuarios,
      description: "Total en tu restaurante",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Menús Disponibles",
      value: restaurante._count.menus,
      description: "Menús activos",
      icon: Utensils,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pedidos Hoy",
      value: restaurante._count.pedidos,
      description: "Total de pedidos",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Ingresos Hoy",
      value: `$${pedidosHoy._sum.total || 0}`,
      description: "Ventas del día",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  // Pedidos recientes
  const pedidosRecientes = await prisma.pedido.findMany({
    where: {
      restauranteId: restaurante.id,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
      }
    },
    include: {
      cliente: {
        select: { name: true }
      },
      mesa: {
        select: { numero: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  })

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mt-2">
              {restaurante.nombre} - Gestión operativa
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Estado</div>
            <button className="text-lg font-semibold  text-green-600 ">Abierto</button>
          </div>
        </div>

        {/* Métricas rápidas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pedidos recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pedidos Recientes (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedidosRecientes.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {pedido.cliente?.name || 'Cliente'} 
                        {pedido.mesa && ` - Mesa ${pedido.mesa.numero}`}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {pedido.estado.toLowerCase().replace('_', ' ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${pedido.total}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(pedido.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {pedidosRecientes.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No hay pedidos recientes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}