'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')

export default function CheckoutPage() {
  const { items, getSubtotal, getItemCount } = useCartStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mercadopago'>('stripe')
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    state: '',
    phone: '',
    country: 'México'
  })

  const subtotal = getSubtotal()
  const shipping = subtotal > 8000 ? 0 : 500
  const tax = subtotal * 0.16
  const total = subtotal + shipping + tax

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  const handleGoToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const prepareStripePayment = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod: 'stripe'
        }),
      })
      const data = await res.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setOrderId(data.orderId)
      } else {
        alert(data.error || 'Error al iniciar pago con Stripe')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const prepareMercadoPago = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/checkout/create-mp-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod: 'mercadopago'
        }),
      })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        alert(data.error || 'Error al iniciar pago con MercadoPago')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error(error)
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (step === 2 && paymentMethod === 'stripe' && !clientSecret) {
      prepareStripePayment()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod])

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-playfair text-3xl font-bold text-madera-oscura mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-gris-piedra mb-8">
          No puedes proceder al pago sin productos en el carrito.
        </p>
        <Link href="/catalogo">
          <Button>Volver al catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-blanco-hueso min-h-screen pb-20">
      <div className="bg-white border-b border-gris-piedra/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="font-playfair text-2xl font-bold text-madera-oscura">
            Mader<span className="text-dorado-suave">Arte</span>
          </Link>
          <div className="flex items-center text-sm text-gris-piedra font-dm-sans">
            <Lock className="w-4 h-4 mr-2" />
            Checkout Seguro
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <div className="flex items-center mb-8 text-sm font-dm-sans">
              <span className={`font-semibold ${step >= 1 ? 'text-madera-oscura' : 'text-gris-piedra'}`}>Envío</span>
              <ChevronRight className="w-4 h-4 mx-2 text-gris-piedra" />
              <span className={`font-semibold ${step >= 2 ? 'text-madera-oscura' : 'text-gris-piedra'}`}>Pago</span>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gris-piedra/10">
              {step === 1 && (
                <form onSubmit={handleGoToPayment} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="font-playfair text-2xl font-bold text-madera-oscura">Datos de Envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre(s)" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})} required />
                    <Input label="Correo Electrónico" type="email" value={shippingAddress.email} onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})} required />
                    <div className="md:col-span-2">
                      <Input label="Dirección Completa" value={shippingAddress.street} onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})} required />
                    </div>
                    <Input label="Ciudad" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} required />
                    <Input label="Código Postal" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} required />
                    <Input label="Estado" value={shippingAddress.state} onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})} required />
                    <Input label="Teléfono" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} required />
                  </div>
                  <Button type="submit" className="w-full mt-6">
                    Continuar al Pago
                  </Button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="font-playfair text-2xl font-bold text-madera-oscura">Método de Pago</h2>
                  
                  <div className="space-y-4 mb-8">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-dorado-suave bg-dorado-suave/5' : 'border-gris-piedra/20 hover:border-dorado-suave/50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => { setPaymentMethod('stripe'); setClientSecret('') }} className="text-dorado-suave focus:ring-dorado-suave" />
                      <span className="ml-3 font-medium text-madera-oscura">Tarjeta de Crédito / Débito</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'mercadopago' ? 'border-dorado-suave bg-dorado-suave/5' : 'border-gris-piedra/20 hover:border-dorado-suave/50'}`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="text-dorado-suave focus:ring-dorado-suave" />
                      <span className="ml-3 font-medium text-madera-oscura">MercadoPago</span>
                    </label>
                  </div>

                  {paymentMethod === 'stripe' && (
                    <>
                      {isProcessing && !clientSecret ? (
                        <div className="py-10 flex justify-center">
                          <span className="h-8 w-8 rounded-full border-4 border-dorado-suave border-t-transparent animate-spin" />
                        </div>
                      ) : clientSecret && (
                        <div className="mt-6">
                          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#B8935A' } } }}>
                            <StripePaymentForm clientSecret={clientSecret} orderId={orderId} onCancel={() => setStep(1)} />
                          </Elements>
                        </div>
                      )}
                    </>
                  )}

                  {paymentMethod === 'mercadopago' && (
                    <div className="flex gap-4 mt-8">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1" disabled={isProcessing}>
                        Atrás
                      </Button>
                      <Button onClick={prepareMercadoPago} className="flex-1" isLoading={isProcessing} disabled={isProcessing}>
                        Pagar en MercadoPago
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gris-piedra/10 sticky top-24">
              <h3 className="font-playfair text-xl font-bold text-madera-oscura mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.selectedVariant?.id || 'base'}`} className="flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-madera-oscura line-clamp-1">{item.name}</p>
                      <p className="text-gris-piedra">Cant: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-madera-oscura">
                      {formatPrice((item.price + (item.selectedVariant?.priceModifier || 0)) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-gris-piedra/20 text-sm font-dm-sans">
                <div className="flex justify-between text-gris-piedra">
                  <span>Subtotal ({getItemCount()} artículos)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gris-piedra">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gris-piedra">
                  <span>IVA (16%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-gris-piedra/20 font-playfair font-bold text-lg text-madera-oscura">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
