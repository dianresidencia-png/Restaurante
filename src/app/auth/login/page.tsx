'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestAccount = (testEmail: string, testPassword: string) => {
    form.setValue('email', testEmail)
    form.setValue('password', testPassword)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 p-4">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenido principal */}
      <div className="relative z-10 grid md:grid-cols-2 w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Lado izquierdo - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">

              <h1 className="text-3xl font-bold">Asian Food Hub</h1>
            </div>
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              Every Asian Food<br />in one Hub
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Descubre los mejores sabores asiáticos en un solo lugar.<br />
              Takeaway • Dining • Delivery
            </p>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🥢</span>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Bienvenido</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Inicia sesión en tu cuenta
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="usuario@restaurante.com" 
                            className="h-12 border-gray-300 focus:border-red-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="h-12 border-gray-300 focus:border-red-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold text-lg shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Iniciando sesión...
                      </div>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => router.push('/auth/register')}
                >
                  ¿No tienes cuenta? Regístrate aquí
                </Button>
              </div>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}