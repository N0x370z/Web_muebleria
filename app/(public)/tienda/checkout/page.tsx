'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Lock } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getItemCount } = useCartStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const subtotal = getSubtotal()
  const shipping = subtotal > 8000 ? 0 : 500
  const tax = subtotal * 0.16
  const total = subtotal + shipping + tax

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

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
      {/* Header simple para checkout */}
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
          
          {/* Columna Izquierda: Formulario de Pasos */}
          <div className="flex-1">
            {/* Indicador de pasos */}
            <div className="flex items-center mb-8 text-sm font-dm-sans">
              <span className={`font-semibold ${step >= 1 ? 'text-madera-oscura' : 'text-gris-piedra'}`}>Envío</span>
              <ChevronRight className="w-4 h-4 mx-2 text-gris-piedra" />
              <span className={`font-semibold ${step >= 2 ? 'text-madera-oscura' : 'text-gris-piedra'}`}>Pago</span>
              <ChevronRight className="w-4 h-4 mx-2 text-gris-piedra" />
              <span className={`font-semibold ${step >= 3 ? 'text-madera-oscura' : 'text-gris-piedra'}`}>Confirmación</span>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gris-piedra/10">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="font-playfair text-2xl font-bold text-madera-oscura">Datos de Envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nombre" placeholder="Juan" required />
                    <Input label="Apellidos" placeholder="Pérez" required />
                    <div className="md:col-span-2">
                      <Input label="Correo Electrónico" type="email" placeholder="juan@ejemplo.com" required />
                    </div>
                    <div className="md:col-span-2">
                      <Input label="Dirección Completa" placeholder="Calle y número" required />
                    </div>
                    <Input label="Ciudad" placeholder="Ciudad de México" required />
                    <Input label="Código Postal" placeholder="10000" required />
                    <Input label="Estado" placeholder="CDMX" required />
                    <Input label="Teléfono" placeholder="55 1234 5678" required />
                  </div>
                  <Button className="w-full mt-6" onClick={() => setStep(2)}>
                    Continuar al Pago
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="font-playfair text-2xl font-bold text-madera-oscura">Método de Pago</h2>
                  <p className="text-sm text-gris-piedra mb-4">
                    Selecciona tu método de pago preferido.
                  </p>
                  
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-dorado-suave bg-dorado-suave/5 rounded-lg cursor-pointer">
                      <input type="radio" name="payment" className="text-dorado-suave focus:ring-dorado-suave" defaultChecked />
                      <span className="ml-3 font-medium text-madera-oscura">Tarjeta de Crédito / Débito (Stripe)</span>
                    </label>
                    <label className="flex items-center p-4 border border-gris-piedra/20 hover:border-dorado-suave/50 rounded-lg cursor-pointer transition-colors">
                      <input type="radio" name="payment" className="text-dorado-suave focus:ring-dorado-suave" />
                      <span className="ml-3 font-medium text-madera-oscura">MercadoPago</span>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Atrás
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Revisar Pedido
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="font-playfair text-2xl font-bold text-madera-oscura">Confirmar Pedido</h2>
                  <div className="bg-crema-marfil/30 p-4 rounded-lg space-y-2 text-sm font-dm-sans">
                    <p><strong className="text-madera-oscura">Envío a:</strong> Juan Pérez, Calle y número, CDMX, 10000</p>
                    <p><strong className="text-madera-oscura">Contacto:</strong> juan@ejemplo.com, 55 1234 5678</p>
                    <p><strong className="text-madera-oscura">Método de pago:</strong> Tarjeta de Crédito (Stripe)</p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Atrás
                    </Button>
                    <Button 
                      onClick={() => {
                        // Aquí iría la lógica de procesar pago con Stripe/MP
                        alert('¡Pedido procesado con éxito! (Simulación)')
                        router.push('/')
                      }} 
                      className="flex-1"
                    >
                      Pagar {formatPrice(total)}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
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
