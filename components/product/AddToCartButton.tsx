'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import type { Product, ProductVariant } from '@/types'

interface AddToCartButtonProps {
  product: Product
  selectedVariant?: ProductVariant
  disabled?: boolean
}

export const AddToCartButton = ({ product, selectedVariant, disabled }: AddToCartButtonProps) => {
  const { addItem, openCart } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0]?.url,
      selectedVariant: selectedVariant ? {
        id: selectedVariant.id,
        type: selectedVariant.type,
        label: selectedVariant.label,
        value: selectedVariant.value,
        priceModifier: selectedVariant.priceModifier,
      } : undefined
    })

    setTimeout(() => {
      setIsAdding(false)
      openCart()
    }, 500)
  }

  const isOutOfStock = product.stock === 0 || (selectedVariant && selectedVariant.stock === 0)

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isOutOfStock || isAdding}
      className="w-full flex items-center justify-center gap-2 h-12 text-base"
    >
      <ShoppingBag className="w-5 h-5" />
      {isOutOfStock ? 'Agotado' : isAdding ? 'Agregando...' : 'Agregar al carrito'}
    </Button>
  )
}
