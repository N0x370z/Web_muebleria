'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico no válido'),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactInput = z.infer<typeof contactSchema>

export const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactInput) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulando envío de correo o API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
      reset()
    } catch {
      setError('Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-gris-piedra/10 shadow-sm text-center animate-in fade-in zoom-in-95">
        <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-playfair text-2xl font-bold text-madera-oscura mb-2">¡Mensaje Enviado!</h3>
        <p className="text-gris-piedra font-dm-sans mb-8">
          Gracias por contactarnos. Un asesor se pondrá en contacto contigo a la brevedad.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="secondary">
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl border border-gris-piedra/10 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Nombre completo" 
            placeholder="Ej: Juan Pérez"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input 
            label="Correo electrónico" 
            type="email" 
            placeholder="juan@ejemplo.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        <Input 
          label="Asunto" 
          placeholder="¿En qué podemos ayudarte?"
          {...register('subject')}
          error={errors.subject?.message}
        />
        <div className="space-y-2">
          <label className="text-sm font-bold text-madera-oscura font-dm-sans">Mensaje</label>
          <textarea
            className={`w-full p-4 rounded-lg bg-blanco-hueso border transition-all duration-200 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-dorado-suave/20
              ${errors.message ? 'border-red-500' : 'border-gris-piedra/20 hover:border-gris-piedra/40'}`}
            placeholder="Escribe tu mensaje aquí..."
            {...register('message')}
          />
          {errors.message && (
            <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
          leftIcon={<Send className="h-4 w-4" />}
        >
          Enviar Mensaje
        </Button>
      </form>
    </div>
  )
}
