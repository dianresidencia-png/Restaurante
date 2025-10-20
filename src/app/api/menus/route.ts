import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)


    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'No tienes permisos' }, { status: 403 })
    }

    const body = await request.json()
    const { nombre, descripcion, tipoMenu, horarioInicio, horarioFin, restauranteId } = body

    // Validaciones básicas
    if (!nombre || !tipoMenu || !horarioInicio || !horarioFin || !restauranteId) {
      return NextResponse.json(
        { message: 'Todos los campos obligatorios deben ser llenados' },
        { status: 400 }
      )
    }

    // Verificar que el restaurante existe
    const restaurante = await prisma.restaurante.findUnique({
      where: { id: restauranteId }
    })

    if (!restaurante) {
      return NextResponse.json(
        { message: 'El restaurante seleccionado no existe' },
        { status: 400 }
      )
    }

    // Crear el menú
    const menu = await prisma.menu.create({
      data: {
        nombre,
        descripcion,
        tipoMenu,
        horarioInicio,
        horarioFin,
        restauranteId,
        activo: true
      },
      include: {
        restaurante: {
          select: {
            nombre: true
          }
        }
      }
    })

    return NextResponse.json(menu, { status: 201 })

  } catch (error) {
    console.error('Error creating menu:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// También puedes agregar GET para obtener menús si lo necesitas
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const menus = await prisma.menu.findMany({
      include: {
        platillos: true,
        restaurante: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(menus)
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}