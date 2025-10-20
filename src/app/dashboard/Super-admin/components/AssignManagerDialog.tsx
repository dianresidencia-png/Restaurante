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
import { prisma } from '@/lib/prisma'

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

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?role=GERENTE')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
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

      if (response.ok) {
        onOpenChange(false)
        setSelectedUserId('')
        // Recargar la página para ver los cambios
        window.location.reload()
      }
    } catch (error) {
      console.error('Error assigning manager:', error)
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
            Selecciona un gerente para el restaurante {restaurante.nombre}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="gerente">Seleccionar Gerente</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un gerente" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignManager} 
              disabled={!selectedUserId || loading}
            >
              {loading ? 'Asignando...' : 'Asignar Gerente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}