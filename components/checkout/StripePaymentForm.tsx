'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'

export const StripePaymentForm = ({ orderId, onCancel }: { orderId: string, onCancel: () => void }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { getSubtotal } = useCartStore()
  
  const subtotal = getSubtotal()
  const shipping = subtotal > 8000 ? 0 : 500
  const tax = subtotal * 0.16
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)
    setErrorMessage(null)

    const baseUrl = window.location.origin

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/tienda/confirmacion?orderId=${orderId}`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'Ocurrió un error inesperado al procesar el pago.')
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      
      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isLoading}
        >
          Atrás
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          disabled={!stripe || isLoading}
          isLoading={isLoading}
        >
          Pagar {formatPrice(total)}
        </Button>
      </div>
    </form>
  )
}
