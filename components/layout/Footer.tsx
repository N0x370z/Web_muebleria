import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

// ── Datos ──────────────────────────────────────────────────────────

const CATALOG_LINKS = [
  { href: '/catalogo/salas', label: 'Salas' },
  { href: '/catalogo/comedores', label: 'Comedores' },
  { href: '/catalogo/recamaras', label: 'Recámaras' },
  { href: '/catalogo/oficinas', label: 'Oficinas' },
  { href: '/catalogo/exteriores', label: 'Exteriores' },
]

const INFO_LINKS = [
  { href: '/nosotros', label: 'Quiénes Somos' },
  { href: '/blog', label: 'Blog de Inspiración' },
  { href: '/cotizar', label: 'Solicitar Cotización' },
  { href: '/contacto', label: 'Contacto' },
]

// ── Componente ─────────────────────────────────────────────────────

const Footer = () => {
  return (
    <footer
      className="bg-madera-oscura text-crema-marfil/80"
      aria-label="Pie de página"
    >
      {/* ── Contenido principal ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Marca ── */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-dorado-suave rounded"
              aria-label="MaderArte — Ir al inicio"
            >
              <span className="font-playfair text-2xl font-bold text-crema-marfil tracking-tight">
                Mader<span className="text-dorado-suave">Arte</span>
              </span>
            </Link>
            <p className="font-dm-sans text-sm leading-relaxed text-crema-marfil/60 mb-6">
              Mueblería de alto nivel con diseños exclusivos. Creamos espacios
              que cuentan historias y reflejan tu personalidad.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/maderarte"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-crema-marfil/20 text-crema-marfil/60
                           hover:border-dorado-suave hover:text-dorado-suave transition-colors duration-200"
                aria-label="MaderArte en Instagram (abre en nueva pestaña)"
              >
                {/* Instagram SVG */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/maderarte"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-crema-marfil/20 text-crema-marfil/60
                           hover:border-dorado-suave hover:text-dorado-suave transition-colors duration-200"
                aria-label="MaderArte en Facebook (abre en nueva pestaña)"
              >
                {/* Facebook SVG */}
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Catálogo ── */}
          <div>
            <h3 className="font-playfair text-crema-marfil text-base font-semibold mb-4">
              Catálogo
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {CATALOG_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-dm-sans text-sm text-crema-marfil/60 hover:text-dorado-suave
                               transition-colors duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Información ── */}
          <div>
            <h3 className="font-playfair text-crema-marfil text-base font-semibold mb-4">
              Información
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {INFO_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-dm-sans text-sm text-crema-marfil/60 hover:text-dorado-suave
                               transition-colors duration-200
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado-suave rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contacto ── */}
          <div>
            <h3 className="font-playfair text-crema-marfil text-base font-semibold mb-4">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <a
                  href="tel:+525512345678"
                  className="flex items-start gap-3 text-sm text-crema-marfil/60
                             hover:text-dorado-suave transition-colors duration-200"
                  aria-label="Teléfono: +52 55 1234 5678"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                  +52 55 1234 5678
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@maderarte.com"
                  className="flex items-start gap-3 text-sm text-crema-marfil/60
                             hover:text-dorado-suave transition-colors duration-200"
                  aria-label="Email: hola@maderarte.com"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                  hola@maderarte.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-crema-marfil/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  Av. Insurgentes Sur 1234,<br />
                  Col. Del Valle, CDMX
                </span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded border border-crema-marfil/10 bg-crema-marfil/5">
              <p className="font-dm-sans text-xs text-crema-marfil/50 mb-1">
                Horario de atención
              </p>
              <p className="font-dm-sans text-sm text-crema-marfil/70">
                Lun – Vie: 9:00 – 18:00<br />
                Sáb: 10:00 – 15:00
              </p>
            </div>
          </div>
        </div>

        {/* ── Separador ── */}
        <div className="mt-12 pt-6 border-t border-crema-marfil/10 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="font-dm-sans text-xs text-crema-marfil/40 text-center sm:text-left">
            © {new Date().getFullYear()} MaderArte. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacidad"
              className="font-dm-sans text-xs text-crema-marfil/40 hover:text-crema-marfil/70
                         transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-dorado-suave rounded"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="font-dm-sans text-xs text-crema-marfil/40 hover:text-crema-marfil/70
                         transition-colors focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-dorado-suave rounded"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
