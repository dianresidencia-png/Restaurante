import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Menu, ArrowLeft, Plus, Utensils, Clock } from 'lucide-react'
import Link from 'next/link'
import { CreateMenuForm } from '../../components/create-menu-form'

interface MenusPageProps {
  searchParams: {
    create?: string
  }
}

export default async function MenusPage({ searchParams }: MenusPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  // Obtener todos los menús y restaurantes
  const [menus, restaurantes] = await Promise.all([
    prisma.menu.findMany({
      include: {
        platillos: {
          where: {
            activo: true
          }
        },
        restaurante: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    }),
    prisma.restaurante.findMany({
      where: {
        activo: true
      },
      select: {
        id: true,
        nombre: true
      },
      orderBy: {
        nombre: 'asc'
      }
    })
  ])

  // Si hay parámetro create, mostrar formulario
  if (searchParams.create) {
    return (
      <div className="flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <CreateMenuForm restaurantes={restaurantes} />
          </div>
        </main>
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
                <Menu className="h-8 w-8 mr-3 text-green-600" />
                Gestión de Menús
              </h2>
              <p className="text-muted-foreground">
                Administra todos los menús del sistema
              </p>
            </div>
          </div>
          <Link href="?create=true">
            <button className="btn-restaurant flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Menú
            </button>
          </Link>
        </div>

        {/* Grid de menús */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.length > 0 ? (
            menus.map((menu) => (
              <Card key={menu.id} className="card-restaurant hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{menu.nombre}</span>
                    <Utensils className="h-5 w-5 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {menu.descripcion && (
                    <p className="text-sm text-muted-foreground">{menu.descripcion}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {menu.horarioInicio} - {menu.horarioFin}
                    </div>
                    <div className="badge-role badge-admin-local capitalize">
                      {menu.tipoMenu.toLowerCase()}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm font-medium text-green-600">
                      {menu.platillos.length} platillos
                    </div>
                    {menu.restaurante && (
                      <div className="text-xs text-muted-foreground">
                        {menu.restaurante.nombre}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Menu className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium">No hay menús creados</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Comienza creando el primer menú del sistema
              </p>
              <Link href="?create=true">
                <button className="btn-restaurant flex items-center mx-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Menú
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Card para crear nuevo menú */}
        <Link href="?create=true">
          <Card className="border-2 border-dashed border-gray-300 hover:border-green-300 transition-colors cursor-pointer">
            <CardContent className="p-8 text-center">
              <Plus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Crear Nuevo Menú
              </h3>
              <p className="text-sm text-gray-500">
                Agrega un nuevo menú al sistema
              </p>
            </CardContent>
          </Card>
        </Link>
      </main>
    </div>
  )
}