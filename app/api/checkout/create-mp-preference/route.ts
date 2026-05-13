import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { CreateOrderSchema } from '@/lib/validations'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' })

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

    // Calcular subtotal real desde BD
    let subtotal = 0
    const snapshotItems = []
    const mpItems = []

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

      mpItems.push({
        id: item.productId,
        title: dbProduct.name + (variantLabel ? ` (${variantLabel})` : ''),
        quantity: item.quantity,
        unit_price: unitPrice,
        currency_id: 'MXN',
      })
    }

    const shippingCost = subtotal > 8000 ? 0 : 500
    const tax = subtotal * 0.16
    const totalAmount = subtotal + shippingCost + tax

    // Añadir costo de envío e impuestos como items
    if (shippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Costo de envío',
        quantity: 1,
        unit_price: shippingCost,
        currency_id: 'MXN',
      })
    }
    
    if (tax > 0) {
      mpItems.push({
        id: 'tax',
        title: 'IVA (16%)',
        quantity: 1,
        unit_price: Number(tax.toFixed(2)),
        currency_id: 'MXN',
      })
    }

    // Crear la orden PENDING en BD
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
        paymentMethod: 'mercadopago',
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

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    // Crear Preference de MercadoPago
    const preference = new Preference(client)
    const response = await preference.create({
      body: {
        items: mpItems,
        external_reference: order.id,
        back_urls: {
          success: `${baseUrl}/tienda/confirmacion`,
          failure: `${baseUrl}/tienda/confirmacion`,
          pending: `${baseUrl}/tienda/confirmacion`,
        },
        auto_return: 'approved',
      }
    })

    // Actualizamos la orden con el payment intent de MP
    await prisma.order.update({
      where: { id: order.id },
      data: { mpPaymentId: response.id },
    })

    return NextResponse.json({ init_point: response.init_point, orderId: order.id })
  } catch (error) {
    console.error('Error in create-mp-preference:', error)
    return NextResponse.json({ error: 'Error al procesar el pago con MercadoPago' }, { status: 500 })
  }
}
