'use client'

import { useState } from 'react'
import type { ProductVariant } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant | undefined) => void
}

export const VariantSelector = ({ variants, onVariantChange }: VariantSelectorProps) => {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  // Group variants by type
  const grouped = variants.reduce<Record<string, ProductVariant[]>>((acc, v) => {
    if (!acc[v.type]) acc[v.type] = []
    acc[v.type].push(v)
    return acc
  }, {})

  const typeLabels: Record<string, string> = {
    color: 'Color',
    material: 'Material',
    acabado: 'Acabado',
  }

  const formatPrice = (modifier: number) =>
    modifier > 0
      ? `+${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(modifier)}`
      : undefined

  const handleSelect = (variant: ProductVariant) => {
    if (selectedId === variant.id) {
      setSelectedId(undefined)
      onVariantChange(undefined)
    } else {
      setSelectedId(variant.id)
      onVariantChange(variant)
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, options]) => (
        <div key={type}>
          <h3 className="text-xs font-bold text-madera-oscura uppercase tracking-widest mb-3">
            {typeLabels[type] || type}
          </h3>
          <div className="flex flex-wrap gap-2">
            {options.map((variant) => {
              const isSelected = selectedId === variant.id
              const isOutOfStock = variant.stock === 0
              const priceTag = formatPrice(variant.priceModifier)

              return (
                <button
                  key={variant.id}
                  onClick={() => handleSelect(variant)}
                  disabled={isOutOfStock}
                  className={`
                    relative px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave
                    ${isSelected
                      ? 'border-dorado-suave bg-dorado-suave/5 text-madera-oscura shadow-sm'
                      : 'border-gris-piedra/20 text-gris-piedra hover:border-gris-piedra/40 hover:text-madera-oscura'
                    }
                    ${isOutOfStock ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
                  `}
                  title={isOutOfStock ? 'Sin stock' : `${variant.label}`}
                >
                  <span>{variant.label}</span>
                  {priceTag && (
                    <span className={`ml-1.5 text-[10px] font-bold ${isSelected ? 'text-dorado-suave' : 'text-gris-piedra/60'}`}>
                      {priceTag}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-dorado-suave border-2 border-white" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
