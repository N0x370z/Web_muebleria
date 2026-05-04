import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cuenta/'],
    },
    sitemap: `${process.env.NEXTAUTH_URL}/sitemap.xml`,
  }
}
