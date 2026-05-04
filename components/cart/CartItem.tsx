import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { CartItem as CartItemType } from '@/types'

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

export const CartItem = ({ item }: { item: CartItemType }) => {
  const { removeItem, updateQuantity } = useCartStore()
  const price = item.price + (item.selectedVariant?.priceModifier || 0)

  return (
    <div className="flex gap-4 py-4 border-b border-gris-piedra/20">
      <div className="relative w-20 h-24 bg-crema-marfil rounded overflow-hidden flex-shrink-0">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full bg-gris-piedra/10" />
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-playfair font-semibold text-madera-oscura line-clamp-2">
              {item.name}
            </h4>
            <button
              onClick={() => removeItem(item.productId, item.selectedVariant?.id)}
              className="text-gris-piedra hover:text-red-500 transition-colors p-1"
              aria-label="Eliminar producto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {item.selectedVariant && (
            <p className="text-xs text-gris-piedra font-dm-sans mt-1 uppercase">
              {item.selectedVariant.label}: {item.selectedVariant.value}
            </p>
          )}
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-gris-piedra/30 rounded-md">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariant?.id)}
              className="px-2 py-1 text-gris-piedra hover:text-madera-oscura transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-dm-sans text-madera-oscura">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariant?.id)}
              className="px-2 py-1 text-gris-piedra hover:text-madera-oscura transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="font-semibold text-madera-oscura text-sm">
            {formatPrice(price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}
