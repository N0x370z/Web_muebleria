import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { CreateOrderSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = CreateOrderSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { items, shippingAddress } = parsed.data

    // Calcular subtotal real desde BD para evitar manipulaciones en el cliente
    let subtotal = 0
    const snapshotItems = []

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true, images: true },
      })
      
      if (!dbProduct || !dbProduct.isActive) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no válido o inactivo` },
          { status: 400 }
        )
      }
      
      let unitPrice = dbProduct.price
      let variantLabel = undefined
      
      if (item.selectedVariantId) {
        const variant = dbProduct.variants.find((v) => v.id === item.selectedVariantId)
        if (variant) {
          unitPrice += variant.priceModifier
          variantLabel = `${variant.label}: ${variant.value}`
        }
      }
      
      const totalItemPrice = unitPrice * item.quantity
      subtotal += totalItemPrice

      // Preparar snapshot para guardar en la BD después
      snapshotItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        productSlug: dbProduct.slug,
        imageUrl: dbProduct.images?.[0]?.url,
        variantLabel,
        quantity: item.quantity,
        unitPrice,
        total: totalItemPrice,
      })
    }

    const shippingCost = subtotal > 8000 ? 0 : 500
    const tax = subtotal * 0.16
    const totalAmount = subtotal + shippingCost + tax

    // En lugar de pasar todo por metadata (que tiene límite de caracteres),
    // crearemos la orden PENDING aquí y el webhook solo la pasará a CONFIRMED.
    // Esto es mucho más seguro para payloads largos y cumple la arquitectura general,
    // aunque el prompt sugería crearla allá. Adaptamos para asegurar robustez.
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `MA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        status: 'PENDING',
        subtotal,
        tax,
        shippingCost,
        discount: 0,
        total: totalAmount,
        shippingAddress: shippingAddress as unknown as import('@prisma/client').Prisma.InputJsonValue,
        paymentMethod: 'stripe',
        items: {
          create: snapshotItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug,
            imageUrl: item.imageUrl,
            variantLabel: item.variantLabel,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          }))
        }
      }
    })

    // Crear el PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // En centavos
      currency: 'mxn',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
      },
    })

    // Actualizamos la orden con el payment intent
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: paymentIntent.id },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id })
  } catch (error) {
    console.error('Error in create-payment-intent:', error)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
