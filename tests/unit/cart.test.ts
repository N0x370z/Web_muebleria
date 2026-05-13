/**
 * Tests unitarios para el cart store (Zustand).
 * Se aíslan del localStorage usando vi.mock para que corran en jsdom puro.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock de zustand/middleware para evitar dependencia de localStorage en tests
vi.mock('zustand/middleware', () => ({
  persist: (fn: (set: unknown, get: unknown) => unknown) => fn,
  createJSONStorage: () => ({}),
}))

// Importar DESPUÉS del mock
import { useCartStore } from '@/store/cart'
import type { CartItem } from '@/types'

const makeItem = (overrides: Partial<CartItem> = {}): Omit<CartItem, 'quantity'> => ({
  productId: 'prod-001',
  slug: 'sofa-venecia',
  name: 'Sofá Venecia',
  price: 12500,
  imageUrl: '/img/sofa.jpg',
  ...overrides,
})

describe('useCartStore', () => {
  beforeEach(() => {
    // Resetear el estado del store antes de cada test
    useCartStore.setState({ items: [], isOpen: false })
  })

  // ── addItem ─────────────────────────────────────────────────────────────
  describe('addItem', () => {
    it('agrega un item nuevo al carrito', () => {
      useCartStore.getState().addItem(makeItem())
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(1)
      expect(items[0].name).toBe('Sofá Venecia')
    })

    it('incrementa cantidad si el mismo producto ya existe', () => {
      const { addItem } = useCartStore.getState()
      addItem(makeItem())
      addItem(makeItem())
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it('agrega con cantidad personalizada', () => {
      useCartStore.getState().addItem(makeItem(), 3)
      expect(useCartStore.getState().items[0].quantity).toBe(3)
    })

    it('trata variantes distintas como items separados', () => {
      const { addItem } = useCartStore.getState()
      addItem(makeItem({ selectedVariant: { id: 'var-1', type: 'color', label: 'Roble', value: 'roble', priceModifier: 0 } }))
      addItem(makeItem({ selectedVariant: { id: 'var-2', type: 'color', label: 'Nogal', value: 'nogal', priceModifier: 500 } }))
      expect(useCartStore.getState().items).toHaveLength(2)
    })

    it('incrementa cantidad correctamente para variante existente', () => {
      const variant = { id: 'var-1', type: 'color' as const, label: 'Roble', value: 'roble', priceModifier: 0 }
      const { addItem } = useCartStore.getState()
      addItem(makeItem({ selectedVariant: variant }), 2)
      addItem(makeItem({ selectedVariant: variant }), 3)
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(5)
    })
  })

  // ── removeItem ───────────────────────────────────────────────────────────
  describe('removeItem', () => {
    it('elimina el item del carrito', () => {
      const { addItem, removeItem } = useCartStore.getState()
      addItem(makeItem())
      removeItem('prod-001')
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('no elimina otros items', () => {
      const { addItem, removeItem } = useCartStore.getState()
      addItem(makeItem({ productId: 'prod-001' }))
      addItem(makeItem({ productId: 'prod-002', slug: 'mesa-oslo', name: 'Mesa Oslo' }))
      removeItem('prod-001')
      const { items } = useCartStore.getState()
      expect(items).toHaveLength(1)
      expect(items[0].productId).toBe('prod-002')
    })
  })

  // ── updateQuantity ───────────────────────────────────────────────────────
  describe('updateQuantity', () => {
    it('actualiza la cantidad correctamente', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      addItem(makeItem())
      updateQuantity('prod-001', 5)
      expect(useCartStore.getState().items[0].quantity).toBe(5)
    })

    it('elimina el item si la cantidad llega a 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      addItem(makeItem())
      updateQuantity('prod-001', 0)
      expect(useCartStore.getState().items).toHaveLength(0)
    })

    it('elimina el item si la cantidad es negativa', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      addItem(makeItem())
      updateQuantity('prod-001', -1)
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  // ── clearCart ────────────────────────────────────────────────────────────
  describe('clearCart', () => {
    it('vacía el carrito completamente', () => {
      const { addItem, clearCart } = useCartStore.getState()
      addItem(makeItem({ productId: 'p1' }))
      addItem(makeItem({ productId: 'p2', slug: 'mesa', name: 'Mesa' }))
      clearCart()
      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })

  // ── getItemCount ─────────────────────────────────────────────────────────
  describe('getItemCount', () => {
    it('retorna 0 para carrito vacío', () => {
      expect(useCartStore.getState().getItemCount()).toBe(0)
    })

    it('suma las cantidades de todos los items', () => {
      const { addItem } = useCartStore.getState()
      addItem(makeItem({ productId: 'p1' }), 2)
      addItem(makeItem({ productId: 'p2', slug: 'mesa', name: 'Mesa' }), 3)
      expect(useCartStore.getState().getItemCount()).toBe(5)
    })
  })

  // ── getSubtotal ──────────────────────────────────────────────────────────
  describe('getSubtotal', () => {
    it('retorna 0 para carrito vacío', () => {
      expect(useCartStore.getState().getSubtotal()).toBe(0)
    })

    it('calcula el subtotal sin variantes', () => {
      useCartStore.getState().addItem(makeItem({ price: 1000 }), 2)
      expect(useCartStore.getState().getSubtotal()).toBe(2000)
    })

    it('incluye el modificador de variante en el cálculo', () => {
      const variant = { id: 'v1', type: 'material' as const, label: 'Caoba', value: 'caoba', priceModifier: 500 }
      useCartStore.getState().addItem(makeItem({ price: 10000, selectedVariant: variant }), 2)
      // (10000 + 500) * 2 = 21000
      expect(useCartStore.getState().getSubtotal()).toBe(21000)
    })

    it('suma múltiples items con distintos precios', () => {
      const { addItem } = useCartStore.getState()
      addItem(makeItem({ productId: 'p1', price: 5000 }), 1)
      addItem(makeItem({ productId: 'p2', slug: 'mesa', name: 'Mesa', price: 3000 }), 2)
      // 5000 + (3000 * 2) = 11000
      expect(useCartStore.getState().getSubtotal()).toBe(11000)
    })
  })

  // ── Drawer (UI state) ────────────────────────────────────────────────────
  describe('drawer state', () => {
    it('openCart abre el drawer', () => {
      useCartStore.getState().openCart()
      expect(useCartStore.getState().isOpen).toBe(true)
    })

    it('closeCart cierra el drawer', () => {
      useCartStore.getState().openCart()
      useCartStore.getState().closeCart()
      expect(useCartStore.getState().isOpen).toBe(false)
    })

    it('toggleCart alterna el estado', () => {
      const store = useCartStore.getState()
      store.toggleCart()
      expect(useCartStore.getState().isOpen).toBe(true)
      store.toggleCart()
      expect(useCartStore.getState().isOpen).toBe(false)
    })
  })
})
