import { Home, BarChart3, MessageSquare, ClipboardList, Users } from 'lucide-react'

export const supervisorNavigation = [
  { name: 'Dashboard', href: '/dashboard/supervisor', icon: Home },
  { name: 'Monitoreo', href: '/supervisor/monitoreo', icon: BarChart3 },
  { name: 'Chats', href: '/supervisor/chats', icon: MessageSquare },
  { name: 'Reportes', href: '/supervisor/reportes', icon: ClipboardList },
  { name: 'Pedidos', href: '/dashboard/supervisor/pedidos', icon: ClipboardList },
  { name: 'Equipo', href: '/dashboard/supervisor/equipo', icon: Users },

]
