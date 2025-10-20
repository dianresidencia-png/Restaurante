'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'

export function CreateRestaurantDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/restaurantes', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setOpen(false)

        window.location.reload()
      }
    } catch (error) {
      console.error('Error creando restaurante:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-orange-300'>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Restaurante
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-gray-50 space-y-2'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Restaurante</DialogTitle>
          <DialogDescription>
            Agrega un nuevo restaurante a la plataforma.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6">
          <div className='space-y-3'>
            <Label htmlFor="nombre">Nombre del Restaurante</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Foodzy Centro"
              required
            />
          </div>
          <div  className='space-y-3'>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              placeholder="Ej: Av. Principal 123"
              required
            />
          </div>
          <div  className='space-y-3'>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="Ej: +52 555-1234"
              required
            />
          </div>
          <div  className='space-y-3'>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Breve descripción del restaurante..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className='btn-restaurant'>
              {loading ? 'Creando...' : 'Crear Restaurante'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}