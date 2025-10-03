import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { SidebarTrigger } from '@/components/templates/sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Mi Perfil</h1>
      </header>

      <div className="p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input defaultValue={session?.user?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={session?.user?.email || ''} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input placeholder="+52 123 456 7890" />
            </div>
            <Button>Guardar cambios</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}