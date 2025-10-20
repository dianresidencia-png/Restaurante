'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreHorizontal, Edit, Users, Eye, Building2, Phone, MapPin } from 'lucide-react'
import { AssignManagerDialog } from './AssignManagerDialog'

interface Restaurante {
  id: string
  nombre: string
  direccion: string | null
  telefono: string | null
  descripcion: string | null
  activo: boolean
  createdAt: Date
  _count: {
    usuarios: number
    pedidos: number
  }
  gerente?: {
    name: string | null
    email: string
  } | null
}

interface AdminRestaurantsTableProps {
  restaurantes: Restaurante[]
}

export function AdminRestaurantsTable({ restaurantes }: AdminRestaurantsTableProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurante | null>(null)
  const [assignManagerOpen, setAssignManagerOpen] = useState(false)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  const handleViewDetails = (restaurante: Restaurante) => {
    setSelectedRestaurant(restaurante)
    setViewDetailsOpen(true)
  }

  const handleAssignManager = (restaurante: Restaurante) => {
    setSelectedRestaurant(restaurante)
    setAssignManagerOpen(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurante</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead>Empleados</TableHead>
              <TableHead>Pedidos Hoy</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurantes.map((restaurante) => (
              <TableRow key={restaurante.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{restaurante.nombre}</div>
                      {restaurante.direccion && (
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {restaurante.direccion}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {restaurante.gerente ? (
                    <div>
                      <div className="font-medium">{restaurante.gerente.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {restaurante.gerente.email}
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Sin asignar
                    </Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {restaurante._count.usuarios}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium">
                    {restaurante._count.pedidos}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={restaurante.activo ? "default" : "secondary"}>
                    {restaurante.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(restaurante.createdAt)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 bg-amber-300">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-gray-200'>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewDetails(restaurante)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignManager(restaurante)}>
                        <Users className="h-4 w-4 mr-2" />
                        {restaurante.gerente ? 'Cambiar gerente' : 'Asignar gerente'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar restaurante
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para ver detalles */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className='bg-gray-50'>
          <DialogHeader>
            <DialogTitle>Detalles del Restaurante</DialogTitle>
            <DialogDescription>
              Información completa del restaurante seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedRestaurant && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">{selectedRestaurant.nombre}</h3>
                  {selectedRestaurant.descripcion && (
                    <p className="text-sm text-muted-foreground">
                      {selectedRestaurant.descripcion}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Dirección</h4>
                  <p className="text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {selectedRestaurant.direccion || 'No especificada'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Teléfono</h4>
                  <p className="text-sm flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {selectedRestaurant.telefono || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Gerente</h4>
                  <p className="text-sm">
                    {selectedRestaurant.gerente ? 
                      `${selectedRestaurant.gerente.name} (${selectedRestaurant.gerente.email})` : 
                      'No asignado'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Estado</h4>
                  <Badge variant={selectedRestaurant.activo ? "default" : "secondary"}>
                    {selectedRestaurant.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Empleados</h4>
                  <p className="text-sm flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {selectedRestaurant._count.usuarios} usuarios
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Pedidos Hoy</h4>
                  <p className="text-sm">{selectedRestaurant._count.pedidos} pedidos</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-1">Fecha de Creación</h4>
                <p className="text-sm">{formatDate(selectedRestaurant.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para asignar gerente */}
      {selectedRestaurant && (
        <AssignManagerDialog 
          open={assignManagerOpen}
          onOpenChange={setAssignManagerOpen}
          restaurante={selectedRestaurant}
        />
      )}
    </>
  )
}