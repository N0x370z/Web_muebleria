/* eslint-disable @next/next/no-img-element */
import * as React from 'react'

interface OrderConfirmationEmailProps {
  orderNumber: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  shippingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    imageUrl?: string | null
    variantLabel?: string | null
  }>
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  orderNumber,
  subtotal,
  shippingCost,
  tax,
  total,
  shippingAddress,
  items,
}) => (
  <html lang="es">
    <body style={{ backgroundColor: '#FDFAF5', color: '#2C1A0E', fontFamily: '"DM Sans", Arial, sans-serif', margin: 0, padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', color: '#2C1A0E', fontSize: '24px', textAlign: 'center', marginBottom: '10px' }}>
          ¡Gracias por tu compra en MaderArte!
        </h1>
        <p style={{ textAlign: 'center', color: '#8A8070', marginBottom: '30px' }}>
          Hemos recibido tu pedido y estamos comenzando a procesarlo.
        </p>
        
        <div style={{ backgroundColor: '#FDFAF5', padding: '15px', borderRadius: '6px', marginBottom: '30px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Pedido: <span style={{ color: '#B8935A' }}>{orderNumber}</span></p>
        </div>

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #E5E5E5', paddingBottom: '10px', marginBottom: '20px' }}>Resumen de Productos</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '15px 0', display: 'flex', alignItems: 'center' }}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} />
                  )}
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{item.productName}</p>
                    {item.variantLabel && <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#8A8070' }}>{item.variantLabel}</p>}
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#8A8070' }}>Cant: {item.quantity}</p>
                  </div>
                </td>
                <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 'bold' }}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ width: '100%', maxWidth: '300px', marginLeft: 'auto', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#8A8070' }}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#8A8070' }}>
            <span>Envío</span>
            <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#8A8070' }}>
            <span>IVA (16%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #B8935A', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total</span>
            <span style={{ color: '#B8935A' }}>{formatPrice(total)}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #E5E5E5', paddingBottom: '10px', marginBottom: '20px' }}>Dirección de Envío</h2>
        <p style={{ margin: '0 0 5px', color: '#8A8070' }}><strong>{shippingAddress.fullName}</strong></p>
        <p style={{ margin: '0 0 5px', color: '#8A8070' }}>{shippingAddress.street}</p>
        <p style={{ margin: '0 0 5px', color: '#8A8070' }}>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
        <p style={{ margin: 0, color: '#8A8070' }}>{shippingAddress.country}</p>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #E5E5E5', textAlign: 'center', fontSize: '12px', color: '#8A8070' }}>
          <p>MaderArte Mueblería Premium - Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
)

export default OrderConfirmationEmail
