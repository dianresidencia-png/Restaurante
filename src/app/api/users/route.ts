import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Validar que sea Super Admin
    if (session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'No tienes permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const rol = searchParams.get('rol')
    const activo = searchParams.get('activo')
    const search = searchParams.get('search')

    // Construir where clause
    const whereClause: any = {}

    // Filtro por rol
    if (rol && rol !== 'TODOS') {
      whereClause.role = rol
    }

    // Filtro por estado activo
    if (activo) {
      whereClause.activo = activo === 'true'
    }

    // Filtro por búsqueda de texto
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener usuarios
    const usuarios = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        restaurante: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    // Validar que sea Super Admin
    if (session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'No tienes permisos' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validaciones básicas
    if (!body.email || !body.role) {
      return NextResponse.json(
        { message: 'Email y rol son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email ya está en uso' },
        { status: 400 }
      )
    }

    // Crear nuevo usuario (sin password por ahora)
    const newUser = await prisma.user.create({
      data: {
        email: body.email.trim(),
        name: body.name?.trim(),
        phone: body.phone?.trim(),
        address: body.address?.trim(),
        role: body.role,
        restauranteId: body.restauranteId,
        activo: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        restaurante: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}