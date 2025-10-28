import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar con Zod
    const validationResult = registerSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos de registro inválidos',
          details: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    const { name, email, password, role } = validationResult.data

    // 👇 FORZAR QUE SIEMPRE SEA CLIENTE EN REGISTRO PÚBLICO
    const userRole = 'CLIENTE'

    console.log('Registrando usuario:', { name, email, role: userRole }) // Para debug

    // Validar que el email no esté en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      )
    }

    // Hash seguro de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario SIEMPRE como CLIENTE
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole, // 👈 SIEMPRE CLIENTE
        activo: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        activo: true,
        createdAt: true
      }
    })

    console.log('Usuario creado exitosamente:', user) // Para debug

    return NextResponse.json(
      { 
        success: true,
        message: 'Usuario registrado exitosamente',
        user 
      },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('Error en registro:', error)
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}