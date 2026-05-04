import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User } from 'lucide-react'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

interface BlogCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    coverImage?: string | null
    author: string
    publishedAt: Date | null
    readingTime: number
    category: string
  }
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Borrador'

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gris-piedra/10 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/9] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder aspectRatio="16/9" />
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-dorado-suave text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {post.category.replace('_', ' ')}
          </span>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-[10px] text-gris-piedra font-bold uppercase tracking-wider mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-playfair text-xl font-bold text-madera-oscura mb-3 group-hover:text-dorado-suave transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gris-piedra font-dm-sans line-clamp-3 mb-6">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-crema-marfil flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-crema-marfil flex items-center justify-center">
              <User className="h-3 w-3 text-gris-piedra" />
            </div>
            <span className="text-xs font-medium text-madera-oscura">{post.author}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-dorado-suave hover:text-madera-oscura transition-colors uppercase tracking-widest"
          >
            Leer más →
          </Link>
        </div>
      </div>
    </article>
  )
}
