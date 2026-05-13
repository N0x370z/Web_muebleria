import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nosotros — MaderArte',
  description: 'Conoce la historia detrás de MaderArte, nuestra filosofía y nuestro compromiso con la artesanía de lujo en cada mueble.',
}

export default function AboutPage() {
  return (
    <div className="bg-blanco-hueso min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"
          alt="Artesano trabajando madera"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-crema-marfil mb-4">
            Nuestra Esencia
          </h1>
          <p className="font-dm-sans text-xl text-crema-marfil/80 max-w-2xl mx-auto">
            Donde la tradición artesanal se encuentra con el diseño contemporáneo.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="font-playfair text-4xl font-bold text-madera-oscura">
              La Historia detrás de cada Veta
            </h2>
            <div className="h-1 w-20 bg-dorado-suave mx-auto lg:mx-0"></div>
            <p className="font-dm-sans text-lg text-gris-piedra leading-relaxed">
              MaderArte nació hace más de tres décadas como un pequeño taller familiar en el corazón de México. Nuestra pasión por las maderas nobles y el respeto por el oficio nos han llevado a convertirnos en un referente del mobiliario de lujo.
            </p>
            <p className="font-dm-sans text-lg text-gris-piedra leading-relaxed">
              No solo fabricamos muebles; creamos piezas que se convierten en el alma de un hogar. Cada curva, cada ensamble y cada acabado es supervisado por maestros artesanos que dedican su vida a perfeccionar este noble arte.
            </p>
          </div>
          <div className="relative aspect-square lg:aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
              alt="Mueble terminado de MaderArte"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-madera-oscura py-24 text-crema-marfil">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-dorado-suave uppercase tracking-widest">Calidad Sin Compromiso</h3>
              <p className="font-dm-sans text-crema-marfil/70 leading-relaxed">
                Seleccionamos solo las mejores maderas de bosques sustentables, asegurando durabilidad por generaciones.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-dorado-suave uppercase tracking-widest">Diseño Consciente</h3>
              <p className="font-dm-sans text-crema-marfil/70 leading-relaxed">
                Fusionamos estética editorial con ergonomía funcional para crear espacios que inspiran bienestar.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-dorado-suave uppercase tracking-widest">Servicio Personalizado</h3>
              <p className="font-dm-sans text-crema-marfil/70 leading-relaxed">
                Acompañamos a nuestros clientes en cada paso, desde la concepción de la idea hasta la entrega final en su hogar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 max-w-5xl mx-auto px-4 text-center">
        <div className="space-y-16">
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-madera-oscura uppercase tracking-wider">Nuestra Misión</h2>
            <p className="text-xl text-gris-piedra italic font-dm-sans leading-relaxed">
              &ldquo;Elevar la experiencia de habitar un espacio a través de piezas de mobiliario que fusionan la perfección artesanal con la visión vanguardista, creando legados de diseño en cada hogar.&rdquo;
            </p>
          </div>
          <div className="h-px w-full bg-gris-piedra/10"></div>
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-madera-oscura uppercase tracking-wider">Nuestra Visión</h2>
            <p className="text-xl text-gris-piedra italic font-dm-sans leading-relaxed">
              &ldquo;Ser la marca de mobiliario de lujo más reconocida por su integridad artesanal y capacidad de innovación, inspirando a las personas a rodearse de belleza y calidad eterna.&rdquo;
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
