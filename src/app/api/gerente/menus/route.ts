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

    // Solo gerentes pueden acceder a esta ruta
    if (session.user?.role !== 'GERENTE') {
      return NextResponse.json({ message: 'No tienes permisos' }, { status: 403 })
    }

    const body = await request.json()
    const { nombre, descripcion, tipoMenu, horarioInicio, horarioFin } = body

    // Validaciones básicas
    if (!nombre || !tipoMenu || !horarioInicio || !horarioFin) {
      return NextResponse.json(
        { message: 'Todos los campos obligatorios deben ser llenados' },
        { status: 400 }
      )
    }

    // Obtener el restaurante del gerente
    const restaurante = await prisma.restaurante.findFirst({
      where: {
        gerenteId: session.user.id
      }
    })

    if (!restaurante) {
      return NextResponse.json(
        { message: 'No tienes un restaurante asignado' },
        { status: 400 }
      )
    }

    // Crear el menú automáticamente en el restaurante del gerente
    const menu = await prisma.menu.create({
      data: {
        nombre,
        descripcion,
        tipoMenu,
        horarioInicio,
        horarioFin,
        restauranteId: restaurante.id, // Se asigna automáticamente
        activo: true
      },
      include: {
        restaurante: {
          select: {
            nombre: true
          }
        },
        platillos: true
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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Solo gerentes pueden acceder a esta ruta
    if (session.user?.role !== 'GERENTE') {
      return NextResponse.json({ message: 'No tienes permisos' }, { status: 403 })
    }

    // Obtener el restaurante del gerente
    const restaurante = await prisma.restaurante.findFirst({
      where: {
        gerenteId: session.user.id
      }
    })

    if (!restaurante) {
      return NextResponse.json(
        { message: 'No tienes un restaurante asignado' },
        { status: 400 }
      )
    }

    // Obtener solo los menús del restaurante del gerente
    const menus = await prisma.menu.findMany({
      where: {
        restauranteId: restaurante.id
      },
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