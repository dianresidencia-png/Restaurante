import { Home, Menu, Users, BarChart3, Clock } from 'lucide-react'

export const gerenteNavigation = [
  { name: 'Dashboard', href: '/dashboard/gerente', icon: Home },
  { name: 'Menú', href: '/gerente/menu', icon: Menu },
  { name: 'Empleados', href: '/gerente/empleados', icon: Users },
  { name: 'Turnos', href: '/dashboard/gerente/turnos', icon: Clock },
  { name: 'Reportes', href: '/gerente/reportes', icon: BarChart3 },
]
