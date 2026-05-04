'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CatalogFiltersProps {
  currentCategory?: string
  categories: Array<{ slug: string; name: string }>
}

export const CatalogFilters = ({ currentCategory, categories }: CatalogFiltersProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const currentSort = searchParams.get('sort') || 'newest'
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentInStock = searchParams.get('inStock') === 'true'

  const buildUrl = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        sp.delete(key)
      } else {
        sp.set(key, value)
      }
    })
    // Always reset to page 1 when filters change
    sp.delete('page')
    const base = currentCategory ? `/catalogo/${currentCategory}` : '/catalogo'
    const qs = sp.toString()
    return qs ? `${base}?${qs}` : base
  }

  const handleSortChange = (sort: string) => {
    router.push(buildUrl({ sort }))
  }

  const handlePriceApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    router.push(buildUrl({
      minPrice: formData.get('minPrice')?.toString() || undefined,
      maxPrice: formData.get('maxPrice')?.toString() || undefined,
    }))
  }

  const handleStockToggle = () => {
    router.push(buildUrl({ inStock: currentInStock ? undefined : 'true' }))
  }

  const clearFilters = () => {
    const base = currentCategory ? `/catalogo/${currentCategory}` : '/catalogo'
    router.push(base)
  }

  const hasActiveFilters = currentMinPrice || currentMaxPrice || currentInStock || currentSort !== 'newest'

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gris-piedra/20 rounded-lg text-sm font-medium text-madera-oscura hover:bg-crema-marfil transition-colors lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-dorado-suave" />
        )}
      </button>

      {/* Filters panel */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Sort */}
        <div>
          <h3 className="text-xs font-bold text-madera-oscura uppercase tracking-widest mb-3">Ordenar por</h3>
          <div className="space-y-1">
            {[
              { value: 'newest', label: 'Más reciente' },
              { value: 'price_asc', label: 'Precio: menor a mayor' },
              { value: 'price_desc', label: 'Precio: mayor a menor' },
              { value: 'best_seller', label: 'Más vendidos' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentSort === option.value
                    ? 'bg-dorado-suave/10 text-dorado-suave font-bold'
                    : 'text-gris-piedra hover:bg-crema-marfil hover:text-madera-oscura'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories (only shown on /catalogo, not on /catalogo/[categoria]) */}
        {!currentCategory && categories.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-madera-oscura uppercase tracking-widest mb-3">Categorías</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/catalogo/${cat.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-gris-piedra hover:bg-crema-marfil hover:text-madera-oscura transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Price range */}
        <div>
          <h3 className="text-xs font-bold text-madera-oscura uppercase tracking-widest mb-3">Rango de precio</h3>
          <form onSubmit={handlePriceApply} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                name="minPrice"
                type="number"
                placeholder="Min"
                defaultValue={currentMinPrice}
                className="w-full px-3 py-2 bg-blanco-hueso border border-gris-piedra/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dorado-suave/20"
              />
              <span className="text-gris-piedra text-xs">—</span>
              <input
                name="maxPrice"
                type="number"
                placeholder="Max"
                defaultValue={currentMaxPrice}
                className="w-full px-3 py-2 bg-blanco-hueso border border-gris-piedra/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dorado-suave/20"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Aplicar precio
            </Button>
          </form>
        </div>

        {/* In stock */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
              currentInStock
                ? 'bg-dorado-suave border-dorado-suave'
                : 'border-gris-piedra/30 group-hover:border-gris-piedra/60'
            }`}>
              {currentInStock && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <button type="button" onClick={handleStockToggle} className="text-sm text-gris-piedra group-hover:text-madera-oscura transition-colors">
              Solo con stock disponible
            </button>
          </label>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
          >
            <X className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>
    </>
  )
}
