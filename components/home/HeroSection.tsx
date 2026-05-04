'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ── Variantes de animación ─────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

// ── Componente ─────────────────────────────────────────────────────

const HeroSection = () => {
  const scrollToContent = () => {
    document.getElementById('featured-categories')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* ── Fondo ── */}
      <div
        className="absolute inset-0 bg-gradient-wood"
        aria-hidden="true"
      />

      {/* ── Patrón decorativo ── */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 50%, #B8935A 0%, transparent 50%),
                           radial-gradient(circle at 75% 20%, #F5EFE0 0%, transparent 40%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Línea dorada decorativa ── */}
      <div
        className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-dorado-suave/40 to-transparent hidden lg:block"
        aria-hidden="true"
      />

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            border border-dorado-suave/40 text-dorado-suave
                            font-courier text-xs tracking-widest uppercase mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-dorado-suave" aria-hidden="true" />
              Colección 2024
            </span>
          </motion.div>

          {/* Título */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="font-playfair text-5xl sm:text-6xl lg:text-7xl xl:text-8xl
                       font-bold text-crema-marfil leading-[1.05] mb-6"
          >
            El Arte de<br />
            <span className="text-dorado-suave italic">vivir bien</span><br />
            comienza aquí.
          </motion.h1>

          {/* Descripción */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
            className="font-dm-sans text-lg text-crema-marfil/70 leading-relaxed mb-10 max-w-xl"
          >
            Muebles de autor diseñados para durar generaciones. Cada pieza es
            una historia de materiales nobles, artesanía y diseño contemporáneo.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/catalogo">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="shadow-gold"
              >
                Explorar Catálogo
              </Button>
            </Link>
            <Link href="/cotizar">
              <Button variant="ghost" size="lg" className="text-crema-marfil/80 hover:text-crema-marfil hover:bg-crema-marfil/10">
                Solicitar Cotización
              </Button>
            </Link>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.65}
            className="flex items-center gap-8 mt-16 pt-8 border-t border-crema-marfil/10"
          >
            {[
              { value: '15+', label: 'Años de experiencia' },
              { value: '2,400+', label: 'Clientes satisfechos' },
              { value: '350+', label: 'Diseños disponibles' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-dorado-suave">
                  {value}
                </span>
                <span className="font-dm-sans text-xs text-crema-marfil/50 mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                   gap-2 text-crema-marfil/40 hover:text-dorado-suave transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
        aria-label="Desplazarse al contenido"
      >
        <span className="font-dm-sans text-xs tracking-widest">Descubrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </motion.div>
      </button>
    </section>
  )
}

export { HeroSection }
