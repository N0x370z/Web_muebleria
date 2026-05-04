import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Courier_Prime } from 'next/font/google'
import '@/styles/globals.css'

// ── Tipografías MaderArte (Google Fonts) ──────────────────────────
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
})

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-courier',
  weight: ['400', '700'],
})

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

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${courierPrime.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
