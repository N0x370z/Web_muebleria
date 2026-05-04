import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import type { ProductCard as ProductCardType } from '@/types'

// ── Tipos ──────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: ProductCardType
}

// ── Helpers ────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(price)

const getDiscountPercent = (price: number, comparePrice: number): number =>
  Math.round(((comparePrice - price) / comparePrice) * 100)

// ── Mapa de etiquetas → variante Badge ────────────────────────────

const TAG_BADGE_VARIANT: Record<
  string,
  'gold' | 'dark' | 'outline' | 'success' | 'danger'
> = {
  nuevo: 'dark',
  oferta: 'danger',
  'mas-vendido': 'gold',
  personalizable: 'outline',
}

// ── Componente ─────────────────────────────────────────────────────

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    slug,
    name,
    price,
    comparePrice,
    stock,
    images,
    tags,
    category,
  } = product

  const mainImage = images[0]
  const hoverImage = images[1]
  const isOnSale = comparePrice !== undefined && comparePrice > price
  const isLowStock = stock > 0 && stock <= 5
  const isOutOfStock = stock === 0

  return (
    <article
      className="group relative flex flex-col bg-blanco-hueso rounded-xl overflow-hidden
                 shadow-card hover:shadow-card-hover transition-shadow duration-300"
      aria-label={`Producto: ${name}`}
    >
      {/* ── Imagen ── */}
      <Link
        href={`/catalogo/producto/${slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-crema-marfil
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave"
        tabIndex={0}
        aria-label={`Ver ${name}`}
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage.url}
              alt={mainImage.alt || name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${
                hoverImage ? 'group-hover:opacity-0' : ''
              }`}
              priority={false}
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt || `${name} — vista alternativa`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100
                           transition-opacity duration-500"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <ImagePlaceholder aspectRatio="4/5" label={name} className="absolute inset-0 h-full" />
        )}

        {/* ── Overlay estado de stock ── */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 bg-madera-oscura/40 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="font-courier text-crema-marfil text-sm tracking-widest uppercase">
              Agotado
            </span>
          </div>
        )}

        {/* ── Badges sobre imagen ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5" aria-hidden="true">
          {isOnSale && (
            <Badge variant="danger">
              -{getDiscountPercent(price, comparePrice!)}%
            </Badge>
          )}
          {tags
            .filter((t) => TAG_BADGE_VARIANT[t.slug])
            .slice(0, 2)
            .map((tag) => (
              <Badge key={tag.slug} variant={TAG_BADGE_VARIANT[tag.slug] ?? 'outline'}>
                {tag.name}
              </Badge>
            ))}
        </div>

        {/* ── Wishlist ── */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-blanco-hueso/90
                     text-gris-piedra hover:text-dorado-suave
                     opacity-0 group-hover:opacity-100 transition-all duration-200
                     focus-visible:opacity-100 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-dorado-suave"
          aria-label={`Agregar ${name} a favoritos`}
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
        </button>
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Categoría */}
        <Link
          href={`/catalogo/${category.slug}`}
          className="font-courier text-[10px] tracking-widest text-gris-piedra uppercase
                     hover:text-dorado-suave transition-colors mb-1.5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
        >
          {category.name}
        </Link>

        {/* Nombre */}
        <Link
          href={`/catalogo/producto/${slug}`}
          className="font-playfair text-base font-semibold text-madera-oscura
                     hover:text-dorado-suave transition-colors leading-snug mb-3
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
        >
          {name}
        </Link>

        {/* Precio */}
        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          <span className="price text-lg font-semibold text-madera-oscura">
            {formatPrice(price)}
          </span>
          {isOnSale && (
            <span className="price-compare text-sm">
              {formatPrice(comparePrice!)}
            </span>
          )}
        </div>

        {/* Stock badge */}
        {isLowStock && !isOutOfStock && (
          <p
            className="font-dm-sans text-xs text-amber-700 mt-2"
            role="status"
            aria-live="polite"
          >
            ¡Últimas {stock} unidades!
          </p>
        )}
      </div>
    </article>
  )
}

export { ProductCard }
