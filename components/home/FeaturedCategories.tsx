'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// ── Tipos ──────────────────────────────────────────────────────────

interface Category {
  slug: string
  name: string
  description: string
  imageUrl: string
  count?: number
}

interface FeaturedCategoriesProps {
  categories: Category[]
}

// ── Datos de ejemplo (se reemplazarán con datos de Prisma en ISR) ──

const PLACEHOLDER_CATEGORIES: Category[] = [
  {
    slug: 'salas',
    name: 'Salas',
    description: 'El centro de tu hogar',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    count: 48,
  },
  {
    slug: 'comedores',
    name: 'Comedores',
    description: 'Donde los momentos se comparten',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
    count: 32,
  },
  {
    slug: 'recamaras',
    name: 'Recámaras',
    description: 'Tu refugio personal',
    imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
    count: 56,
  },
  {
    slug: 'oficinas',
    name: 'Oficinas',
    description: 'Diseño que inspira productividad',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&q=80',
    count: 24,
  },
]

// ── Variantes de animación ─────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ── Componente ─────────────────────────────────────────────────────

const FeaturedCategories = ({
  categories = PLACEHOLDER_CATEGORIES,
}: FeaturedCategoriesProps) => {
  return (
    <section
      id="featured-categories"
      className="py-20 lg:py-28 bg-blanco-hueso"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Encabezado ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="font-courier text-xs tracking-widest text-dorado-suave uppercase">
            Nuestra colección
          </span>
          <h2
            id="categories-heading"
            className="section-title mt-3 mb-4"
          >
            Espacios que inspiran
          </h2>
          <div className="divider-gold mx-auto" aria-hidden="true" />
          <p className="section-subtitle mt-6 max-w-2xl mx-auto">
            Cada ambiente de tu hogar merece un diseño pensado para ti.
            Explora nuestras colecciones y encuentra tu estilo.
          </p>
        </motion.div>

        {/* ── Grid de categorías ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map((category) => (
            <motion.div key={category.slug} variants={cardVariants}>
              <Link
                href={`/catalogo/${category.slug}`}
                className="group relative block overflow-hidden rounded-xl aspect-[4/5]
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-dorado-suave"
                aria-label={`Ver categoría ${category.name}`}
              >
                {/* Imagen */}
                <Image
                  src={category.imageUrl}
                  alt={`Colección de ${category.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700
                             group-hover:scale-105"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-madera-oscura/80
                             via-madera-oscura/20 to-transparent
                             group-hover:from-madera-oscura/90 transition-all duration-300"
                  aria-hidden="true"
                />

                {/* Contenido */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  {category.count && (
                    <span className="font-courier text-[10px] tracking-widest
                                    text-dorado-suave uppercase mb-2 block">
                      {category.count} diseños
                    </span>
                  )}
                  <h3 className="font-playfair text-xl font-bold text-crema-marfil">
                    {category.name}
                  </h3>
                  <p className="font-dm-sans text-sm text-crema-marfil/70 mt-1">
                    {category.description}
                  </p>

                  {/* CTA hover */}
                  <div
                    className="flex items-center gap-1.5 mt-3 text-dorado-suave
                               font-dm-sans text-sm font-medium
                               translate-y-4 opacity-0 group-hover:translate-y-0
                               group-hover:opacity-100 transition-all duration-300"
                  >
                    Explorar
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export { FeaturedCategories }
