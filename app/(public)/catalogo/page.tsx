import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/catalog/ProductCard'

export const metadata: Metadata = {
  title: 'Catálogo de Muebles',
  description: 'Explora nuestra colección completa de muebles premium. Salas, comedores, recámaras y decoración.',
}

// Para forzar validación de la página estática si es necesario (ISR)
export const revalidate = 3600

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: { select: { id: true, slug: true, name: true } },
      images: { select: { url: true, alt: true }, orderBy: { order: 'asc' }, take: 2 },
      tags: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Normalizar los datos para que coincidan con ProductCardType
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

      {normalizedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {normalizedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gris-piedra font-dm-sans text-lg">No hay productos disponibles por el momento.</p>
        </div>
      )}
    </div>
  )
}
