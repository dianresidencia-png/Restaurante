import { clienteNavigation } from './cliente'
import { meseroNavigation } from './mesero'
import { chefNavigation } from './chef'
import { supervisorNavigation } from './supervisor'
import { gerenteNavigation } from './gerente'
import { superAdminNavigation } from './super-admin'

export type UserRole = 
  | 'CLIENTE' 
  | 'MESERO' 
  | 'CHEF' 
  | 'SUPERVISOR' 
  | 'GERENTE' 
  | 'SUPER_ADMIN'

export const navigationByRole: Record<UserRole, Array<{ 
  name: string
  href: string
  icon: any 
}>> = {
  CLIENTE: clienteNavigation,
  MESERO: meseroNavigation,
  CHEF: chefNavigation,
  SUPERVISOR: supervisorNavigation,
  GERENTE: gerenteNavigation,
  SUPER_ADMIN: superAdminNavigation,
}