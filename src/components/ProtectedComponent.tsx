'use client'

import { useSession } from 'next-auth/react'
import { PERMISOS_POR_ROL, type RolUsuario } from '@/config/permisos'

interface ProtectedComponentProps {
  permission: keyof typeof PERMISOS_POR_ROL[RolUsuario]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedComponent({ 
  permission, 
  children, 
  fallback = null 
}: ProtectedComponentProps) {
  const { data: session } = useSession()
  
  if (!session?.user?.role) return <>{fallback}</>
  
  const userRole = session.user.role as RolUsuario
  const permissions = PERMISOS_POR_ROL[userRole]
  
  if (!permissions[permission]) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}