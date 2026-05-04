import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuoteSchema } from '@/lib/validations'
import { sendQuoteReceived } from '@/lib/email'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const result = QuoteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos de cotización inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const { name, email, phone, message, imageUrl } = result.data

    const quote = await prisma.quote.create({
      data: {
        name,
        email,
        phone,
        message,
        imageUrl: imageUrl || null,
        userId: session?.user?.id || null,
      },
    })

    // Enviar email de confirmación al usuario
    await sendQuoteReceived({ name, email })

    return NextResponse.json(
      { message: 'Cotización recibida exitosamente', quoteId: quote.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Quote error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la cotización' },
      { status: 500 }
    )
  }
}
