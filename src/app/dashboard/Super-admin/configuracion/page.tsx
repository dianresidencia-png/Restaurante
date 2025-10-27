import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Bell, Shield, Database, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ConfiguracionPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/login')
  if (session.user?.role !== 'SUPER_ADMIN') redirect('/unauthorized')

  const configSections = [
    {
      title: "Configuración General",
      description: "Ajustes básicos del sistema",
      icon: Settings,
      items: [
        "Nombre del sistema",
        "Logo de la empresa",
        "Zona horaria",
        "Idioma por defecto",
        "Moneda"
      ]
    },
    {
      title: "Notificaciones",
      description: "Configuración de alertas y notificaciones",
      icon: Bell,
      items: [
        "Email de notificaciones",
        "Alertas de pedidos",
        "Notificaciones push",
        "Reportes automáticos"
      ]
    },
    {
      title: "Seguridad",
      description: "Configuración de seguridad y permisos",
      icon: Shield,
      items: [
        "Políticas de contraseñas",
        "Autenticación de dos factores",
        "Registro de auditoría",
        "Límites de intentos"
      ]
    },
    {
      title: "Base de Datos",
      description: "Gestión y respaldos de datos",
      icon: Database,
      items: [
        "Respaldos automáticos",
        "Límites de almacenamiento",
        "Optimización de BD",
        "Logs del sistema"
      ]
    },
    {
      title: "Email y SMTP",
      description: "Configuración del servidor de correo",
      icon: Mail,
      items: [
        "Servidor SMTP",
        "Plantillas de email",
        "Configuración de remitente",
        "Pruebas de envío"
      ]
    },
    {
      title: "Integraciones",
      description: "APIs y servicios externos",
      icon: Globe,
      items: [
        "API Keys",
        "Webhooks",
        "Pasarelas de pago",
        "Servicios de SMS"
      ]
    }
  ]

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-3xl font-bold flex items-center">
                <Settings className="h-8 w-8 mr-3 text-gray-600" />
                Configuración del Sistema
              </h2>
              <p className="text-muted-foreground">
                Configuración global y ajustes de la plataforma
              </p>
            </div>
          </div>
          <Button>Guardar Cambios</Button>
        </div>

        {/* Grid de configuraciones */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {configSections.map((section, index) => (
            <Card key={index} className="hover:shadow-md transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <section.icon className="h-5 w-5 mr-2" />
                  {section.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuración avanzada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-medium">Mantenimiento</h4>
                <Button variant="outline" className="w-full">Modo Mantenimiento</Button>
                <Button variant="outline" className="w-full">Limpiar Caché</Button>
                <Button variant="outline" className="w-full">Regenerar Thumbnails</Button>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Sistema</h4>
                <Button variant="outline" className="w-full">Ver Logs</Button>
                <Button variant="outline" className="w-full">Estado del Servidor</Button>
                <Button variant="outline" className="w-full">Backup Manual</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}