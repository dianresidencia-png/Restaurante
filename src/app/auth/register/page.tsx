'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { registerSchema, passwordRequirements, type RegisterFormData } from '@/lib/validations/auth'

interface PasswordRequirement {
  text: string
  test: (pwd: string) => boolean
}

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      // ❌ NO incluir role - se asigna automáticamente como CLIENTE
    }
  })

  const passwordValue = form.watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('¡Cuenta creada exitosamente! Redirigiendo...')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        setError(result.error || 'Error al registrar usuario')
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Registrarse
            </CardTitle>
            <CardDescription className="text-gray-600">
              Crea tu cuenta para hacer pedidos en el restaurante
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="cliente@ejemplo.com" {...field} />
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
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                      
                      {/* Indicadores de fortaleza de contraseña */}
                      {passwordValue && (
                        <div className="mt-2 space-y-1">
                          {passwordRequirements.map((req: PasswordRequirement, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                req.test(passwordValue) ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                              <span className={`text-xs ${
                                req.test(passwordValue) ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta ...' : 'Registrarse'}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => router.push('/auth/login')}
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}