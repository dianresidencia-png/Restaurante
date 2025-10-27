import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, DollarSign, Users, Package, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ReportesPage() {
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

  // Obtener datos para reportes
  const ventasSemana = await prisma.pedido.aggregate({
    where: {
      restauranteId: restaurante.id,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      estado: { in: ['COMPLETADO', 'ENTREGADO'] }
    },
    _sum: {
      total: true
    },
    _count: {
      id: true
    }
  })

  const pedidosPorEstado = await prisma.pedido.groupBy({
    by: ['estado'],
    _count: {
      id: true
    },
    where: {
      restauranteId: restaurante.id,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  })

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
          
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
                Reportes del Restaurante
              </h2>
              <p className="text-muted-foreground">
                Métricas y análisis de {restaurante.nombre}
              </p>
            </div>
          </div>
          <Button className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Semanales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${ventasSemana._sum.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {ventasSemana._count.id} pedidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pedidosPorEstado.find(p => p.estado === 'EN_PREPARACION')?._count.id || 0}
              </div>
              <p className="text-xs text-muted-foreground">En preparación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96.5%</div>
              <p className="text-xs text-muted-foreground">Éxito en pedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Satisfechos</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">Rating promedio</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pedidos por estado */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Estado (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pedidosPorEstado.map((pedido) => (
                  <div key={pedido.estado} className="flex justify-between items-center">
                    <span className="text-sm capitalize">
                      {pedido.estado.toLowerCase().replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{pedido._count.id}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reportes disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Reporte de Ventas Diarias</div>
                  <div className="text-sm text-muted-foreground">Ingresos y pedidos del día</div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Rendimiento de Empleados</div>
                  <div className="text-sm text-muted-foreground">Métricas del personal</div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Productos Más Vendidos</div>
                  <div className="text-sm text-muted-foreground">Análisis de platillos</div>
                </button>
                <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Horarios Pico</div>
                  <div className="text-sm text-muted-foreground">Análisis de demanda</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}