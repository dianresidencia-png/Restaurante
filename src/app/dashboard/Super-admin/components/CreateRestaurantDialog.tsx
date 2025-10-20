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
import { Plus, Loader2 } from 'lucide-react'

export function CreateRestaurantDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    descripcion: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Enviando datos:', formData)

      const response = await fetch('/api/admin/restaurantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Respuesta status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Éxito:', result)
        alert('Restaurante creado exitosamente')
        setOpen(false)
        setFormData({ nombre: '', direccion: '', telefono: '', descripcion: '' })

        setTimeout(() => window.location.reload(), 1000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

    } catch (error: any) {
      console.error('Error completo:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-orange-500 hover:bg-orange-600 text-white'>
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='space-y-3'>
            <Label htmlFor="nombre">Nombre del Restaurante *</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Foodzy Centro"
              required
              disabled={loading}
            />
          </div>
          
          <div className='space-y-3'>
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Ej: Av. Principal 123"
              required
              disabled={loading}
            />
          </div>
          
          <div className='space-y-3'>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ej: +52 555-1234"
              required
              disabled={loading}
            />
          </div>
          
          <div className='space-y-3'>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Breve descripción del restaurante..."
              disabled={loading}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className='bg-orange-500 hover:bg-orange-600 text-white'
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Restaurante'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}