import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import type { Prisma } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Catálogo de Muebles',
  description: 'Explora nuestra colección completa de muebles premium. Salas, comedores, recámaras y decoración.',
}

export const revalidate = 3600

interface CatalogoPageProps {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const db = isDatabaseConfigured()

  const allCategories = db
    ? await prisma.category.findMany({
        select: { slug: true, name: true },
        orderBy: { order: 'asc' },
      })
    : []

  // Build Prisma where clause from search params
  const sort = (searchParams.sort as string) || 'newest'
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const inStock = searchParams.inStock === 'true'
  const searchQuery = searchParams.q as string | undefined

  const priceFilter = 
    minPrice !== undefined || maxPrice !== undefined
      ? {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        }
      : undefined

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(priceFilter && { price: priceFilter }),
    ...(inStock && { stock: { gt: 0 } }),
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ],
    }),
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'price_asc': return { price: 'asc' as const }
      case 'price_desc': return { price: 'desc' as const }
      case 'best_seller': return { orderItems: { _count: 'desc' as const } }
      default: return { createdAt: 'desc' as const }
    }
  })()

  const products = db
    ? await prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, slug: true, name: true } },
          images: { select: { url: true, alt: true }, orderBy: { order: 'asc' }, take: 2 },
          tags: { select: { name: true, slug: true } },
        },
        orderBy,
      })
    : []

  const normalizedProducts = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    comparePrice: p.comparePrice ?? undefined,
    stock: p.stock,
    isCustomizable: p.isCustomizable,
    category: p.category,
    images: p.images,
    tags: p.tags,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-madera-oscura mb-4">
          Catálogo Completo
        </h1>
        <p className="font-dm-sans text-gris-piedra max-w-2xl">
          Descubre nuestra selección exclusiva de muebles. Diseño, funcionalidad y calidad premium para cada espacio de tu hogar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-xl border border-gris-piedra/10 shadow-sm">
            <Suspense fallback={<div className="text-sm text-gris-piedra">Cargando filtros…</div>}>
              <CatalogFilters
                categories={allCategories}
              />
            </Suspense>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {normalizedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {normalizedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gris-piedra/20">
              <p className="text-gris-piedra font-dm-sans text-lg">No hay productos disponibles por el momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
