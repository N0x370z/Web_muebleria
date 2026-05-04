import { z } from 'zod'

// ── Producto ────────────────────────────────────────────────────────

export const ProductCreateSchema = z.object({
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones'),
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  isCustomizable: z.boolean().default(false),
  categoryId: z.string().cuid(),
})

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>

// ── Filtros del catálogo ────────────────────────────────────────────

export const CatalogFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z
    .enum(['price_asc', 'price_desc', 'newest', 'best_seller'])
    .default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  q: z.string().max(100).optional(),
})

export type CatalogFiltersInput = z.infer<typeof CatalogFiltersSchema>

// ── Checkout ────────────────────────────────────────────────────────

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{8,20}$/, 'Número de teléfono inválido')
    .optional(),
  street: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{5}$/, 'Código postal debe tener 5 dígitos'),
  country: z.string().default('México'),
})

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().cuid(),
        quantity: z.number().int().min(1),
        selectedVariantId: z.string().cuid().optional(),
      })
    )
    .min(1, 'El carrito no puede estar vacío'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['stripe', 'mercadopago']),
})

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>

// ── Cotización ──────────────────────────────────────────────────────

export const QuoteSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(20).max(2000),
  imageUrl: z.string().url().optional(),
})

export type QuoteInput = z.infer<typeof QuoteSchema>

// ── Autenticación ───────────────────────────────────────────────────

export const RegisterSchema = z
  .object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe tener mayúsculas, minúsculas y un número'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type LoginInput = z.infer<typeof LoginSchema>

// ── Reseña ──────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(10).max(2000),
})

export type ReviewInput = z.infer<typeof ReviewSchema>

// ── Cotización ─────────────────────────────────────────────────────

export const QuoteSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export type QuoteInput = z.infer<typeof QuoteSchema>
