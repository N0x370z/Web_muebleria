import { Metadata } from 'next'
import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  if (!isDatabaseConfigured()) return {}

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post) return {}

  return {
    title: `${post.title} | MaderArte Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  if (!isDatabaseConfigured()) {
    notFound()
  }

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <article className="bg-blanco-hueso min-h-screen pb-20">
      {/* Header */}
      <header className="relative py-16 md:py-24 bg-madera-oscura overflow-hidden">
        {post.coverImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            <Image src={post.coverImage} alt="" fill className="object-cover blur-sm" />
          </div>
        )}
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-crema-marfil/60 hover:text-dorado-suave transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>

          <div className="mb-6">
            <span className="bg-dorado-suave text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              {post.category.replace('_', ' ')}
            </span>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-crema-marfil leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-crema-marfil/70 font-dm-sans">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-crema-marfil/10 flex items-center justify-center">
                <User className="h-5 w-5 text-dorado-suave" />
              </div>
              <div>
                <p className="text-crema-marfil font-bold text-xs uppercase tracking-wider">{post.author}</p>
                <p className="text-[10px]">Autor Principal</p>
              </div>
            </div>

            <div className="h-8 w-px bg-crema-marfil/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-dorado-suave" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-dorado-suave" />
              <span>{post.readingTime} min de lectura</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 md:-mt-16 relative z-20">
        <div className="bg-white rounded-2xl p-8 md:p-16 shadow-xl border border-gris-piedra/10">
          {post.coverImage && (
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-12 shadow-card">
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill
                className="object-cover" 
              />
            </div>
          )}

          <div 
            className="prose prose-lg prose-headings:font-playfair prose-headings:text-madera-oscura prose-p:text-gris-piedra prose-p:font-dm-sans max-w-none
                       prose-a:text-dorado-suave hover:prose-a:text-madera-oscura transition-colors"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-crema-marfil flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-gris-piedra uppercase bg-crema-marfil px-3 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-madera-oscura uppercase tracking-widest">Compartir:</span>
              <button className="h-8 w-8 rounded-full bg-crema-marfil flex items-center justify-center hover:bg-dorado-suave hover:text-white transition-all">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Next Post / Related - Placeholder */}
        <div className="mt-16 bg-madera-oscura rounded-2xl p-10 text-center text-crema-marfil border border-dorado-suave/20 shadow-xl">
          <h3 className="font-playfair text-2xl font-bold mb-4">¿Te gustó este artículo?</h3>
          <p className="font-dm-sans text-crema-marfil/70 mb-8 max-w-lg mx-auto">
            Suscríbete a nuestra newsletter para recibir consejos de diseño, ofertas exclusivas y novedades de MaderArte directamente en tu bandeja de entrada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="flex-1 px-4 py-3 rounded-lg bg-crema-marfil/10 border border-crema-marfil/20 focus:outline-none focus:ring-2 focus:ring-dorado-suave text-white text-sm"
            />
            <button className="bg-dorado-suave hover:bg-dorado-suave/80 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
