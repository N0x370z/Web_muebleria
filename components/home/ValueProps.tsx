'use client'

import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Palette, MessageSquare } from 'lucide-react'

// ── Tipos ──────────────────────────────────────────────────────────

interface ValueProp {
  icon: React.ReactNode
  title: string
  description: string
}

// ── Datos ──────────────────────────────────────────────────────────

const VALUE_PROPS: ValueProp[] = [
  {
    icon: <Truck className="h-7 w-7" />,
    title: 'Envío a domicilio',
    description:
      'Entregamos tu mobiliario con cuidado en toda la república. Envío gratuito en compras mayores a $8,000 MXN.',
  },
  {
    icon: <ShieldCheck className="h-7 w-7" />,
    title: 'Garantía de calidad',
    description:
      'Todos nuestros muebles incluyen garantía de 2 años contra defectos de fabricación.',
  },
  {
    icon: <Palette className="h-7 w-7" />,
    title: 'Personalización',
    description:
      'Adaptamos dimensiones, materiales y acabados a tus necesidades. Tu mueble, tu estilo.',
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: 'Asesoría gratuita',
    description:
      'Nuestros diseñadores te acompañan para elegir los muebles perfectos para tu espacio.',
  },
]

// ── Variantes ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// ── Componente ─────────────────────────────────────────────────────

const ValueProps = () => {
  return (
    <section
      className="py-16 bg-madera-oscura"
      aria-labelledby="value-props-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="value-props-heading" className="sr-only">
          Por qué elegir MaderArte
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-crema-marfil/10"
          role="list"
        >
          {VALUE_PROPS.map(({ icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="bg-madera-oscura p-8 flex flex-col items-start gap-4"
              role="listitem"
            >
              <div
                className="p-3 rounded-lg bg-dorado-suave/10 text-dorado-suave"
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <h3 className="font-playfair text-lg font-semibold text-crema-marfil mb-2">
                  {title}
                </h3>
                <p className="font-dm-sans text-sm text-crema-marfil/60 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export { ValueProps }
