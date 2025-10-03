import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { SidebarTrigger } from '@/components/templates/sidebar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Clock } from 'lucide-react'

export default async function MeseroDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'MESERO') redirect('/unauthorized')

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-6">
        <h2 className="text-3xl font-bold">Panel de Control</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}