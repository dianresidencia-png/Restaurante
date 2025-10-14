import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { UserService } from '@/lib/services/userService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: userId } = await params
    
    // Validar permisos
    await UserService.validatePermissions(session.user.id, userId, session.user.role)

    const user = await UserService.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error en GET /api/users/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: error instanceof Error && error.message.includes('permisos') ? 403 : 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id: userId } = await params
    const body = await request.json()

    // Validar permisos
    await UserService.validatePermissions(session.user.id, userId, session.user.role)

    const updatedUser = await UserService.updateUserProfile(userId, body)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error en PUT /api/users/[id]:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 
        error instanceof Error && error.message.includes('permisos') ? 403 :
        error instanceof Error && error.message.includes('en uso') ? 400 :
        error instanceof Error && error.message.includes('requerida') ? 400 :
        error instanceof Error && error.message.includes('incorrecta') ? 400 : 500
      }
    )
  }
}