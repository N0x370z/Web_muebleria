import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const TESTIMONIALS = [
  {
    name: 'Carolina Jiménez',
    role: 'Interiorista',
    content: 'La calidad de la madera y el acabado de la mesa de comedor superaron mis expectativas. Es difícil encontrar este nivel de artesanía hoy en día.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&q=80&fit=crop'
  },
  {
    name: 'Roberto Valdés',
    role: 'Cliente Particular',
    content: 'Compré el sofá Venecia y no solo es hermoso, sino extremadamente cómodo. El servicio de entrega y armado fue impecable.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&q=80&fit=crop'
  },
  {
    name: 'Mariana Sosa',
    role: 'Arquitecta',
    content: 'MaderArte es mi aliado principal para proyectos de lujo. Sus piezas personalizadas siempre encajan perfecto con la visión de mis clientes.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&q=80&fit=crop'
  }
]

export const Testimonials = () => {
  return (
    <section className="py-24 bg-crema-marfil/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-madera-oscura mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <div className="h-1 w-20 bg-dorado-suave mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {TESTIMONIALS.map((testimonial, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-2xl border border-gris-piedra/10 shadow-sm relative group hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-6 right-8 h-8 w-8 text-dorado-suave/10" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-dorado-suave text-dorado-suave" />
                ))}
              </div>

              <p className="font-dm-sans text-gris-piedra italic mb-8 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-dorado-suave/20">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-madera-oscura text-sm">{testimonial.name}</h4>
                  <p className="text-[10px] text-dorado-suave uppercase font-bold tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
