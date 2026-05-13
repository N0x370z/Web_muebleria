'use client'

/**
 * StripeCheckout – Solo se ejecuta en el cliente (next/dynamic ssr:false).
 * Usa webpackIgnore para que webpack NO intente resolver @stripe/* en build.
 * En runtime el navegador los carga desde node_modules sin problema.
 */

import { useEffect, useState } from 'react'
import { StripePaymentForm } from './StripePaymentForm'

interface StripeCheckoutProps {
  clientSecret: string
  orderId: string
  onCancel: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>

export const StripeCheckout = ({ clientSecret, orderId, onCancel }: StripeCheckoutProps) => {
  const [Elements, setElements] = useState<AnyComponent | null>(null)
  const [stripePromise, setStripePromise] = useState<unknown>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactStripeModule, setReactStripeModule] = useState<any>(null)

  useEffect(() => {
    // Carga dinámica en runtime: webpack no puede ver estos imports en build
    Promise.all([
      // webpackIgnore evita que webpack analice estas dependencias
      import(/* webpackIgnore: true */ '@stripe/react-stripe-js'),
      import(/* webpackIgnore: true */ '@stripe/stripe-js'),
    ]).then(([reactStripe, stripeJs]) => {
      setElements(() => reactStripe.Elements)
      setReactStripeModule(reactStripe)
      stripeJs.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? '').then(setStripePromise)
    }).catch(console.error)
  }, [])

  if (!Elements || !stripePromise || !reactStripeModule) {
    return (
      <div className="py-10 flex justify-center">
        <span className="h-8 w-8 rounded-full border-4 border-dorado-suave border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#B8935A',
            colorBackground: '#FDFAF5',
            colorText: '#2C1A0E',
            colorDanger: '#e53e3e',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '8px',
          },
        },
      }}
    >
      <StripePaymentForm orderId={orderId} onCancel={onCancel} reactStripe={reactStripeModule} />
    </Elements>
  )
}
