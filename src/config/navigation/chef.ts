import { ChefHat, ClipboardList, Clock, Timer, CheckCircle } from 'lucide-react'
import { permission } from 'process'

export const chefNavigation = [
  { name: 'Cocina', href: '/dashboard/chef', icon: ChefHat,  },
  { name: 'Pedidos', href: '/chef/pedidos', icon: ClipboardList, permission: 'verPedidos' },
  { name: 'Pedidos Pendientes', href: '/dashboard/chef/pendientes', icon: Clock },
  { name: 'En Preparación', href: '/dashboard/chef/preparacion', icon: Timer, permission:' actualizarEstadoCocina' },
  { name: 'Listos', href: '/dashboard/chef/listos', icon: CheckCircle,  permission: 'marcarPedidoListo' },
  
]
