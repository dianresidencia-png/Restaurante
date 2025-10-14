
export type UserRole = 
  | 'CLIENTE' 
  | 'MESERO' 
  | 'CHEF' 
  | 'SUPERVISOR' 
  | 'GERENTE_LOCAL' 
  | 'SUPER_ADMIN'


export const roleColorMap: Record<UserRole, string> = {
  CLIENTE: 'bg-cliente/5',
  MESERO: 'bg-mesero/5',
  CHEF: 'bg-chef/5',
  SUPERVISOR: 'bg-supervisor/5',
  GERENTE_LOCAL: 'bg-gerente/5',
  SUPER_ADMIN: 'bg-admin/5',
}


export function getRoleClasses(role: UserRole) {
  const colorName = role.toLowerCase().replace('_local', '').replace('super_', '')
  
  return {
    bg: `bg-${colorName}`,
    bgLight: `bg-${colorName}/5`,
    bgMedium: `bg-${colorName}/10`,
    text: `text-${colorName}`,
    textForeground: `text-${colorName}-foreground`,
    border: `border-${colorName}`,
    borderLight: `border-${colorName}/30`,
    
    // Clases compuestas comunes
    badge: `bg-${colorName}/20 text-${colorName} border border-${colorName}/30`,
    button: `bg-${colorName} hover:bg-${colorName}/90 text-${colorName}-foreground`,
    buttonOutline: `border border-${colorName} text-${colorName} hover:bg-${colorName}/10`,
  }
}