'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface User {
  id: string
  name: string | null
  email: string
}

interface Restaurante {
  id: string
  nombre: string
}

interface AssignManagerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurante: Restaurante
}

export function AssignManagerDialog({ 
  open, 
  onOpenChange, 
  restaurante 
}: AssignManagerDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    setFetchingUsers(true)
    try {
      
      const response = await fetch('/api/admin/users?role=GERENTE')
      
      if (response.ok) {
        const data = await response.json()
      
        setUsers(data.users)
      } else {
        const errorData = await response.json()
        alert('Error al cargar los gerentes: ' + (errorData.error || 'Error desconocido'))
      }
    } catch (error) {
      alert('Error de conexión al cargar los gerentes')
    } finally {
      setFetchingUsers(false)
    }
  }

  const handleAssignManager = async () => {
    if (!selectedUserId) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/assign-manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restauranteId: restaurante.id,
          userId: selectedUserId,
        }),
      })

      const result = await response.json()
      

      if (response.ok) {
        alert('Gerente asignado exitosamente')
        onOpenChange(false)
        setSelectedUserId('')
        // Recargar la página para ver los cambios
        setTimeout(() => window.location.reload(), 1000)
      } else {
        throw new Error(result.error || 'Error al asignar gerente')
      }

    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-gray-50'>
        <DialogHeader>
          <DialogTitle>Asignar Gerente</DialogTitle>
          <DialogDescription>
            Selecciona un gerente para el restaurante <strong>{restaurante.nombre}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="gerente">Seleccionar Gerente</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={fetchingUsers}>
              <SelectTrigger>
                <SelectValue placeholder={
                  fetchingUsers ? "Cargando gerentes..." : "Selecciona un gerente"
                } />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 && !fetchingUsers ? (
                  <SelectItem value="no-users" disabled>
                    No hay gerentes disponibles
                  </SelectItem>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {fetchingUsers && (
              <p className="text-sm text-muted-foreground mt-1">Cargando lista de gerentes...</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignManager} 
              disabled={!selectedUserId || loading || fetchingUsers}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Asignando...' : 'Asignar Gerente'}
            </Button>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  )
}