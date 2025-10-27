import { Home, Building2, Users, Menu, BarChart3, Settings } from 'lucide-react'

export const superAdminNavigation = [
  { name: 'Dashboard', href: '/dashboard/Super-admin', icon: Home },
  { name: 'Restaurantes', href: '/dashboard/Super-admin/restaurantes', icon: Building2 },
  { name: 'Usuarios', href: '/dashboard/Super-admin/Usuarios', icon: Users },
  { name: 'Menús Global', href: '/dashboard/Super-admin/menus', icon: Menu },
  { name: 'Reportes Globales', href: '/dashboard/Super-admin/reportes', icon: BarChart3 },
 
]