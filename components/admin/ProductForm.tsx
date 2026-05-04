'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductCreateSchema, ProductCreateInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Package, Plus, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryOption {
  id: string
  name: string
}

export const ProductForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [variants, setVariants] = useState<Array<{
    type: string
    label: string
    value: string
    priceModifier: number
    stock: number
  }>>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductCreateInput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: {
      stock: 0,
      isCustomizable: false,
    },
  })

  const nameValue = watch('name')

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [nameValue, setValue])

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImageUrls(prev => [...prev, data.url])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al subir imagen'
      setError(message)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { type: 'material', label: '', value: '', priceModifier: 0, stock: 0 }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: string | number) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const onSubmit = async (data: ProductCreateInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const payload = {
        ...data,
        images: imageUrls.map((url, i) => ({ url, alt: data.name, order: i })),
        variants: variants.filter(v => v.label && v.value),
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || 'Error al crear producto')
      }

      router.push('/admin/productos')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/productos" className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-gris-piedra">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-playfair text-3xl font-bold text-madera-oscura">Nuevo Producto</h1>
          <p className="text-gris-piedra font-dm-sans text-sm">Completa los campos para agregar un producto al catálogo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic info */}
        <section className="bg-white p-8 rounded-xl border border-gris-piedra/10 shadow-sm space-y-6">
          <h2 className="font-bold text-madera-oscura flex items-center gap-2">
            <Package size={18} className="text-dorado-suave" />
            Información básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre del producto"
              placeholder="Ej: Sofá Esquinero Venecia"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Slug (URL)"
              placeholder="sofa-esquinero-venecia"
              {...register('slug')}
              error={errors.slug?.message}
              hint="Se genera automáticamente desde el nombre"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-madera-oscura font-dm-sans block mb-1.5">
              Descripción
            </label>
            <textarea
              className={`w-full p-4 rounded-lg bg-blanco-hueso border transition-all duration-200 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-dorado-suave/20 text-sm
                ${errors.description ? 'border-red-500' : 'border-gris-piedra/20 hover:border-gris-piedra/40'}`}
              placeholder="Descripción detallada del producto..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Precio (MXN)"
              type="number"
              step="0.01"
              placeholder="28500"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />
            <Input
              label="Precio anterior (opcional)"
              type="number"
              step="0.01"
              placeholder="34000"
              {...register('comparePrice', { valueAsNumber: true })}
              error={errors.comparePrice?.message}
            />
            <Input
              label="Stock"
              type="number"
              placeholder="10"
              {...register('stock', { valueAsNumber: true })}
              error={errors.stock?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-madera-oscura font-dm-sans block mb-1.5">
                Categoría
              </label>
              <select
                className="w-full p-3 rounded-lg bg-blanco-hueso border border-gris-piedra/20 focus:outline-none focus:ring-2 focus:ring-dorado-suave/20 text-sm"
                {...register('categoryId')}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('isCustomizable')}
                />
                <div className="h-5 w-5 rounded border-2 border-gris-piedra/30 peer-checked:bg-dorado-suave peer-checked:border-dorado-suave flex items-center justify-center transition-all">
                  <svg className="h-3 w-3 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gris-piedra group-hover:text-madera-oscura transition-colors">
                  Producto personalizable
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white p-8 rounded-xl border border-gris-piedra/10 shadow-sm space-y-6">
          <h2 className="font-bold text-madera-oscura">Imágenes</h2>
          <div className="flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative h-24 w-24 rounded-lg border border-gris-piedra/10 overflow-hidden group">
                <Image src={url} alt={`Imagen ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 text-[8px] bg-dorado-suave text-white px-1.5 py-0.5 rounded font-bold uppercase">Principal</span>
                )}
              </div>
            ))}
            <label className="cursor-pointer">
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gris-piedra/20 hover:border-dorado-suave/50 flex flex-col items-center justify-center text-gris-piedra/40 hover:text-dorado-suave transition-all">
                <Upload size={20} />
                <span className="text-[8px] font-bold uppercase mt-1">
                  {uploadingImage ? 'Subiendo...' : 'Agregar'}
                </span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        </section>

        {/* Variants */}
        <section className="bg-white p-8 rounded-xl border border-gris-piedra/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-madera-oscura">Variantes</h2>
            <Button type="button" variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={addVariant}>
              Agregar variante
            </Button>
          </div>

          {variants.length === 0 && (
            <p className="text-sm text-gris-piedra italic py-4 text-center">
              Sin variantes. El producto se venderá como configuración única.
            </p>
          )}

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-blanco-hueso rounded-lg">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest block mb-1">Tipo</label>
                  <select
                    value={variant.type}
                    onChange={(e) => updateVariant(index, 'type', e.target.value)}
                    className="w-full p-2 rounded border border-gris-piedra/20 text-sm bg-white"
                  >
                    <option value="material">Material</option>
                    <option value="color">Color</option>
                    <option value="acabado">Acabado</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest block mb-1">Etiqueta</label>
                  <input
                    value={variant.label}
                    onChange={(e) => updateVariant(index, 'label', e.target.value)}
                    placeholder="Lino Gris"
                    className="w-full p-2 rounded border border-gris-piedra/20 text-sm bg-white"
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest block mb-1">Valor</label>
                  <input
                    value={variant.value}
                    onChange={(e) => updateVariant(index, 'value', e.target.value)}
                    placeholder="lino-gris"
                    className="w-full p-2 rounded border border-gris-piedra/20 text-sm bg-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest block mb-1">+Precio</label>
                  <input
                    type="number"
                    value={variant.priceModifier}
                    onChange={(e) => updateVariant(index, 'priceModifier', Number(e.target.value))}
                    className="w-full p-2 rounded border border-gris-piedra/20 text-sm bg-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest block mb-1">Stock</label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                    className="w-full p-2 rounded border border-gris-piedra/20 text-sm bg-white"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/productos">
            <Button type="button" variant="ghost">Cancelar</Button>
          </Link>
          <Button type="submit" isLoading={isLoading} className="px-12">
            Crear Producto
          </Button>
        </div>
      </form>
    </div>
  )
}
