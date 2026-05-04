/**
 * Tipos TypeScript compartidos entre capas de MaderArte.
 * Refleja los modelos Prisma pero como interfaces TS para el cliente.
 */

// ── Enumeraciones ──────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'EDITOR' | 'ADMIN'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type QuoteStatus = 'PENDING' | 'IN_REVIEW' | 'RESPONDED' | 'CLOSED'

export type BlogCategory =
  | 'DECORACION'
  | 'TENDENCIAS'
  | 'GUIAS_COMPRA'
  | 'CUIDADO_MUEBLES'

// ── Catálogo ───────────────────────────────────────────────────────

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  imageUrl?: string
  order: number
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  order: number
}

export interface ProductVariant {
  id: string
  type: 'color' | 'material' | 'acabado'
  label: string
  value: string
  imageUrl?: string
  priceModifier: number
  stock: number
}

export interface ProductTag {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  isCustomizable: boolean
  isActive: boolean
  category: Category
  categoryId: string
  variants: ProductVariant[]
  images: ProductImage[]
  tags: ProductTag[]
  createdAt: string
  updatedAt: string
}

/** Versión ligera para listados y tarjetas */
export interface ProductCard {
  id: string
  slug: string
  name: string
  price: number
  comparePrice?: number
  stock: number
  isCustomizable: boolean
  category: Pick<Category, 'id' | 'slug' | 'name'>
  images: Pick<ProductImage, 'url' | 'alt'>[]
  tags: Pick<ProductTag, 'name' | 'slug'>[]
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  title?: string
  body: string
  createdAt: string
}

// ── Carrito ────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  imageUrl?: string
  quantity: number
  selectedVariant?: Pick<ProductVariant, 'id' | 'type' | 'label' | 'value' | 'priceModifier'>
}

// ── Pedidos ────────────────────────────────────────────────────────

export interface ShippingAddress {
  fullName: string
  email: string
  phone?: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  imageUrl?: string
  variantLabel?: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  shippingAddress: ShippingAddress
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

// ── Cotizaciones ───────────────────────────────────────────────────

export interface Quote {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  imageUrl?: string
  status: QuoteStatus
  createdAt: string
}

// ── Blog ───────────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  readingTime: number
  published: boolean
  publishedAt?: string
  category: BlogCategory
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ── API responses ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── Filtros del catálogo ───────────────────────────────────────────

export interface CatalogFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  materials?: string[]
  colors?: string[]
  inStock?: boolean
  tags?: string[]
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'best_seller'
  page?: number
  pageSize?: number
  q?: string
}
