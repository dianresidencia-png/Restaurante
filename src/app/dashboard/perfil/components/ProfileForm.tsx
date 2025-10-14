import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface ProfileFormProps {
  profileData: any
  setProfileData: (data: any) => void
  passwordData: any
  setPasswordData: (data: any) => void
  isLoading: boolean
  showPasswordForm: boolean
  setShowPasswordForm: (show: boolean) => void
  userRole: string
  onSave: () => void
}

export function ProfileForm({
  profileData,
  setProfileData,
  passwordData,
  setPasswordData,
  isLoading,
  showPasswordForm,
  setShowPasswordForm,
  userRole,
  onSave
}: ProfileFormProps) {
  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'CLIENTE': 'bg-green-500',
      'MESERO': 'bg-orange-500',
      'CHEF': 'bg-red-500',
      'SUPERVISOR': 'bg-blue-500',
      'GERENTE_LOCAL': 'bg-purple-500',
      'SUPER_ADMIN': 'bg-gray-500'
    }
    return colors[role] || 'bg-gray-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Información</CardTitle>
        <CardDescription>Actualiza tu información personal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información Personal */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Personal</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              placeholder="Tu nombre completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              placeholder="tu@email.com"
            />
            <p className="text-xs text-muted-foreground">
              Puedes cambiar tu email si pierdes acceso al actual
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="+52 123 456 7890"
            />
          </div>
        </div>

        {/* Información para Clientes */}
        {userRole === 'CLIENTE' && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Información de Entrega</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                placeholder="Dirección para entregas a domicilio"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferencias alimenticias</Label>
              <Textarea
                id="preferences"
                value={profileData.preferences}
                onChange={(e) => setProfileData({...profileData, preferences: e.target.value})}
                placeholder="Alergias, dieta vegetariana, sin gluten, etc."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Cambio de Contraseña */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-base">Cambiar contraseña</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña actual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Tu contraseña actual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Repite la nueva contraseña"
                />
              </div>
            </div>
          )}
        </div>

        {/* Información de Rol */}
        <div className="space-y-2">
          <Label>Rol</Label>
          <div className="flex items-center gap-2">
            <Badge className={getRoleBadgeColor(userRole)}>
              {userRole}
            </Badge>
          </div>
        </div>

        {/* Botón de Guardar */}
        <Button 
          onClick={onSave}
          disabled={isLoading}
          className="w-full btn-restaurant"
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </CardContent>
    </Card>
  )
}