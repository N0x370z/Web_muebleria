import { Metadata } from 'next'
import { ContactForm } from '@/components/layout/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Contacto — MaderArte',
  description: 'Ponte en contacto con nuestros asesores de diseño para consultas, cotizaciones o visitas a nuestro showroom.',
}

export default function ContactPage() {
  return (
    <div className="bg-blanco-hueso min-h-screen">
      {/* Header */}
      <section className="bg-madera-oscura py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-crema-marfil mb-6">
            Estamos para <span className="text-dorado-suave">escucharte</span>
          </h1>
          <p className="font-dm-sans text-lg text-crema-marfil/70 max-w-2xl mx-auto">
            Ya sea que busques una pieza de catálogo o un proyecto a medida, nuestro equipo está listo para brindarte la asesoría que mereces.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-madera-oscura mb-8 text-center lg:text-left">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 bg-white rounded-xl shadow-sm border border-gris-piedra/10 flex items-center justify-center text-dorado-suave">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-madera-oscura mb-1">Showroom Principal</h3>
                    <p className="text-sm text-gris-piedra leading-relaxed">
                      Av. de las Palmas 1234, Lomas de Chapultepec<br />
                      Ciudad de México, CDMX 11000
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 bg-white rounded-xl shadow-sm border border-gris-piedra/10 flex items-center justify-center text-dorado-suave">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-madera-oscura mb-1">Teléfono</h3>
                    <p className="text-sm text-gris-piedra leading-relaxed">
                      +52 (55) 1234-5678<br />
                      Lunes a Viernes, 10:00 - 19:00
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 bg-white rounded-xl shadow-sm border border-gris-piedra/10 flex items-center justify-center text-dorado-suave">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-madera-oscura mb-1">Correo Electrónico</h3>
                    <p className="text-sm text-gris-piedra leading-relaxed">
                      contacto@maderarte.mx<br />
                      ventas@maderarte.mx
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 bg-white rounded-xl shadow-sm border border-gris-piedra/10 flex items-center justify-center text-dorado-suave">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-madera-oscura mb-1">Horarios</h3>
                    <p className="text-sm text-gris-piedra leading-relaxed">
                      Sábados: 11:00 - 17:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video w-full bg-crema-marfil rounded-2xl border border-gris-piedra/10 overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500">
               <Image 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" 
                alt="Mapa de ubicación"
                fill
                className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-dorado-suave" />
                    <span className="text-xs font-bold text-madera-oscura uppercase tracking-widest">Abrir en Google Maps</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
