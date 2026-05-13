import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/AuthProvider'
import '@/styles/globals.css'

// ── Metadata base ─────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? 'https://maderarte.com'
  ),
  title: {
    default: 'MaderArte — Mueblería de Alto Nivel',
    template: '%s | MaderArte',
  },
  description:
    'Mueblería premium con diseños exclusivos, materiales de alta calidad y experiencia de compra personalizada. Descubre nuestra colección de salas, comedores, recámaras y más.',
  keywords: [
    'mueblería',
    'muebles premium',
    'muebles de madera',
    'decoración de interiores',
    'muebles a medida',
    'maderarte',
  ],
  authors: [{ name: 'MaderArte' }],
  creator: 'MaderArte',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'MaderArte',
    title: 'MaderArte — Mueblería de Alto Nivel',
    description:
      'Diseño, calidad y experiencia de compra premium. Muebles que cuentan historias.',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'MaderArte — Mueblería Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MaderArte — Mueblería de Alto Nivel',
    description: 'Muebles premium, diseño exclusivo y atención personalizada.',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-dm-sans bg-blanco-hueso text-madera-oscura antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
