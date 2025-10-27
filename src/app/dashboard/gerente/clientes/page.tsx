import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, MapPin, Calendar, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function ClientesPage() {
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

  // Obtener clientes que han hecho pedidos en este restaurante
  const clientes = await prisma.user.findMany({
    where: {
      role: 'CLIENTE',
      pedidosComoCliente: {
        some: {
          restauranteId: restaurante.id
        }
      }
    },
    include: {
      _count: {
        select: {
          pedidosComoCliente: {
            where: {
              restauranteId: restaurante.id
            }
          }
        }
      },
      pedidosComoCliente: {
        where: {
          restauranteId: restaurante.id,
          estado: { in: ['COMPLETADO', 'ENTREGADO'] }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Estadísticas de clientes
  const totalClientes = clientes.length
  const clientesFrecuentes = clientes.filter(c => c._count.pedidosComoCliente > 3).length
  const nuevoClientes = clientes.filter(c => {
    const primerPedido = c.pedidosComoCliente[0]
    return primerPedido && new Date(primerPedido.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }).length

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <User className="h-8 w-8 mr-3 text-blue-600" />
                Gestión de Clientes
              </h2>
              <p className="text-muted-foreground">
                Clientes de {restaurante.nombre}
              </p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientes}</div>
              <p className="text-xs text-muted-foreground">Clientes registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Frecuentes</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesFrecuentes}</div>
              <p className="text-xs text-muted-foreground">+3 pedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
              <User className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{nuevoClientes}</div>
              <p className="text-xs text-muted-foreground">Últimos 30 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda y filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtrar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Clientes</span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalClientes} clientes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{cliente.name || 'Cliente'}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {cliente.email}
                      </div>
                      {cliente.phone && (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {cliente.phone}
                        </div>
                      )}
                      {cliente.address && (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[200px]">{cliente.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{cliente._count.pedidosComoCliente}</div>
                    <div className="text-sm text-muted-foreground">pedidos</div>
                    {cliente.pedidosComoCliente[0] && (
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Último: {new Date(cliente.pedidosComoCliente[0].createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {clientes.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium">No hay clientes</h3>
                  <p className="text-muted-foreground mt-2">
                    Los clientes aparecerán aquí cuando realicen su primer pedido
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