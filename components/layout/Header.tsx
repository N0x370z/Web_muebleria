'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Search, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cart'

// ── Tipos ──────────────────────────────────────────────────────────

interface NavLink {
  href: string
  label: string
}

// ── Datos de navegación ────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/blog', label: 'Blog' },
  { href: '/cotizar', label: 'Cotizar' },
  { href: '/contacto', label: 'Contacto' },
]

// ── Componente ─────────────────────────────────────────────────────

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getItemCount, openCart } = useCartStore()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname?.startsWith(href)

  return (
    <>
      {/* ── Barra superior ── */}
      <div className="bg-madera-oscura text-crema-marfil/70 text-xs font-dm-sans py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span>Envío gratis a partir de $8,000 MXN</span>
          <a
            href="tel:+525512345678"
            className="flex items-center gap-1.5 hover:text-crema-marfil transition-colors"
            aria-label="Llamar a MaderArte"
          >
            <Phone className="h-3 w-3" aria-hidden="true" />
            +52 55 1234 5678
          </a>
        </div>
      </div>

      {/* ── Header principal ── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-blanco-hueso/95 backdrop-blur-md shadow-card'
            : 'bg-blanco-hueso'
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
              aria-label="MaderArte — Ir al inicio"
            >
              <span className="font-playfair text-2xl font-bold text-madera-oscura tracking-tight">
                Mader<span className="text-dorado-suave">Arte</span>
              </span>
            </Link>

            {/* ── Navegación desktop ── */}
            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Navegación principal"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`font-dm-sans text-sm font-medium transition-colors duration-200 relative
                    after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-dorado-suave
                    after:transition-all after:duration-300 hover:after:w-full
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded
                    ${
                      isActive(href)
                        ? 'text-dorado-suave after:w-full'
                        : 'text-madera-oscura hover:text-dorado-suave'
                    }`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* ── Acciones ── */}
            <div className="flex items-center gap-2">
              {/* Búsqueda */}
              <button
                className="btn-ghost p-2 rounded-full"
                aria-label="Abrir buscador"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Carrito */}
              <button
                onClick={openCart}
                className="relative btn-ghost p-2 rounded-full"
                aria-label={
                  itemCount > 0
                    ? `Abrir carrito — ${itemCount} producto${itemCount !== 1 ? 's' : ''}`
                    : 'Abrir carrito'
                }
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
                               rounded-full bg-dorado-suave text-blanco-hueso font-courier
                               text-[10px] font-bold"
                    aria-hidden="true"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden btn-ghost p-2 rounded-full"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Menú móvil (drawer lateral) ── */}
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-30 bg-madera-oscura/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Drawer */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className={`fixed inset-y-0 right-0 z-40 w-72 bg-blanco-hueso shadow-xl
                       flex flex-col transition-transform duration-300 md:hidden
                       ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-crema-marfil">
              <span className="font-playfair text-xl font-bold text-madera-oscura">
                Mader<span className="text-dorado-suave">Arte</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-ghost p-2 rounded-full"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-1" aria-label="Menú móvil">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-3 rounded font-dm-sans text-sm font-medium
                             transition-colors duration-200
                             ${
                               isActive(href)
                                 ? 'bg-crema-marfil text-dorado-suave'
                                 : 'text-madera-oscura hover:bg-crema-marfil hover:text-dorado-suave'
                             }`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-4 border-t border-crema-marfil">
              <a
                href="tel:+525512345678"
                className="flex items-center gap-2 text-sm text-gris-piedra hover:text-dorado-suave transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                +52 55 1234 5678
              </a>
            </div>
          </div>
        </>
      </header>
    </>
  )
}

export { Header }
