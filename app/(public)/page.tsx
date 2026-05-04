import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { ValueProps } from '@/components/home/ValueProps'

// SSG — página estática
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'MaderArte — Mueblería de Alto Nivel',
  description:
    'Descubre muebles premium diseñados para durar generaciones. Salas, comedores, recámaras y más con garantía de calidad y asesoría personalizada.',
}

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCategories categories={[]} />
      <ValueProps />
    </>
  )
}

export default HomePage
