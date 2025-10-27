import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Menu, ArrowLeft, Plus, Utensils, Clock } from 'lucide-react'
import Link from 'next/link'
import { CreateMenuFormGerente } from '../components/create-menu-form-gerente'

interface MenusPageProps {
  searchParams: Promise<{
    create?: string
  }>
}

// Definir el tipo para los menús
interface MenuConPlatillos {
  id: string
  nombre: string
  descripcion: string | null
  tipoMenu: string
  horarioInicio: string
  horarioFin: string
  activo: boolean
  platillos: Array<{
    id: string
    nombre: string
  }>
}

export default async function MenusGerentePage({ searchParams }: MenusPageProps) {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No tienes un restaurante asignado</h2>
          <p className="text-muted-foreground">Contacta al administrador del sistema.</p>
        </div>
      </div>
    )
  }

  // Obtener solo los menús del restaurante del gerente usando la nueva API
  let menus: MenuConPlatillos[] = []
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/gerente/menus`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (response.ok) {
      menus = await response.json()
    } else {
      console.error('Error al cargar menús')
    }
  } catch (error) {
    console.error('Error fetching menus:', error)
    // Fallback: obtener directamente de la base de datos
    const menusFromDB = await prisma.menu.findMany({
      where: {
        restauranteId: restaurante.id
      },
      include: {
        platillos: {
          where: {
            activo: true
          },
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    })
    
    // Convertir al tipo esperado
    menus = menusFromDB as MenuConPlatillos[]
  }

  // Esperar los searchParams
  const params = await searchParams

  // Si hay parámetro create, mostrar formulario
  if (params.create) {
    return (
      <div className="flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <CreateMenuFormGerente restaurante={restaurante} />
          </div>
        </main>
      </div>
    )
  }

  // Calcular estadísticas con tipos definidos
  const totalPlatillos = menus.reduce((acc: number, menu: MenuConPlatillos) => 
    acc + menu.platillos.length, 0
  )
  
  const menusActivos = menus.filter((menu: MenuConPlatillos) => menu.activo).length

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header con navegación */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <Menu className="h-8 w-8 mr-3 text-green-600" />
                Gestión de Menús
              </h2>
              <p className="text-muted-foreground">
                Administra los menús de {restaurante.nombre}
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

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Menús</CardTitle>
              <Menu className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menus.length}</div>
              <p className="text-xs text-muted-foreground">En tu restaurante</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platillos Activos</CardTitle>
              <Utensils className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlatillos}</div>
              <p className="text-xs text-muted-foreground">En todos los menús</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menús Activos</CardTitle>
              <Menu className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menusActivos}</div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid de menús */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menus.length > 0 ? (
            menus.map((menu: MenuConPlatillos) => (
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
                    <div className={`badge-role capitalize ${
                      menu.activo ? 'badge-admin-local' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {menu.tipoMenu.toLowerCase()} {!menu.activo && '(Inactivo)'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm font-medium text-green-600">
                      {menu.platillos.length} platillos
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {restaurante.nombre}
                    </div>
                  </div>

                  {/* Acciones del gerente */}
                  <div className="flex space-x-2 pt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Editar
                    </button>
                    <button className="text-xs text-green-600 hover:text-green-800">
                      {menu.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button className="text-xs text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <Menu className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium">No hay menús creados</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Comienza creando el primer menú para {restaurante.nombre}
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
                Agrega un nuevo menú para {restaurante.nombre}
              </p>
            </CardContent>
          </Card>
        </Link>
      </main>
    </div>
  )
}