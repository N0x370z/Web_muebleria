import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReviewSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para dejar una reseña' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const result = ReviewSchema.safeParse({ ...body, productId: params.id })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos de reseña inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const { rating, title, body: reviewBody } = result.data

    // Verificar si el usuario ya dejó una reseña para este producto
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: {
          productId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya has dejado una reseña para este producto' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        productId: params.id,
        userId: session.user.id,
        rating,
        title,
        body: reviewBody,
      },
    })

    return NextResponse.json(
      { message: 'Reseña creada exitosamente', review },
      { status: 201 }
    )
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la reseña' },
      { status: 500 }
    )
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: params.id, isVisible: true },
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener las reseñas' },
      { status: 500 }
    )
  }
}
