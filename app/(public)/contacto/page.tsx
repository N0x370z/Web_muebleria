import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto — MaderArte',
  description: 'Ponte en contacto con nuestros asesores de diseño para consultas, cotizaciones o visitas a nuestro showroom.',
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="font-playfair text-5xl font-bold text-madera-oscura">
          Contáctanos
        </h1>
        <div className="h-1 w-20 bg-dorado-suave mx-auto"></div>
        <p className="font-dm-sans text-lg text-gris-piedra leading-relaxed">
          ¿Tienes algún proyecto en mente o buscas una pieza específica? Nuestro equipo de asesores está listo para ayudarte a encontrar exactamente lo que necesitas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gris-piedra/10">
            <h3 className="font-bold text-madera-oscura text-xl mb-4">Showroom Principal</h3>
            <p className="text-gris-piedra font-dm-sans mb-2">Av. de las Palmas 1234, Lomas de Chapultepec</p>
            <p className="text-gris-piedra font-dm-sans mb-2">Ciudad de México, CDMX 11000</p>
            <p className="text-dorado-suave font-dm-sans mt-4">contacto@maderarte.mx</p>
            <p className="text-dorado-suave font-dm-sans">+52 (55) 1234-5678</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gris-piedra/10">
            <h3 className="font-bold text-madera-oscura text-xl mb-4">Horario de Atención</h3>
            <p className="text-gris-piedra font-dm-sans mb-2">Lunes a Viernes: 10:00 AM - 7:00 PM</p>
            <p className="text-gris-piedra font-dm-sans mb-2">Sábados: 11:00 AM - 5:00 PM</p>
            <p className="text-gris-piedra font-dm-sans">Domingos: Cerrado</p>
          </div>
        </div>
      </div>
    </div>
  )
}
