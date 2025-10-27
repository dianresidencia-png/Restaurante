import { Home, Menu, Users, BarChart3, Clock, MessageCircle, User2 } from 'lucide-react'

export const gerenteNavigation = [
  { name: 'Dashboard', href: '/dashboard/gerente', icon: Home },
  { name: 'Menú', href: '/dashboard/gerente/menu', icon: Menu },
  { name: 'Empleados', href: '/dashboard/gerente/empleados', icon: Users },
  { name: 'Clientes', href: '/dashboard/gerente/clientes', icon: User2 },
  { name: 'Chats', href: '/dashboard/gerente/chats', icon: MessageCircle },
  { name: 'Reportes', href: '/dashboard/gerente/reportes', icon: BarChart3 },
]
