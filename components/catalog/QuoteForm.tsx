'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuoteSchema, QuoteInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react'

export const QuoteForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(QuoteSchema),
  })


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen')
      }

      setValue('imageUrl', data.url)
      setPreviewUrl(data.url)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (data: QuoteInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Error al enviar la cotización')
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gris-piedra/10 animate-in fade-in zoom-in-95">
        <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="font-playfair text-3xl font-bold text-madera-oscura mb-4">¡Solicitud Enviada!</h2>
        <p className="text-gris-piedra font-dm-sans max-w-md mx-auto mb-8">
          Hemos recibido los detalles de tu cotización. Un experto en diseño se pondrá en contacto contigo muy pronto.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="secondary">
          Enviar otra solicitud
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gris-piedra/10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre completo"
            placeholder="Ej: Sofía García"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="sofia@ejemplo.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <Input
          label="Teléfono (opcional)"
          placeholder="+52 55 0000 0000"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-madera-oscura font-dm-sans">
            ¿En qué podemos ayudarte?
          </label>
          <textarea
            className={`w-full p-4 rounded-lg bg-blanco-hueso border transition-all duration-200 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-dorado-suave/20
              ${errors.message ? 'border-red-500' : 'border-gris-piedra/20 hover:border-gris-piedra/40'}`}
            placeholder="Cuéntanos sobre el mueble o proyecto que tienes en mente..."
            {...register('message')}
          />
          {errors.message && (
            <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-madera-oscura font-dm-sans block">
            Referencia visual (opcional)
          </label>
          
          <div className="flex flex-wrap gap-4 items-start">
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-crema-marfil border border-gris-piedra/20 rounded-lg hover:bg-crema-marfil/70 transition-colors">
                <Upload className="h-4 w-4 text-madera-oscura" />
                <span className="text-xs font-bold text-madera-oscura uppercase tracking-wider">
                  {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>

            {previewUrl && (
              <div className="relative h-20 w-20 rounded-lg border border-gris-piedra/10 overflow-hidden group">
                <Image 
                  src={previewUrl} 
                  alt="Vista previa" 
                  fill
                  className="object-cover" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null)
                    setValue('imageUrl', '')
                  }}
                  className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <AlertCircle className="h-5 w-5" />
                </button>
              </div>
            )}

            {!previewUrl && (
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gris-piedra/20 flex flex-col items-center justify-center text-gris-piedra/40">
                <ImageIcon className="h-6 w-6 mb-1" />
                <span className="text-[10px] uppercase font-bold">Imagen</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
          disabled={uploadingImage}
        >
          Solicitar Cotización
        </Button>
      </form>
    </div>
  )
}
