import { Home, Menu, ShoppingBag, MessageSquare } from 'lucide-react'

export const clienteNavigation = [
  { 
    name: 'Inicio', 
    href: '/cliente', 
    icon: Home 
},

  { name: 'Menú', 
    href: '/cliente/menu', 
    icon: Menu },

  { name: 'Mis Pedidos', 
    href: '/cliente/pedidos', 
    icon: ShoppingBag },

  { name: 'Chat',
    href: '/cliente/chat', 
    icon: MessageSquare },
]
