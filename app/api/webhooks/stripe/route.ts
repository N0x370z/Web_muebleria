import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { sendOrderConfirmation } from '@/lib/email'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event: Stripe.Event

  try {
    if (!webhookSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET')
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    console.error(`Webhook signature verification failed: ${(err as Error).message}`)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' },
            include: { items: true },
          })
          
          // Enviar email transaccional
          const email = (order.shippingAddress as Record<string, unknown>)?.email as string | undefined
          if (email) await sendOrderConfirmation(order, email)
          
          // eslint-disable-next-line no-console
          console.log(`Order ${orderId} confirmed via Stripe webhook`)
        }
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata.orderId
        
        // Simular Sentry log
        console.error('Payment failed for intent:', paymentIntent.id, 'Order:', orderId)
        
        if (orderId) {
           await prisma.order.update({
             where: { id: orderId },
             data: { status: 'CANCELLED' }
           })
        }
        break
      }

      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
