import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { restauranteId, userId } = await request.json()

    console.log('Asignando gerente:', { restauranteId, userId })

    // Verificar que el usuario existe y es GERENTE
    const usuario = await prisma.user.findFirst({
      where: {
        id: userId,
        role: 'GERENTE',
        activo: true
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado o no es un gerente válido' },
        { status: 400 }
      )
    }

    // Verificar que el restaurante existe
    const restaurante = await prisma.restaurante.findFirst({
      where: { id: restauranteId }
    })

    if (!restaurante) {
      return NextResponse.json(
        { error: 'Restaurante no encontrado' },
        { status: 400 }
      )
    }

    // Actualizar el restaurante con el nuevo gerente
    await prisma.restaurante.update({
      where: { id: restauranteId },
      data: {
        gerenteId: userId
      }
    })

    // Actualizar el usuario para asignarle el restaurante
    await prisma.user.update({
      where: { id: userId },
      data: {
        restauranteId: restauranteId
      }
    })

    console.log('Gerente asignado correctamente')

    return NextResponse.json({ 
      success: true,
      message: 'Gerente asignado exitosamente'
    })

  } catch (error) {
    console.error('Error assigning manager:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}