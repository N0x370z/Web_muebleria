import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  FileText, 
  Layers, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react'

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingCart size={18} /> },
  { href: '/admin/productos', label: 'Productos', icon: <Package size={18} /> },
  { href: '/admin/categorias', label: 'Categorías', icon: <Layers size={18} /> },
  { href: '/admin/cotizaciones', label: 'Cotizaciones', icon: <MessageSquare size={18} /> },
  { href: '/admin/blog', label: 'Blog', icon: <FileText size={18} /> },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-blanco-hueso">
      {/* Sidebar */}
      <aside className="w-64 bg-madera-oscura text-crema-marfil flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-crema-marfil/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair text-xl font-bold">
              Mader<span className="text-dorado-suave">Arte</span>
            </span>
            <span className="text-[10px] font-bold bg-dorado-suave text-white px-2 py-0.5 rounded uppercase tracking-widest">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-crema-marfil/70 hover:text-white hover:bg-crema-marfil/10 transition-all"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-crema-marfil/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-crema-marfil/70 hover:text-white hover:bg-crema-marfil/10 transition-all"
          >
            <Home size={18} />
            Ver Tienda
          </Link>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
