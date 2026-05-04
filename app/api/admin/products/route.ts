import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductCreateSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const result = ProductCreateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const { slug, name, description, price, comparePrice, stock, isCustomizable, categoryId } = result.data

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un producto con ese slug' }, { status: 400 })
    }

    const images = Array.isArray(body.images) ? body.images : []
    const variants = Array.isArray(body.variants) ? body.variants : []

    const product = await prisma.product.create({
      data: {
        slug,
        name,
        description,
        price,
        comparePrice: comparePrice ?? null,
        stock,
        isCustomizable,
        categoryId,
        images: {
          create: images.map((img: { url: string; alt: string; order: number }) => ({
            url: img.url,
            alt: img.alt || name,
            order: img.order || 0,
          })),
        },
        variants: {
          create: variants.map((v: { type: string; label: string; value: string; priceModifier: number; stock: number }) => ({
            type: v.type,
            label: v.label,
            value: v.value,
            priceModifier: v.priceModifier || 0,
            stock: v.stock || 0,
          })),
        },
      },
    })

    return NextResponse.json(
      { message: 'Producto creado exitosamente', productId: product.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Admin product create error:', error)
    return NextResponse.json({ error: 'Error al crear el producto' }, { status: 500 })
  }
}
