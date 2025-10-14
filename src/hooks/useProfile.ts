import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  preferences: string
  role: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface UpdateResult {
  success: boolean
  message: string
}

export function useProfile() {
  const { data: session, update } = useSession()
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '', name: '', email: '', phone: '', address: '', preferences: '', role: ''
  })
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '', newPassword: '', confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    if (session?.user) {
      loadProfile()
    }
  }, [session])

  const loadProfile = async () => {
    if (!session?.user) return
    
    try {
      const response = await fetch(`/api/users/${session.user.id}`)
      if (response.ok) {
        const userData = await response.json()
        setProfileData(userData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Fallback a datos de sesión
      setProfileData({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        address: session.user.address || '',
        preferences: session.user.preferences || '',
        role: session.user.role || ''
      })
    }
  }

  const updateProfile = async (): Promise<UpdateResult> => {
    if (!session) {
      return { success: false, message: 'No hay sesión activa' }
    }
    
    setIsLoading(true)
    
    try {
      const updatePayload: any = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        preferences: profileData.preferences,
      }

      if (showPasswordForm && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          return { success: false, message: 'Las contraseñas no coinciden' }
        }
        if (passwordData.newPassword.length < 6) {
          return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' }
        }

        updatePayload.currentPassword = passwordData.currentPassword
        updatePayload.newPassword = passwordData.newPassword
      }

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, message: errorData.error || 'Error al actualizar el perfil' }
      }

      const updatedUser = await response.json()

      // Actualizar sesión
      await update({
        ...session,
        user: { ...session.user, ...updatedUser }
      })

      // Limpiar formulario de contraseña
      if (showPasswordForm) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPasswordForm(false)
      }

      return { success: true, message: 'Perfil actualizado correctamente' }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al actualizar el perfil'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profileData,
    setProfileData,
    passwordData,
    setPasswordData,
    isLoading,
    showPasswordForm,
    setShowPasswordForm,
    updateProfile
  }
}