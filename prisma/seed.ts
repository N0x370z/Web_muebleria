import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seed = async () => {
  console.warn('🌱 Iniciando seed de MaderArte...')

  // ── Limpiar datos existentes (orden inverso a FK) ──────────────
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.image.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.banner.deleteMany()

  // ── Tags ───────────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Nuevo', slug: 'nuevo' } }),
    prisma.tag.create({ data: { name: 'Oferta', slug: 'oferta' } }),
    prisma.tag.create({ data: { name: 'Más Vendido', slug: 'mas-vendido' } }),
    prisma.tag.create({ data: { name: 'Personalizable', slug: 'personalizable' } }),
  ])

  // ── Categorías ─────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'salas',
        name: 'Salas',
        description: 'El centro de tu hogar. Sofás, sillones y mesas de centro.',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'comedores',
        name: 'Comedores',
        description: 'Donde los momentos se comparten. Mesas y sillas de alta calidad.',
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'recamaras',
        name: 'Recámaras',
        description: 'Tu refugio personal. Camas, cabeceras y muebles auxiliares.',
        imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'oficinas',
        name: 'Oficinas',
        description: 'Diseño que inspira productividad.',
        imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',
        order: 4,
      },
    }),
  ])

  const [salas, comedores, recamaras, oficinas] = categories

  // ── Productos de ejemplo ────────────────────────────────────────
  const products = [
    {
      slug: 'sofa-esquinero-venecia',
      name: 'Sofá Esquinero Venecia',
      description:
        'Sofá modular de alto diseño con tapizado en tela premium. Estructura de madera maciza y espuma de alta densidad para máximo confort. Disponible en múltiples combinaciones de tela y madera.',
      price: 28500,
      comparePrice: 34000,
      stock: 8,
      isCustomizable: true,
      categoryId: salas.id,
      tags: { connect: [{ slug: 'mas-vendido' }, { slug: 'personalizable' }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            alt: 'Sofá Esquinero Venecia — vista frontal',
            order: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
            alt: 'Sofá Esquinero Venecia — detalle de tela',
            order: 1,
          },
        ],
      },
      variants: {
        create: [
          { type: 'material', label: 'Lino Gris', value: 'lino-gris', priceModifier: 0, stock: 4 },
          { type: 'material', label: 'Velvet Azul', value: 'velvet-azul', priceModifier: 2500, stock: 2 },
          { type: 'material', label: 'Cuero Natural', value: 'cuero-natural', priceModifier: 5000, stock: 2 },
        ],
      },
    },
    {
      slug: 'mesa-comedor-roble-solid',
      name: 'Mesa Comedor Roble Sólido',
      description:
        'Mesa de comedor fabricada en roble macizo europeo con acabado natural. Diseño minimalista que combina con cualquier estilo de interior. Para 6-8 personas.',
      price: 18900,
      comparePrice: undefined,
      stock: 5,
      isCustomizable: true,
      categoryId: comedores.id,
      tags: { connect: [{ slug: 'nuevo' }, { slug: 'personalizable' }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
            alt: 'Mesa Comedor Roble Sólido — vista completa',
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          { type: 'acabado', label: 'Natural Mate', value: 'natural-mate', priceModifier: 0, stock: 3 },
          { type: 'acabado', label: 'Nogal Oscuro', value: 'nogal-oscuro', priceModifier: 1500, stock: 2 },
        ],
      },
    },
    {
      slug: 'cama-plataforma-kyoto',
      name: 'Cama Plataforma Kyoto',
      description:
        'Cama de plataforma con cabecera tapizada de inspiración japonesa. Base de madera de pino con nogal en el tono. Incluye listones de madera. Disponible en tamaños Queen y King.',
      price: 22000,
      comparePrice: undefined,
      stock: 12,
      isCustomizable: false,
      categoryId: recamaras.id,
      tags: { connect: [{ slug: 'nuevo' }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
            alt: 'Cama Plataforma Kyoto',
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          { type: 'material', label: 'Queen (160×200)', value: 'queen', priceModifier: 0, stock: 6 },
          { type: 'material', label: 'King (200×200)', value: 'king', priceModifier: 3000, stock: 6 },
        ],
      },
    },
    {
      slug: 'escritorio-ejecutivo-berlín',
      name: 'Escritorio Ejecutivo Berlín',
      description:
        'Escritorio de madera de nogal con patas metálicas negras. Diseño minimalista y funcional para el home office moderno. Incluye cajón con cerradura y gestión de cables integrada.',
      price: 9800,
      comparePrice: 12500,
      stock: 3,
      isCustomizable: false,
      categoryId: oficinas.id,
      tags: { connect: [{ slug: 'oferta' }, { slug: 'mas-vendido' }] },
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80',
            alt: 'Escritorio Ejecutivo Berlín',
            order: 0,
          },
        ],
      },
      variants: { create: [] },
    },
  ]

  for (const productData of products) {
    await prisma.product.create({ data: productData })
  }

  // ── Usuario administrador de prueba ────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.create({
    data: {
      name: 'Admin MaderArte',
      email: 'admin@maderarte.com',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // ── Banner promocional ─────────────────────────────────────────
  await prisma.banner.create({
    data: {
      title: 'Envío gratis en tu primera compra',
      subtitle: 'Usa el código BIENVENIDO al finalizar tu pedido.',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80',
      linkUrl: '/catalogo',
      linkText: 'Ver catálogo',
      isActive: true,
      order: 0,
    },
  })

  console.warn('✅ Seed completado con éxito.')
}

seed()
  .catch((error) => {
    console.error('❌ Error en seed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
