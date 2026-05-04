import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://maderarte.com'

  // Rutas estáticas
  const staticRoutes = [
    '',
    '/catalogo',
    '/nosotros',
    '/blog',
    '/cotizar',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Rutas dinámicas: Productos
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })
  
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/catalogo/producto/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Rutas dinámicas: Blog
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Rutas dinámicas: Categorías
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/catalogo/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...categoryRoutes]
}
