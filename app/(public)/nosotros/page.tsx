import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros — MaderArte',
  description: 'Conoce la historia detrás de MaderArte, nuestra filosofía y nuestro compromiso con la artesanía de lujo en cada mueble.',
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="font-playfair text-5xl font-bold text-madera-oscura">
          Nuestra Historia
        </h1>
        <div className="h-1 w-20 bg-dorado-suave mx-auto"></div>
        <p className="font-dm-sans text-lg text-gris-piedra leading-relaxed">
          MaderArte nació de la pasión por transformar maderas nobles en obras de arte funcionales. Cada pieza que creamos cuenta una historia de tradición, precisión y diseño contemporáneo.
        </p>
        <p className="font-dm-sans text-lg text-gris-piedra leading-relaxed">
          Nuestro equipo de artesanos trabaja incansablemente para asegurar que cada mueble no solo sea estéticamente perfecto, sino que esté construido para durar generaciones.
        </p>
      </div>
    </div>
  )
}
