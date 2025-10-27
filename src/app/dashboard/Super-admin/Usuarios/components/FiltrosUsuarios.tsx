"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FiltrosUsuariosProps {
  searchParams: {
    rol?: string
    activo?: string
    search?: string
  }
}

export function FiltrosUsuarios({ searchParams }: FiltrosUsuariosProps) {
  const router = useRouter()

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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams()
    
    // Mantener otros filtros
    if (searchParams.rol && key !== 'rol') params.set('rol', searchParams.rol)
    if (searchParams.activo && key !== 'activo') params.set('activo', searchParams.activo)
    if (searchParams.search && key !== 'search') params.set('search', searchParams.search)
    
    // Agregar/modificar el filtro actual
    if (value && key !== 'clear') {
      params.set(key, value)
    }
    
    // IMPORTANTE: Usar la misma capitalización que la carpeta
    router.push(`/dashboard/Super-admin/Usuarios?${params.toString()}`)
  }

  const handleClearFilter = (key: string) => {
    const params = new URLSearchParams()
    
    // Mantener todos los filtros excepto el que se está limpiando
    if (searchParams.rol && key !== 'rol') params.set('rol', searchParams.rol)
    if (searchParams.activo && key !== 'activo') params.set('activo', searchParams.activo)
    if (searchParams.search && key !== 'search') params.set('search', searchParams.search)
    
    // IMPORTANTE: Usar la misma capitalización que la carpeta
    router.push(`/dashboard/Super-admin/Usuarios?${params.toString()}`)
  }

  const handleSearch = (formData: FormData) => {
    const search = formData.get('search') as string
    handleFilterChange('search', search)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Búsqueda por texto */}
        <div className="flex-1">
          <form action={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                name="search"
                placeholder="Buscar por nombre, email o teléfono..."
                defaultValue={searchParams.search || ''}
                className="pl-10"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </form>
        </div>

        {/* Filtros por rol y estado */}
        <div className="flex gap-2">
          <select 
            className="border rounded-md px-3 py-2 text-sm"
            value={searchParams.rol || 'TODOS'}
            onChange={(e) => handleFilterChange('rol', e.target.value)}
          >
            <option value="TODOS">Todos los roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="GERENTE">Gerentes</option>
            <option value="SUPERVISOR">Supervisores</option>
            <option value="MESERO">Meseros</option>
            <option value="CHEF">Chefs</option>
            <option value="CLIENTE">Clientes</option>
          </select>

          <select 
            className="border rounded-md px-3 py-2 text-sm"
            value={searchParams.activo || ''}
            onChange={(e) => handleFilterChange('activo', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Filtros activos */}
      {(searchParams.rol || searchParams.activo || searchParams.search) && (
        <div className="flex flex-wrap gap-2">
          {searchParams.rol && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Rol: {translateRole(searchParams.rol)}
              <button 
                onClick={() => handleClearFilter('rol')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {searchParams.activo && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Estado: {searchParams.activo === 'true' ? 'Activos' : 'Inactivos'}
              <button 
                onClick={() => handleClearFilter('activo')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {searchParams.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: "{searchParams.search}"
              <button 
                onClick={() => handleClearFilter('search')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}