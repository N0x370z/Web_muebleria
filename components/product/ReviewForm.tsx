'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReviewSchema, ReviewInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      productId,
      rating: 5,
    },
  })

  const rating = watch('rating')

  const onSubmit = async (data: ReviewInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Error al enviar la reseña')
      }

      setIsSuccess(true)
      reset()
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-crema-marfil/30 p-8 rounded-xl border border-gris-piedra/10 text-center">
        <p className="text-sm text-gris-piedra mb-4">Debes iniciar sesión para dejar una reseña.</p>
        <Link href={`/cuenta/login?callbackUrl=/catalogo/producto/${productId}`}>
          <Button variant="secondary" size="sm">Iniciar Sesión</Button>
        </Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-8 rounded-xl border border-green-200 text-center animate-in fade-in zoom-in-95">
        <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-4" />
        <h3 className="font-bold text-madera-oscura mb-2">¡Gracias por tu reseña!</h3>
        <p className="text-sm text-green-700 mb-6">Tu opinión nos ayuda a mejorar y a guiar a otros clientes.</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm">Escribir otra</Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gris-piedra/10 shadow-sm">
      <h3 className="font-playfair text-xl font-bold text-madera-oscura mb-6">Danos tu opinión</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gris-piedra uppercase tracking-wider">Calificación</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setValue('rating', star)}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-dorado-suave text-dorado-suave'
                      : 'text-gris-piedra/20'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-xs text-red-500">{errors.rating.message}</p>}
        </div>

        <Input
          label="Título (opcional)"
          placeholder="Resumen de tu experiencia"
          {...register('title')}
          error={errors.title?.message}
        />

        <div className="space-y-2">
          <label className="text-xs font-bold text-gris-piedra uppercase tracking-wider block">Tu comentario</label>
          <textarea
            className={`w-full p-4 rounded-lg bg-blanco-hueso border transition-all duration-200 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-dorado-suave/20 text-sm
              ${errors.body ? 'border-red-500' : 'border-gris-piedra/20 hover:border-gris-piedra/40'}`}
            placeholder="¿Qué te pareció la calidad, el diseño o el servicio?"
            {...register('body')}
          />
          {errors.body && <p className="text-xs text-red-500">{errors.body.message}</p>}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-xs">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Enviar Reseña
        </Button>
      </form>
    </div>
  )
}
