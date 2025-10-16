export type RolUsuario = 
  | 'SUPER_ADMIN'
  | 'GERENTE' 
  | 'SUPERVISOR'
  | 'MESERO'
  | 'CHEF'
  | 'CLIENTE'

export interface PermisosRol {
  gestionarUsuarios: boolean
  verUsuarios: boolean
  gestionarMenu: boolean
  verMenu: boolean
  gestionarPedidos: boolean
  verPedidos: boolean
  actualizarEstadoPedido: boolean
  gestionarRestaurante: boolean
  verReportes: boolean
  usarChat: boolean
  verTodosChats: boolean
  verPedidosCocina: boolean
  actualizarEstadoCocina: boolean
  marcarPedidoListo: boolean
}

export const PERMISOS_POR_ROL: Record<RolUsuario, PermisosRol> = {
  'SUPER_ADMIN': {
    gestionarUsuarios: true,
    verUsuarios: true,
    gestionarMenu: true,
    verMenu: true,
    gestionarPedidos: true,
    verPedidos: true,
    actualizarEstadoPedido: true,
    gestionarRestaurante: true,
    verReportes: true,
    usarChat: true,
    verTodosChats: true,
    verPedidosCocina: true,
    actualizarEstadoCocina: false,
    marcarPedidoListo: false
  },

  'GERENTE': {
    gestionarUsuarios: true,     // Solo su restaurante
    verUsuarios: true,
    gestionarMenu: true,         // Solo su restaurante
    verMenu: true,
    gestionarPedidos: true,
    verPedidos: true,
    actualizarEstadoPedido: true,
    gestionarRestaurante: true,  // Solo su restaurante
    verReportes: true,
    usarChat: true,
    verTodosChats: true,
    verPedidosCocina: true,
    actualizarEstadoCocina: false,
    marcarPedidoListo: false
  },

  'SUPERVISOR': {
    gestionarUsuarios: false,
    verUsuarios: true,
    gestionarMenu: false,
    verMenu: true,
    gestionarPedidos: true,      // Reasignar, modificar
    verPedidos: true,
    actualizarEstadoPedido: true,
    gestionarRestaurante: false,
    verReportes: true,           // Reportes de su turno
    usarChat: true,
    verTodosChats: true,         // Todos los chats del restaurante
    verPedidosCocina: true,
    actualizarEstadoCocina: false,
    marcarPedidoListo: false
  },

  'MESERO': {
    gestionarUsuarios: false,
    verUsuarios: false,
    gestionarMenu: false,
    verMenu: true,
    gestionarPedidos: true,      // Crear pedidos, actualizar estado básico
    verPedidos: true,            // Solo sus pedidos/turno
    actualizarEstadoPedido: true, // Hasta "EN_PREPARACION"
    gestionarRestaurante: false,
    verReportes: false,
    usarChat: true,              // Chat con clientes
    verTodosChats: false ,       // Solo sus chats asignados
    verPedidosCocina: true,   // solo puede ver los pedidos de la cocina, si estan listos y así
    actualizarEstadoCocina: false,
    marcarPedidoListo: false
  },

  'CHEF': {
    gestionarUsuarios: false,
    verUsuarios: false,
    gestionarMenu: false,
    verMenu: true,               // Para referencia
    gestionarPedidos: false,
    verPedidos: true,            // Solo pedidos de cocina
    actualizarEstadoPedido: true, // Solo estados de cocina
    gestionarRestaurante: false,
    verReportes: false,
    usarChat: false,
    verTodosChats: false,
    verPedidosCocina: true,
    actualizarEstadoCocina: true,
    marcarPedidoListo: true
  },

  'CLIENTE': {
    gestionarUsuarios: false,
    verUsuarios: false,
    gestionarMenu: false,
    verMenu: true,               // Menú público
    gestionarPedidos: false,
    verPedidos: true,            // Solo sus pedidos
    actualizarEstadoPedido: false,
    gestionarRestaurante: false,
    verReportes: false,
    usarChat: true,              // Solo con meseros/soporte
    verTodosChats: false,
    verPedidosCocina: false,
    actualizarEstadoCocina: false,
    marcarPedidoListo: false
  }
}