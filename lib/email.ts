import { Resend } from 'resend'
import { OrderConfirmationEmail } from './emails/order-confirmation'
import { QuoteReceivedEmail } from './emails/quote-received'

const resend = new Resend(process.env.RESEND_API_KEY)
const sender = process.env.RESEND_FROM_EMAIL || 'MaderArte <no-reply@maderarte.com>'

export async function sendOrderConfirmation(order: Record<string, unknown>, email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [email],
      subject: `Confirmación de Pedido - ${order.orderNumber} | MaderArte`,
      react: OrderConfirmationEmail({
        orderNumber: order.orderNumber as string,
        subtotal: order.subtotal as number,
        shippingCost: order.shippingCost as number,
        tax: order.tax as number,
        total: order.total as number,
        shippingAddress: order.shippingAddress as Record<string, unknown>,
        items: (order.items as Record<string, unknown>[]).map((i: Record<string, unknown>) => ({
          productName: i.productName as string,
          quantity: i.quantity as number,
          unitPrice: i.unitPrice as number,
          imageUrl: i.imageUrl as string | undefined,
          variantLabel: i.variantLabel as string | undefined,
        })),
      }),
    })

    if (error) {
      console.error('Error enviando correo de orden:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Excepción al enviar correo de orden:', err)
    return { success: false, error: err }
  }
}

export async function sendQuoteReceived(quote: Record<string, unknown>) {
  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to: [quote.email as string],
      subject: 'Hemos recibido tu solicitud de cotización | MaderArte',
      react: QuoteReceivedEmail({
        name: quote.name as string,
      }),
    })

    if (error) {
      console.error('Error enviando correo de cotización:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Excepción al enviar correo de cotización:', err)
    return { success: false, error: err }
  }
}
