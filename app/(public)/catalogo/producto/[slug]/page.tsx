import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { Badge } from '@/components/ui/Badge'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { StarRating } from '@/components/ui/StarRating'
import { ReviewForm } from '@/components/product/ReviewForm'
import type { Product, ProductImage } from '@/types'

// Revalidar cada hora (ISR)
export const revalidate = 3600

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) return { title: 'Producto no encontrado' }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
      tags: true,
      reviews: {
        where: { isVisible: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) notFound()

  const reviews = product.reviews
  const averageRating = reviews.length > 0 
    ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0

  const mainImage = product.images[0] as ProductImage | undefined
  const isOnSale = product.comparePrice !== null && product.comparePrice > product.price
  
  const normalizedProduct: Product = {
    ...product,
    comparePrice: product.comparePrice ?? undefined,
    category: {
      id: product.category.id,
      slug: product.category.slug,
      name: product.category.name,
      order: product.category.order,
      description: product.category.description ?? undefined,
      imageUrl: product.category.imageUrl ?? undefined,
    },
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images.map(img => ({ ...img })),
    variants: product.variants.map(v => ({ 
      ...v, 
      type: v.type as 'color' | 'material' | 'acabado',
      imageUrl: v.imageUrl ?? undefined
    })),
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Migas de pan */}
      <nav className="flex items-center text-sm font-dm-sans text-gris-piedra mb-8">
        <Link href="/" className="hover:text-dorado-suave transition-colors">Inicio</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/catalogo" className="hover:text-dorado-suave transition-colors">Catálogo</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={`/catalogo/${product.category.slug}`} className="hover:text-dorado-suave transition-colors">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-crema-marfil rounded-xl overflow-hidden shadow-sm">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <ImagePlaceholder aspectRatio="square" label={product.name} className="absolute inset-0 h-full" />
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isOnSale && (
                <Badge variant="danger">Oferta</Badge>
              )}
              {product.tags.map(tag => (
                <Badge key={tag.id} variant="dark">{tag.name}</Badge>
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {product.images.map((img) => (
                <div key={img.id} className="relative w-24 h-24 bg-crema-marfil rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border border-gris-piedra/10 opacity-70 hover:opacity-100 transition-opacity">
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalles del producto */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={averageRating} size={14} />
            <span className="text-xs font-bold text-gris-piedra uppercase tracking-wider">
              {reviews.length} {reviews.length === 1 ? 'Reseña' : 'Reseñas'}
            </span>
          </div>

          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-madera-oscura mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-end gap-4 mb-6">
            <span className="text-2xl font-bold text-madera-oscura">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.price)}
            </span>
            {isOnSale && (
              <span className="text-lg text-gris-piedra line-through mb-0.5">
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(product.comparePrice!)}
              </span>
            )}
          </div>

          <div className="prose prose-sm text-gris-piedra font-dm-sans mb-8">
            <p>{product.description}</p>
          </div>

          {/* Variantes */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-madera-oscura mb-3">Variantes disponibles:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Badge key={v.id} variant="outline" className="text-sm py-1.5">
                    {v.label}: {v.value} {v.priceModifier > 0 && `(+${v.priceModifier})`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto space-y-4 pt-8 border-t border-gris-piedra/20">
            <AddToCartButton product={normalizedProduct} />
            
            <p className="text-sm text-center text-gris-piedra font-dm-sans">
              Envío calculado en el checkout. 
              <br />Garantía de 1 año en defectos de fábrica.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <section className="pt-16 border-t border-gris-piedra/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Resumen y Formulario */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-madera-oscura mb-2">Opiniones de clientes</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-5xl font-bold text-madera-oscura">{averageRating > 0 ? averageRating.toFixed(1) : '—'}</span>
                  <StarRating rating={averageRating} size={20} className="mt-1" />
                </div>
                <div className="text-sm text-gris-piedra">
                  Basado en {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                </div>
              </div>
            </div>

            <ReviewForm productId={product.id} />
          </div>

          {/* Lista de Reseñas */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-xl border border-gris-piedra/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating rating={review.rating} size={14} />
                          <span className="text-sm font-bold text-madera-oscura">{review.title}</span>
                        </div>
                        <p className="text-xs text-gris-piedra font-medium">
                          Por {review.user.name} • {new Date(review.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gris-piedra leading-relaxed italic">
                      &quot;{review.body}&quot;
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-crema-marfil/20 rounded-2xl p-12 text-center border border-dashed border-gris-piedra/10">
                  <p className="text-gris-piedra font-dm-sans">Aún no hay reseñas para este producto. ¡Sé el primero en compartir tu experiencia!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

