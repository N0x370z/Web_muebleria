'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { CartItem } from './CartItem'
import { Button } from '@/components/ui/Button'

export const CartDrawer = () => {
  const { isOpen, closeCart, items, getSubtotal } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Evitar scroll cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isMounted) return null

  const subtotal = getSubtotal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-madera-oscura/50 z-50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-blanco-hueso shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gris-piedra/20">
              <h2 className="font-playfair text-2xl font-bold text-madera-oscura flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Tu Carrito
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-gris-piedra hover:text-madera-oscura hover:bg-gris-piedra/10 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-crema-marfil rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-dorado-suave" />
                  </div>
                  <h3 className="font-playfair text-xl text-madera-oscura font-medium">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gris-piedra font-dm-sans max-w-[250px]">
                    Descubre nuestra colección y encuentra la pieza perfecta para tu espacio.
                  </p>
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="mt-4"
                  >
                    Explorar Catálogo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem key={`${item.productId}-${item.selectedVariant?.id || 'base'}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gris-piedra/20">
                <div className="flex justify-between items-center mb-4 font-dm-sans">
                  <span className="text-gris-piedra">Subtotal</span>
                  <span className="font-semibold text-madera-oscura text-lg">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-gris-piedra mb-6 font-dm-sans">
                  El envío y los impuestos se calcularán en el siguiente paso.
                </p>
                <Link href="/tienda/checkout" onClick={closeCart} className="block w-full">
                  <Button className="w-full h-12 text-base">
                    Ir al Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
