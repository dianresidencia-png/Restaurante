"use client"

import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getRoleClasses, type UserRole } from "@/lib/utils/rol-style"

const roleMap: Record<string, UserRole> = {
  CLIENTE: 'CLIENTE',
  MESERO: 'MESERO',
  CHEF: 'CHEF',
  SUPERVISOR: 'SUPERVISOR',
  GERENTE_LOCAL: 'GERENTE_LOCAL',
  SUPER_ADMIN: 'SUPER_ADMIN'
}

export function Header() {
  const { data: session } = useSession()
  const userRole = session?.user?.role as string
  const mappedRole = roleMap[userRole] || 'CLIENTE'
  const roleColors = getRoleClasses(mappedRole)

  return (
    <header className="flex items-center justify-between p-6 border-b bg-background">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Bienvenido, {session?.user?.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={cn("border", roleColors.badge)}>
            {userRole}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {getRoleDescription(mappedRole)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className={cn(
          "px-4 py-2 rounded-lg font-medium transition-colors",
          roleColors.button
        )}>
          Acción Principal
        </button>
      </div>
    </header>
  )
}

function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    CLIENTE: "Explora nuestro menú y haz tu pedido",
    MESERO: "Gestiona chats y órdenes de clientes", 
    CHEF: "Prepara órdenes en la cocina",
    SUPERVISOR: "Supervisa operación del turno",
    GERENTE_LOCAL: "Administra el restaurante",
    SUPER_ADMIN: "Gestiona múltiples restaurantes"
  }
  return descriptions[role] || ''
}
