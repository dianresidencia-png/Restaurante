
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, DollarSign, Package, Calendar, Download, Filter, Utensils } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ReportesPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  // Obtener datos para reportes
  const [
    ventasMensuales,
    pedidosPorEstado,
    usuariosPorRol,
    restaurantesTop,
    productosPopulares
  ] = await Promise.all([
    // Ventas de los últimos 6 meses
    prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as mes,
        COUNT(*) as total_pedidos,
        SUM(total) as ingresos
      FROM pedidos 
      WHERE created_at >= NOW() - INTERVAL '6 months'
        AND estado IN ('COMPLETADO', 'ENTREGADO')
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY mes DESC
      LIMIT 6
    `,
    
    // Pedidos por estado
    prisma.pedido.groupBy({
      by: ['estado'],
      _count: {
        id: true
      }
    }),

    // Usuarios por rol
    prisma.user.groupBy({
      by: ['role'],
      _count: {
        id: true
      },
      where: {
        activo: true
      }
    }),

    // Restaurantes top por ventas
    prisma.restaurante.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            pedidos: {
              where: {
                estado: { in: ['COMPLETADO', 'ENTREGADO'] }
              }
            }
          }
        }
      },
      orderBy: {
        pedidos: {
          _count: 'desc'
        }
      },
      take: 5
    }),

    // Platillos más populares
    prisma.platillo.findMany({
      select: {
        id: true,
        nombre: true,
        precio: true,
        _count: {
          select: {
            pedidoItems: true
          }
        }
      },
      where: {
        activo: true
      },
      orderBy: {
        pedidoItems: {
          _count: 'desc'
        }
      },
      take: 10
    })
  ])

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
      
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
                Reportes y Analytics
              </h2>
              <p className="text-muted-foreground">
                Métricas y análisis del sistema completo
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pedidosPorEstado.find(p => p.estado === 'EN_PREPARACION')?._count.id || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                En preparación actualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuariosPorRol.reduce((acc, curr) => acc + curr._count.id, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Completación</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                Pedidos completados exitosamente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grid de reportes */}
        <div className="grid gap-6 md:grid-cols-2">


          {/* Restaurantes top */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Restaurantes Más Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restaurantesTop.map((restaurante, index) => (
                  <div key={restaurante.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm">{restaurante.nombre}</span>
                    </div>
                    <span className="font-semibold">{restaurante._count.pedidos} pedidos</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platillos populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                Platillos Más Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productosPopulares.slice(0, 5).map((platillo, index) => (
                  <div key={platillo.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="text-sm truncate max-w-[120px]">{platillo.nombre}</span>
                    </div>
                    <span className="font-semibold">{platillo._count.pedidoItems} ventas</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reporte de ventas mensuales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Ventas Mensuales (Últimos 6 meses)
              </div>
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Gráfico de ventas mensuales</p>
                <p className="text-sm">(Se integraría con una librería de gráficos como Chart.js o Recharts)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}