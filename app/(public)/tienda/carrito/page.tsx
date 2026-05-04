'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { CartItem } from '@/components/cart/CartItem'

export default function CartPage() {
  const router = useRouter()
  const { items, getSubtotal, getItemCount } = useCartStore()

  const subtotal = getSubtotal()
  const taxEstimated = subtotal * 0.16
  const totalEstimated = subtotal + taxEstimated

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-blanco-hueso flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 bg-crema-marfil rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gris-piedra/50" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-madera-oscura mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-gris-piedra mb-8 max-w-md">
          Parece que aún no has añadido ningún producto a tu carrito. Explora nuestro catálogo y encuentra piezas únicas.
        </p>
        <Link href="/catalogo">
          <Button size="lg" leftIcon={<ShoppingBag className="w-4 h-4" />}>
            Explorar Catálogo
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-blanco-hueso min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-madera-oscura mb-8">
          Tu Carrito ({getItemCount()})
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Lista de Productos */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gris-piedra/10">
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItem 
                  key={`${item.productId}-${item.selectedVariant?.id || 'base'}`} 
                  item={item} 
                />
              ))}
            </div>
            <div className="mt-6">
              <Link href="/catalogo" className="text-sm font-dm-sans text-dorado-suave hover:text-madera-oscura transition-colors font-medium">
                ← Continuar comprando
              </Link>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gris-piedra/10 sticky top-24">
              <h3 className="font-playfair text-xl font-bold text-madera-oscura mb-6">Resumen del Pedido</h3>
              
              <div className="space-y-4 py-4 border-t border-gris-piedra/20 text-sm font-dm-sans">
                <div className="flex justify-between text-gris-piedra">
                  <span>Subtotal</span>
                  <span className="font-medium text-madera-oscura">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gris-piedra">
                  <span>IVA Estimado (16%)</span>
                  <span className="font-medium text-madera-oscura">{formatPrice(taxEstimated)}</span>
                </div>
                <div className="flex justify-between text-gris-piedra text-xs">
                  <span>Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
              </div>

              <div className="flex justify-between py-4 border-t border-gris-piedra/20 font-playfair font-bold text-xl text-madera-oscura mb-6">
                <span>Total Estimado</span>
                <span>{formatPrice(totalEstimated)}</span>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => router.push('/tienda/checkout')}
              >
                Proceder al Checkout
              </Button>
              
              <p className="text-xs text-gris-piedra text-center mt-4 font-dm-sans">
                Pagos seguros y encriptados.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
