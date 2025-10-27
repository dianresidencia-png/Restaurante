import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, User, Send, Search, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function ChatsPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'GERENTE') redirect('/unauthorized')

  // Obtener el restaurante del gerente
  const restaurante = await prisma.restaurante.findFirst({
    where: {
      gerenteId: session.user.id
    }
  })

  if (!restaurante) {
    redirect('/unauthorized')
  }

  // Obtener chats del restaurante
  const chats = await prisma.chat.findMany({
    where: {
      restauranteId: restaurante.id
    },
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      pedido: {
        select: {
          id: true,
          estado: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  })

  // Agrupar chats por usuario para mostrar conversaciones
  const chatsPorUsuario = chats.reduce((acc, chat) => {
    const usuarioId = chat.usuario.id
    if (!acc[usuarioId]) {
      acc[usuarioId] = {
        usuario: chat.usuario,
        chats: [],
        ultimoMensaje: chat.createdAt
      }
    }
    acc[usuarioId].chats.push(chat)
    if (chat.createdAt > acc[usuarioId].ultimoMensaje) {
      acc[usuarioId].ultimoMensaje = chat.createdAt
    }
    return acc
  }, {} as any)

  const conversaciones = Object.values(chatsPorUsuario).sort((a: any, b: any) => 
    new Date(b.ultimoMensaje).getTime() - new Date(a.ultimoMensaje).getTime()
  )

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">

            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <MessageCircle className="h-8 w-8 mr-3 text-green-600" />
                Gestión de Chats
              </h2>
              <p className="text-muted-foreground">
                Comunicación con clientes y empleados de {restaurante.nombre}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lista de conversaciones */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversaciones</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {conversaciones.length} chats
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Búsqueda */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar conversaciones..."
                    className="pl-10"
                  />
                </div>

                {/* Lista de conversaciones */}
                {conversaciones.map((conversacion: any) => (
                  <div
                    key={conversacion.usuario.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {conversacion.usuario.name || conversacion.usuario.email}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {conversacion.chats[0]?.mensaje || 'Sin mensajes'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        {new Date(conversacion.ultimoMensaje).toLocaleTimeString()}
                      </div>
                      {conversacion.chats.length > 0 && (
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center mt-1">
                          {conversacion.chats.length}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {conversaciones.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium">No hay conversaciones</h3>
                    <p className="text-muted-foreground mt-2">
                      Los chats aparecerán aquí cuando los clientes o empleados envíen mensajes
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Área de chat */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div>Selecciona una conversación</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      Elige un chat para empezar a conversar
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-96 border rounded-lg">
                {/* Mensajes */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Selecciona una conversación para ver los mensajes</p>
                  </div>
                </div>

                {/* Input de mensaje */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Escribe un mensaje..."
                      disabled
                    />
                    <Button disabled>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas de chats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mensajes</CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chats.length}</div>
              <p className="text-xs text-muted-foreground">En este restaurante</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
              <MessageCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversaciones.length}</div>
              <p className="text-xs text-muted-foreground">Conversaciones</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <User className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversaciones.filter((c: any) => c.usuario.role === 'CLIENTE').length}
              </div>
              <p className="text-xs text-muted-foreground">En chat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empleados</CardTitle>
              <User className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversaciones.filter((c: any) => c.usuario.role !== 'CLIENTE').length}
              </div>
              <p className="text-xs text-muted-foreground">En chat</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}