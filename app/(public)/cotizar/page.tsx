import { Metadata } from 'next'
import { QuoteForm } from '@/components/catalog/QuoteForm'
import { MessageSquare, Clock, ShieldCheck, PenTool } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cotizaciones Personalizadas | MaderArte',
  description: 'Solicita una cotización para tus proyectos de muebles a medida. Expertos en diseño y calidad premium.',
}

const BENEFIT_ITEMS = [
  {
    icon: <Clock className="h-6 w-6 text-dorado-suave" />,
    title: 'Respuesta Rápida',
    description: 'Recibe una propuesta detallada en menos de 48 horas hábiles.',
  },
  {
    icon: <PenTool className="h-6 w-6 text-dorado-suave" />,
    title: 'Diseño a Medida',
    description: 'Adaptamos dimensiones, materiales y acabados a tu espacio.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-dorado-suave" />,
    title: 'Garantía MaderArte',
    description: 'Calidad estructural garantizada en cada pieza personalizada.',
  },
]

export default function QuotePage() {
  return (
    <div className="bg-blanco-hueso min-h-screen">
      {/* Hero Section */}
      <section className="bg-madera-oscura py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-crema-marfil mb-6">
            Llevamos tu idea a la <span className="text-dorado-suave">realidad</span>
          </h1>
          <p className="font-dm-sans text-lg text-crema-marfil/70 max-w-2xl mx-auto">
            ¿Buscas una pieza única o un proyecto integral? Cuéntanos tu visión y nosotros nos encargamos del diseño y la fabricación artesanal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Information Side */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-madera-oscura mb-6">¿Cómo funciona?</h2>
              <div className="space-y-8">
                {BENEFIT_ITEMS.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="shrink-0 h-12 w-12 bg-white rounded-xl shadow-sm border border-gris-piedra/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-madera-oscura mb-1">{item.title}</h3>
                      <p className="text-sm text-gris-piedra leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-crema-marfil/50 p-8 rounded-2xl border border-dorado-suave/20">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-dorado-suave" />
                <h3 className="font-bold text-madera-oscura">Asesoría Directa</h3>
              </div>
              <p className="text-sm text-gris-piedra leading-relaxed mb-4">
                Si prefieres hablar directamente con un asesor, también puedes contactarnos vía WhatsApp o visitarnos en nuestro showroom.
              </p>
              <a 
                href="https://wa.me/525512345678" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-bold text-dorado-suave hover:text-madera-oscura transition-colors uppercase tracking-widest"
              >
                Chat por WhatsApp →
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <QuoteForm />
          </div>

        </div>
      </div>
    </div>
  )
}
