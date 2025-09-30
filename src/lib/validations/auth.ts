import { z } from 'zod'

// Expresiones regulares para validaciones
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .regex(EMAIL_REGEX, 'Formato de email incorrecto'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
})

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(NAME_REGEX, 'El nombre solo puede contener letras y espacios'),
  email: z.string()
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .regex(EMAIL_REGEX, 'Formato de email incorrecto')
    .max(100, 'El email es demasiado largo'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(PASSWORD_REGEX, {
      message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
    }),
  confirmPassword: z.string()
    .min(1, 'Confirma tu contraseña'),
  role: z.enum(['CLIENTE', 'MESERO', 'CHEF', 'SUPERVISOR', 'GERENTE', 'SUPER_ADMIN'])
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

export const passwordRequirements = [
  { text: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
  { text: 'Al menos 1 letra mayúscula', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { text: 'Al menos 1 letra minúscula', test: (pwd: string) => /[a-z]/.test(pwd) },
  { text: 'Al menos 1 número', test: (pwd: string) => /\d/.test(pwd) },
  { text: 'Al menos 1 carácter especial (@$!%*?&)', test: (pwd: string) => /[@$!%*?&]/.test(pwd) }
]