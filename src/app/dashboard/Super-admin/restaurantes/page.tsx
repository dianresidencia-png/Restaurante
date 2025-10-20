import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { AdminRestaurantsTable } from '../components/AdminRestaurantsTable'
import { CreateRestaurantDialog } from '../components/CreateRestaurantDialog'

export default async function RestaurantesPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  // Obtener restaurantes con todos los datos
  const restaurantes = await prisma.restaurante.findMany({
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
  })

  const totalRestaurantes = restaurantes.length

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header con navegación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
           
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <Building2 className="h-8 w-8 mr-3 text-orange-500" />
                Gestión de Restaurantes
              </h2>
              <p className="text-muted-foreground">
                Administra todos los restaurantes del sistema
              </p>
            </div>
          </div>
          <CreateRestaurantDialog />
        </div>

        {/* Métrica rápida */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurantes</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalRestaurantes}</div>
              <p className="text-xs text-muted-foreground">
                {totalRestaurantes === 0 ? 'Crea tu primer restaurante' : 'Restaurantes activos'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Gerente</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {restaurantes.filter(r => r.gerente).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Restaurantes con gerente asignado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Gerente</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {restaurantes.filter(r => !r.gerente).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Necesitan asignación
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de restaurantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Restaurantes</span>
              <span className="text-sm font-normal text-muted-foreground">
                {totalRestaurantes} restaurantes
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminRestaurantsTable restaurantes={restaurantes} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}