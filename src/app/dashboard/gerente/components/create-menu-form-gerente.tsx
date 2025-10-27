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

interface CreateMenuFormGerenteProps {
  restaurante: {
    id: string
    nombre: string
  }
}

export function CreateMenuFormGerente({ restaurante }: CreateMenuFormGerenteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoMenu: 'COMIDA' as 'DESAYUNO' | 'COMIDA' | 'CENA' | 'POSTRES' | 'BEBIDAS',
    horarioInicio: '08:00',
    horarioFin: '22:00',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Usar la API específica del gerente
      const response = await fetch('/api/gerente/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // No necesita enviar restauranteId
      })

      if (response.ok) {
        router.refresh()
        router.push('/dashboard/gerente/menu')
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
          <span>Crear Nuevo Menú para {restaurante.nombre}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/gerente/menu')}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Restaurante:</strong> {restaurante.nombre}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Este menú se creará automáticamente para tu restaurante.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/gerente/menu')}
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