import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

// ── Tipos del store ────────────────────────────────────────────────

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Acciones del carrito
  addItem: (
    item: Omit<CartItem, 'quantity'>,
    quantity?: number
  ) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string
  ) => void
  clearCart: () => void

  // Control del drawer
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Selectores computados
  getItemCount: () => number
  getSubtotal: () => number
}

// ── Implementación ─────────────────────────────────────────────────


export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.selectedVariant?.id === newItem.selectedVariant?.id
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            }
            return { items: updatedItems }
          }

          return {
            items: [...state.items, { ...newItem, quantity }],
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.selectedVariant?.id === variantId
              )
          ),
        }))
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId &&
            item.selectedVariant?.id === variantId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((total, item) => {
          const variantModifier = item.selectedVariant?.priceModifier ?? 0
          return total + (item.price + variantModifier) * item.quantity
        }, 0),
    }),
    {
      name: 'maderarte-cart',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir los items, no el estado del drawer
      partialize: (state) => ({ items: state.items }),
    }
  )
)
