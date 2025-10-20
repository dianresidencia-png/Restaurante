"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'

interface CreateMenuFormProps {
  restaurantes: Array<{
    id: string
    nombre: string
  }>
}

export function CreateMenuForm({ restaurantes }: CreateMenuFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoMenu: 'COMIDA' as 'DESAYUNO' | 'COMIDA' | 'CENA' | 'POSTRES' | 'BEBIDAS',
    horarioInicio: '08:00',
    horarioFin: '22:00',
    restauranteId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.refresh()
        // Reset form
        setFormData({
          nombre: '',
          descripcion: '',
          tipoMenu: 'COMIDA',
          horarioInicio: '08:00',
          horarioFin: '22:00',
          restauranteId: ''
        })
      } else {
        const error = await response.json()
        alert(error.message || 'Error al crear el menú')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el menú')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Crear Nuevo Menú</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Menú *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ej: Menú de Comida Principal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoMenu">Tipo de Menú *</Label>
              <Select
                value={formData.tipoMenu}
                onValueChange={(value: any) => handleChange('tipoMenu', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESAYUNO">Desayuno</SelectItem>
                  <SelectItem value="COMIDA">Comida</SelectItem>
                  <SelectItem value="CENA">Cena</SelectItem>
                  <SelectItem value="POSTRES">Postres</SelectItem>
                  <SelectItem value="BEBIDAS">Bebidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              placeholder="Describe el menú..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="horarioInicio">Horario Inicio *</Label>
              <Input
                id="horarioInicio"
                type="time"
                value={formData.horarioInicio}
                onChange={(e) => handleChange('horarioInicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horarioFin">Horario Fin *</Label>
              <Input
                id="horarioFin"
                type="time"
                value={formData.horarioFin}
                onChange={(e) => handleChange('horarioFin', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restauranteId">Restaurante *</Label>
              <Select
                value={formData.restauranteId}
                onValueChange={(value) => handleChange('restauranteId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un restaurante" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantes.map((restaurante) => (
                    <SelectItem key={restaurante.id} value={restaurante.id}>
                      {restaurante.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Crear Menú
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}