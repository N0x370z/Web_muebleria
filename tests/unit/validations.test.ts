import { describe, it, expect } from 'vitest'
import {
  ProductCreateSchema,
  CatalogFiltersSchema,
  ShippingAddressSchema,
  QuoteSchema,
  RegisterSchema,
  LoginSchema,
  ReviewSchema,
} from '@/lib/validations'

// ── ProductCreateSchema ──────────────────────────────────────────────────────
describe('ProductCreateSchema', () => {
  const validProduct = {
    slug: 'sofa-venecia',
    name: 'Sofá Venecia',
    description: 'Descripción completa del sofá Venecia',
    price: 12500,
    stock: 3,
    isCustomizable: false,
    categoryId: 'clm1234567890',
  }

  it('acepta un producto válido', () => {
    const result = ProductCreateSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('rechaza slug con mayúsculas', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, slug: 'Sofa-Venecia' })
    expect(result.success).toBe(false)
  })

  it('rechaza slug con espacios', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, slug: 'sofa venecia' })
    expect(result.success).toBe(false)
  })

  it('rechaza precio negativo', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, price: -100 })
    expect(result.success).toBe(false)
  })

  it('rechaza precio cero', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, price: 0 })
    expect(result.success).toBe(false)
  })

  it('acepta comparePrice opcional', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, comparePrice: 15000 })
    expect(result.success).toBe(true)
  })

  it('rechaza stock negativo', () => {
    const result = ProductCreateSchema.safeParse({ ...validProduct, stock: -1 })
    expect(result.success).toBe(false)
  })
})

// ── CatalogFiltersSchema ─────────────────────────────────────────────────────
describe('CatalogFiltersSchema', () => {
  it('acepta filtros vacíos (usa defaults)', () => {
    const result = CatalogFiltersSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sort).toBe('newest')
      expect(result.data.page).toBe(1)
      expect(result.data.pageSize).toBe(20)
    }
  })

  it('acepta todos los valores de sort', () => {
    for (const sort of ['price_asc', 'price_desc', 'newest', 'best_seller'] as const) {
      expect(CatalogFiltersSchema.safeParse({ sort }).success).toBe(true)
    }
  })

  it('rechaza sort inválido', () => {
    expect(CatalogFiltersSchema.safeParse({ sort: 'random' }).success).toBe(false)
  })

  it('coerce precios de string a number', () => {
    const result = CatalogFiltersSchema.safeParse({ minPrice: '1000', maxPrice: '5000' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.minPrice).toBe(1000)
      expect(result.data.maxPrice).toBe(5000)
    }
  })

  it('rechaza pageSize mayor a 50', () => {
    expect(CatalogFiltersSchema.safeParse({ pageSize: 100 }).success).toBe(false)
  })
})

// ── ShippingAddressSchema ────────────────────────────────────────────────────
describe('ShippingAddressSchema', () => {
  const validAddress = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    street: 'Av. Insurgentes Sur 1234',
    city: 'Ciudad de México',
    state: 'CDMX',
    postalCode: '03100',
    country: 'México',
  }

  it('acepta una dirección completa válida', () => {
    expect(ShippingAddressSchema.safeParse(validAddress).success).toBe(true)
  })

  it('rechaza email malformado', () => {
    expect(ShippingAddressSchema.safeParse({ ...validAddress, email: 'no-es-email' }).success).toBe(false)
  })

  it('rechaza código postal con letras', () => {
    expect(ShippingAddressSchema.safeParse({ ...validAddress, postalCode: '0310A' }).success).toBe(false)
  })

  it('rechaza código postal con menos de 5 dígitos', () => {
    expect(ShippingAddressSchema.safeParse({ ...validAddress, postalCode: '1234' }).success).toBe(false)
  })

  it('acepta dirección sin teléfono (opcional)', () => {
    const { ...addr } = validAddress
    expect(ShippingAddressSchema.safeParse(addr).success).toBe(true)
  })
})

// ── QuoteSchema ──────────────────────────────────────────────────────────────
describe('QuoteSchema', () => {
  const validQuote = {
    name: 'María García',
    email: 'maria@example.com',
    message: 'Me gustaría cotizar un juego de comedor para 8 personas con madera de encino.',
  }

  it('acepta cotización válida', () => {
    expect(QuoteSchema.safeParse(validQuote).success).toBe(true)
  })

  it('rechaza mensaje muy corto', () => {
    expect(QuoteSchema.safeParse({ ...validQuote, message: 'Hola' }).success).toBe(false)
  })

  it('acepta URL de imagen válida', () => {
    const result = QuoteSchema.safeParse({ ...validQuote, imageUrl: 'https://example.com/ref.jpg' })
    expect(result.success).toBe(true)
  })

  it('acepta imageUrl vacío (string literal vacío)', () => {
    const result = QuoteSchema.safeParse({ ...validQuote, imageUrl: '' })
    expect(result.success).toBe(true)
  })

  it('rechaza imageUrl con URL malformada', () => {
    const result = QuoteSchema.safeParse({ ...validQuote, imageUrl: 'no-es-url' })
    expect(result.success).toBe(false)
  })
})

// ── RegisterSchema ───────────────────────────────────────────────────────────
describe('RegisterSchema', () => {
  const validUser = {
    name: 'Ana López',
    email: 'ana@example.com',
    password: 'Segura123',
    confirmPassword: 'Segura123',
  }

  it('acepta registro válido', () => {
    expect(RegisterSchema.safeParse(validUser).success).toBe(true)
  })

  it('rechaza contraseñas que no coinciden', () => {
    const result = RegisterSchema.safeParse({ ...validUser, confirmPassword: 'Diferente123' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('confirmPassword'))).toBe(true)
    }
  })

  it('rechaza contraseña sin mayúscula', () => {
    expect(RegisterSchema.safeParse({ ...validUser, password: 'segura123', confirmPassword: 'segura123' }).success).toBe(false)
  })

  it('rechaza contraseña sin número', () => {
    expect(RegisterSchema.safeParse({ ...validUser, password: 'SeguridadAlta', confirmPassword: 'SeguridadAlta' }).success).toBe(false)
  })

  it('rechaza contraseña menor a 8 caracteres', () => {
    expect(RegisterSchema.safeParse({ ...validUser, password: 'Seg1', confirmPassword: 'Seg1' }).success).toBe(false)
  })
})

// ── LoginSchema ──────────────────────────────────────────────────────────────
describe('LoginSchema', () => {
  it('acepta credenciales válidas', () => {
    expect(LoginSchema.safeParse({ email: 'user@test.com', password: '123' }).success).toBe(true)
  })

  it('rechaza email malformado', () => {
    expect(LoginSchema.safeParse({ email: 'noEmail', password: '123' }).success).toBe(false)
  })

  it('rechaza contraseña vacía', () => {
    expect(LoginSchema.safeParse({ email: 'user@test.com', password: '' }).success).toBe(false)
  })
})

// ── ReviewSchema ─────────────────────────────────────────────────────────────
describe('ReviewSchema', () => {
  const validReview = {
    productId: 'clm1234567890',
    rating: 5,
    body: 'Excelente producto, muy resistente y elegante. Superó mis expectativas.',
  }

  it('acepta reseña válida', () => {
    expect(ReviewSchema.safeParse(validReview).success).toBe(true)
  })

  it('rechaza rating fuera de rango (> 5)', () => {
    expect(ReviewSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false)
  })

  it('rechaza rating fuera de rango (< 1)', () => {
    expect(ReviewSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false)
  })

  it('rechaza body muy corto', () => {
    expect(ReviewSchema.safeParse({ ...validReview, body: 'Ok' }).success).toBe(false)
  })

  it('acepta rating decimal redondeado', () => {
    // Zod.int() rechaza decimales
    expect(ReviewSchema.safeParse({ ...validReview, rating: 4.5 }).success).toBe(false)
  })
})
