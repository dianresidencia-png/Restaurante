"use client"

import { useState } from 'react'
import { Mail, Phone, Building2, MoreHorizontal, Edit, Trash2, UserX, UserCheck, Shield, Users} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Usuario {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  activo: boolean
  createdAt: Date
  restaurante: {
    nombre: string
  } | null
}

interface UsuariosTableProps {
  usuarios: Usuario[]
  onEdit: (usuario: Usuario) => void
  onToggleStatus: (usuarioId: string, nuevoEstado: boolean) => void
  onDelete: (usuarioId: string) => void
}

export function UsuariosTable({ usuarios, onEdit, onToggleStatus, onDelete }: UsuariosTableProps) {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: string }>({})

  // Función para obtener el color del badge según el rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'GERENTE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SUPERVISOR':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'MESERO':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CHEF':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CLIENTE':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Función para traducir el rol
  const translateRole = (role: string) => {
    const roles: { [key: string]: string } = {
      'SUPER_ADMIN': 'Super Admin',
      'GERENTE': 'Gerente',
      'SUPERVISOR': 'Supervisor',
      'MESERO': 'Mesero',
      'CHEF': 'Chef',
      'CLIENTE': 'Cliente'
    }
    return roles[role] || role
  }

  const handleAction = async (usuarioId: string, action: string, usuario?: Usuario) => {
    setLoadingStates(prev => ({ ...prev, [usuarioId]: action }))
    
    try {
      switch (action) {
        case 'edit':
          if (usuario) onEdit(usuario)
          break
        case 'toggleStatus':
          await onToggleStatus(usuarioId, !usuarios.find(u => u.id === usuarioId)?.activo)
          break
        case 'delete':
          await onDelete(usuarioId)
          break
      }
    } finally {
      setLoadingStates(prev => {
        const newState = { ...prev }
        delete newState[usuarioId]
        return newState
      })
    }
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Restaurante</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de Registro</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {usuario.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{usuario.name || 'Sin nombre'}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {usuario.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="truncate max-w-[180px]">{usuario.email}</span>
                    </div>
                    {usuario.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>{usuario.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getRoleColor(usuario.role)}`}>
                    {translateRole(usuario.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {usuario.restaurante ? (
                    <div className="flex items-center text-sm">
                      <Building2 className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span>{usuario.restaurante.nombre}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No asignado</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={usuario.activo ? "default" : "secondary"}
                    className={usuario.activo ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {new Date(usuario.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleAction(usuario.id, 'edit', usuario)}
                        disabled={loadingStates[usuario.id] === 'edit'}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {loadingStates[usuario.id] === 'edit' ? 'Editando...' : 'Editar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(usuario.id, 'toggleStatus')}
                        disabled={loadingStates[usuario.id] === 'toggleStatus'}
                      >
                        {usuario.activo ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            {loadingStates[usuario.id] === 'toggleStatus' ? 'Desactivando...' : 'Desactivar'}
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            {loadingStates[usuario.id] === 'toggleStatus' ? 'Activando...' : 'Activar'}
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction(usuario.id, 'delete')}
                        disabled={loadingStates[usuario.id] === 'delete'}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {loadingStates[usuario.id] === 'delete' ? 'Eliminando...' : 'Eliminar'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No se encontraron usuarios</h3>
                <p className="text-muted-foreground mt-2">
                  No hay usuarios que coincidan con los filtros aplicados
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}