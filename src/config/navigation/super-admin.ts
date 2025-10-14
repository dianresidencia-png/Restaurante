import { Home, Building2, Users, Menu, BarChart3, Settings } from 'lucide-react'

export const superAdminNavigation = [
  { name: 'Dashboard', href: '/dashboard/super-admin', icon: Home },
  { name: 'Restaurantes', href: '/dashboard/super-admin/restaurantes', icon: Building2 },
  { name: 'Administradores', href: '/dashboard/super-admin/administradores', icon: Users },
  { name: 'Menús Global', href: '/dashboard/super-admin/menus', icon: Menu },
  { name: 'Reportes Globales', href: '/dashboard/super-admin/reportes', icon: BarChart3 },
 
]