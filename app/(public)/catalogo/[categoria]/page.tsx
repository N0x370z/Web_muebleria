import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import type { Prisma } from '@prisma/client'

export const revalidate = 3600

interface CategoryPageProps {
  params: { categoria: string }
  searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.categoria },
  })

  if (!category) return { title: 'Categoría no encontrada' }

  return {
    title: `${category.name} — Muebles Premium`,
    description: category.description || `Explora nuestra colección de ${category.name.toLowerCase()}.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.categoria },
  })

  if (!category) notFound()

  const allCategories = await prisma.category.findMany({
    select: { slug: true, name: true },
    orderBy: { order: 'asc' },
  })

  // Build Prisma where clause from search params
  const sort = (searchParams.sort as string) || 'newest'
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const inStock = searchParams.inStock === 'true'

  const priceFilter = 
    minPrice !== undefined || maxPrice !== undefined
      ? {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        }
      : undefined

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    categoryId: category.id,
    ...(priceFilter && { price: priceFilter }),
    ...(inStock && { stock: { gt: 0 } }),
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case 'price_asc': return { price: 'asc' as const }
      case 'price_desc': return { price: 'desc' as const }
      case 'best_seller': return { orderItems: { _count: 'desc' as const } }
      default: return { createdAt: 'desc' as const }
    }
  })()

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, slug: true, name: true } },
      images: { select: { url: true, alt: true }, orderBy: { order: 'asc' }, take: 2 },
      tags: { select: { name: true, slug: true } },
    },
    orderBy,
  })

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
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm font-dm-sans text-gris-piedra mb-8">
        <Link href="/" className="hover:text-dorado-suave transition-colors">Inicio</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/catalogo" className="hover:text-dorado-suave transition-colors">Catálogo</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-madera-oscura font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-madera-oscura mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="font-dm-sans text-gris-piedra max-w-2xl">
            {category.description}
          </p>
        )}
        <p className="text-sm text-gris-piedra mt-2 font-dm-sans">
          {normalizedProducts.length} {normalizedProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      {/* Grid with sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-xl border border-gris-piedra/10 shadow-sm">
            <Suspense fallback={<div className="text-sm text-gris-piedra">Cargando filtros…</div>}>
              <CatalogFilters
                currentCategory={params.categoria}
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
              <p className="text-gris-piedra font-dm-sans text-lg mb-2">
                No se encontraron productos con estos filtros.
              </p>
              <p className="text-sm text-gris-piedra">
                Intenta ajustar los criterios de búsqueda o{' '}
                <Link href={`/catalogo/${params.categoria}`} className="text-dorado-suave hover:underline font-medium">
                  limpia los filtros
                </Link>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
