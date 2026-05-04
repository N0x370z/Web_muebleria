'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '')

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'processing' | 'error'>('loading')
  const [message, setMessage] = useState('Verificando tu pago...')
  const [orderId, setOrderId] = useState<string | null>(null)

  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
  const paramOrderId = searchParams.get('orderId')
  const preferenceId = searchParams.get('preference_id') // MercadoPago
  const collectionStatus = searchParams.get('collection_status') // MercadoPago

  useEffect(() => {
    // Si viene de Stripe
    if (paymentIntentClientSecret) {
      stripePromise.then((stripe) => {
        if (!stripe) {
          setStatus('error')
          setMessage('No se pudo inicializar Stripe.')
          return
        }
        
        stripe.retrievePaymentIntent(paymentIntentClientSecret).then(({ paymentIntent }) => {
          switch (paymentIntent?.status) {
            case 'succeeded':
              setStatus('success')
              setMessage('¡Pago procesado con éxito!')
              if (paramOrderId) setOrderId(paramOrderId)
              clearCart()
              break
            case 'processing':
              setStatus('processing')
              setMessage('Tu pago se está procesando. Te notificaremos cuando se haya realizado con éxito.')
              clearCart()
              break
            case 'requires_payment_method':
              setStatus('error')
              setMessage('El pago no fue exitoso, por favor intenta de nuevo.')
              break
            default:
              setStatus('error')
              setMessage('Ocurrió un problema inesperado.')
              break
          }
        })
      })
    } 
    // Si viene de MercadoPago
    else if (preferenceId || collectionStatus) {
      if (collectionStatus === 'approved') {
        setStatus('success')
        setMessage('¡Pago procesado con éxito en MercadoPago!')
        if (paramOrderId) setOrderId(paramOrderId) // Podría pasarse por external_reference
        clearCart()
      } else if (collectionStatus === 'pending') {
        setStatus('processing')
        setMessage('Tu pago está pendiente de confirmación en MercadoPago.')
        clearCart()
      } else {
        setStatus('error')
        setMessage('El pago en MercadoPago no se pudo completar.')
      }
    } 
    // Acceso directo sin parámetros
    else {
      setStatus('error')
      setMessage('No se encontró información del pago.')
    }
  }, [paymentIntentClientSecret, collectionStatus, preferenceId, paramOrderId, clearCart])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="h-12 w-12 rounded-full border-4 border-dorado-suave border-t-transparent animate-spin mb-4" />
        <p className="text-gris-piedra font-dm-sans">{message}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="font-playfair text-3xl text-madera-oscura font-bold mb-2">Error en el Pago</h1>
        <p className="text-gris-piedra mb-8 max-w-md">{message}</p>
        <Button onClick={() => router.push('/tienda/checkout')}>
          Intentar nuevamente
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
      
      <h1 className="font-playfair text-4xl font-bold text-madera-oscura mb-4">
        ¡Gracias por tu compra!
      </h1>
      
      <p className="text-lg text-gris-piedra font-dm-sans mb-2">
        {message}
      </p>
      
      {orderId && (
        <p className="text-madera-oscura mb-8 font-medium font-dm-sans">
          Tu número de pedido es: <span className="font-courier bg-crema-marfil px-2 py-1 rounded">{orderId}</span>
        </p>
      )}

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gris-piedra/10 text-left max-w-xl mx-auto mb-10">
        <h2 className="font-playfair text-xl font-bold text-madera-oscura mb-4">¿Qué sigue?</h2>
        <ul className="space-y-4 text-gris-piedra font-dm-sans">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dorado-suave/20 text-dorado-suave flex items-center justify-center text-sm font-bold">1</span>
            <span>Recibirás un correo electrónico de confirmación con los detalles de tu pedido.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dorado-suave/20 text-dorado-suave flex items-center justify-center text-sm font-bold">2</span>
            <span>Procesaremos tu pedido y lo prepararemos para el envío.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-dorado-suave/20 text-dorado-suave flex items-center justify-center text-sm font-bold">3</span>
            <span>Te notificaremos cuando tu pedido esté en camino.</span>
          </li>
        </ul>
      </div>

      <Link href="/catalogo">
        <Button leftIcon={<ShoppingBag className="w-4 h-4" />} size="lg">
          Seguir Comprando
        </Button>
      </Link>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="bg-blanco-hueso min-h-screen">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="h-12 w-12 rounded-full border-4 border-dorado-suave border-t-transparent animate-spin mb-4" />
          <p className="text-gris-piedra font-dm-sans">Cargando...</p>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  )
}
