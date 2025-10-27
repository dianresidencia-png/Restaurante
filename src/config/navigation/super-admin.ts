import { Home, Building2, Users, Menu, BarChart3, Settings } from 'lucide-react'

export const superAdminNavigation = [
  { name: 'Dashboard', href: '/dashboard/Super-admin', icon: Home },
  { name: 'Restaurantes', href: '/dashboard/Super-admin/restaurantes', icon: Building2 },
  { name: 'Usuarios', href: '/dashboard/Super-admin/Usuarios', icon: Users },
  { name: 'Menús', href: '/dashboard/Super-admin/menus', icon: Menu },
  { name: 'Reportes', href: '/dashboard/Super-admin/reportes', icon: BarChart3 },
 {
    name: "Configuración",
    description: "Configuración global del sistema",
    icon: Settings,
    href: "/dashboard/Super-admin/configuracion",
    color: "text-gray-600", 
    bgColor: "bg-gray-50"
  }
]