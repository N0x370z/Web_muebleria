import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BlogCard } from '@/components/blog/BlogCard'
import { Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog e Inspiración | MaderArte',
  description: 'Descubre tendencias en decoración, guías de cuidado para tus muebles y consejos de diseño de interiores.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="bg-blanco-hueso min-h-screen">
      {/* Header Section */}
      <section className="bg-madera-oscura py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-crema-marfil mb-6">
            Inspiración y <span className="text-dorado-suave">Diseño</span>
          </h1>
          <p className="font-dm-sans text-lg text-crema-marfil/70 max-w-2xl mx-auto">
            Explora nuestro blog para encontrar las últimas tendencias en interiorismo, guías de compra y secretos para el cuidado de la madera.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gris-piedra/20">
            <Newspaper className="h-12 w-12 text-gris-piedra/30 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-madera-oscura mb-2">Próximamente</h2>
            <p className="text-gris-piedra max-w-sm mx-auto">
              Estamos preparando artículos exclusivos para ti. Vuelve pronto para descubrir nuevas historias.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
