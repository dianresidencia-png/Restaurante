'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SidebarTrigger } from '@/components/templates/sidebar'
import { Separator } from '@/components/ui/separator'
import { ProfileForm } from './components/ProfileForm'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'

export default function PerfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const profile = useProfile()

  const handleSave = async () => {
    const result = await profile.updateProfile()
    
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col h-full">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-semibold">Mi Perfil</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Mi Perfil</h1>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <ProfileForm
            profileData={profile.profileData}
            setProfileData={profile.setProfileData}
            passwordData={profile.passwordData}
            setPasswordData={profile.setPasswordData}
            isLoading={profile.isLoading}
            showPasswordForm={profile.showPasswordForm}
            setShowPasswordForm={profile.setShowPasswordForm}
            userRole={session.user.role}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  )
}