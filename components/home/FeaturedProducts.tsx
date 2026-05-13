import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const FeaturedProducts = async () => {
  if (!isDatabaseConfigured()) return null

  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      tags: {
        some: {
          slug: 'mas-vendido'
        }
      }
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { select: { url: true, alt: true }, orderBy: { order: 'asc' }, take: 2 },
      tags: { select: { name: true, slug: true } },
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  if (featuredProducts.length === 0) return null

  const normalizedProducts = featuredProducts.map((p) => ({
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div>
            <h2 className="font-playfair text-4xl font-bold text-madera-oscura mb-4">
              Los Más Vendidos
            </h2>
            <p className="font-dm-sans text-gris-piedra max-w-xl mx-auto md:mx-0">
              Nuestras piezas más icónicas, elegidas por quienes buscan la excelencia en cada detalle de su hogar.
            </p>
          </div>
          <Link 
            href="/catalogo" 
            className="flex items-center justify-center gap-2 text-dorado-suave font-bold uppercase tracking-widest hover:text-madera-oscura transition-colors group"
          >
            Ver Catálogo Completo
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {normalizedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
