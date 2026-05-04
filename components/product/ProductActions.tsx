'use client'

import { useState, useMemo } from 'react'
import { VariantSelector } from '@/components/product/VariantSelector'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import type { Product, ProductVariant } from '@/types'

interface ProductActionsProps {
  product: Product
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined)

  const effectivePrice = useMemo(() => {
    const base = product.price
    const modifier = selectedVariant?.priceModifier ?? 0
    return base + modifier
  }, [product.price, selectedVariant])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  const hasVariants = product.variants.length > 0

  return (
    <div className="space-y-6">
      {/* Dynamic price display */}
      {selectedVariant && selectedVariant.priceModifier > 0 && (
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-madera-oscura">
            {formatPrice(effectivePrice)}
          </span>
          <span className="text-sm text-gris-piedra line-through">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] font-bold text-dorado-suave uppercase tracking-widest">
            con {selectedVariant.label}
          </span>
        </div>
      )}

      {/* Variant selector */}
      {hasVariants && (
        <VariantSelector
          variants={product.variants}
          onVariantChange={setSelectedVariant}
        />
      )}

      {/* Add to cart */}
      <AddToCartButton
        product={product}
        selectedVariant={selectedVariant}
        disabled={hasVariants && !selectedVariant}
      />

      {hasVariants && !selectedVariant && (
        <p className="text-xs text-center text-gris-piedra italic">
          Selecciona una variante para agregar al carrito
        </p>
      )}
    </div>
  )
}
