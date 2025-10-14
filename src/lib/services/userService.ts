import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export class UserService {
  static async getUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      }
    })
  }

  static async updateUserProfile(
    userId: string, 
    updateData: {
      name?: string
      email?: string
      phone?: string
      address?: string
      preferences?: string
      currentPassword?: string
      newPassword?: string
    }
  ) {
    const { currentPassword, newPassword, ...profileData } = updateData
    const updatePayload: any = { ...profileData }

    // Validar cambio de email
    if (updateData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: updateData.email.trim() }
      })
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Este email ya está en uso')
      }
      updatePayload.email = updateData.email.trim()
    }

    // Validar cambio de contraseña
    if (newPassword) {
      if (!currentPassword) {
        throw new Error('La contraseña actual es requerida')
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      })

      if (!user?.password) {
        throw new Error('Usuario no encontrado')
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta')
      }

      updatePayload.password = await bcrypt.hash(newPassword, 12)
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        preferences: true,
        updatedAt: true,
      }
    })
  }

  static async validatePermissions(currentUserId: string, targetUserId: string, userRole: string) {
    const canEditOtherUsers = ['GERENTE_LOCAL', 'SUPER_ADMIN', 'SUPERVISOR'].includes(userRole)
    
    if (currentUserId !== targetUserId && !canEditOtherUsers) {
      throw new Error('No tienes permisos para esta acción')
    }
  }
}