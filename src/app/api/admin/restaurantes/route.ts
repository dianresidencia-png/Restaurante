import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
 
   try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    
    if (!session) {
      console.log('No autenticado')
      return NextResponse.json(
        { error: 'No autenticado' }, 
        { status: 401 }
      )
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      console.log('Sin permisos:', session.user.role)
      return NextResponse.json(
        { error: 'Se requiere rol SUPER_ADMIN' }, 
        { status: 403 }
      )
    }

    // Parsear el body como JSON
    const body = await request.json()
    console.log('Body recibido:', body)

    const { nombre, direccion, telefono, descripcion } = body

    // Validaciones
    if (!nombre || !direccion || !telefono) {
      return NextResponse.json(
        { error: 'Nombre, dirección y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Crear restaurante
    const restaurante = await prisma.restaurante.create({
      data: {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim(),
        descripcion: descripcion?.trim() || null,
        configuracion: {
          horarios: {
            apertura: "08:00",
            cierre: "22:00"
          }
        }
      }
    })

    console.log('Restaurante creado:', restaurante.id)

    return NextResponse.json({
      success: true,
      restaurante,
      message: 'Restaurante creado exitosamente'
    })

  } catch (error: any) {
    console.error('Error en API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + error.message },
      { status: 500 }
    )
  }
}


export async function GET() {
  return NextResponse.json({ 
    message: 'API de restaurantes funcionando - Usa POST para crear restaurantes',
    timestamp: new Date().toISOString()
  })
}