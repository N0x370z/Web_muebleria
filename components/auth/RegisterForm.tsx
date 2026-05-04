'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { RegisterSchema, RegisterInput } from '@/lib/validations'

export const RegisterForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Ocurrió un error durante el registro')
      } else {
        router.push('/cuenta/login?registered=true')
      }
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-8 bg-white rounded-xl shadow-sm border border-gris-piedra/10">
      <div className="text-center space-y-2">
        <h1 className="font-playfair text-3xl font-bold text-madera-oscura">Crea tu cuenta</h1>
        <p className="text-gris-piedra font-dm-sans">Únete a la experiencia MaderArte</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          {...register('name')}
          error={errors.name?.message}
          leftIcon={<User className="w-4 h-4" />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
          leftIcon={<Lock className="w-4 h-4" />}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        {error && (
          <p className="text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Registrarse
        </Button>
      </form>

      <p className="text-center text-sm text-gris-piedra font-dm-sans">
        ¿Ya tienes una cuenta?{' '}
        <Link
          href="/cuenta/login"
          className="text-dorado-suave hover:text-madera-oscura font-medium transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
