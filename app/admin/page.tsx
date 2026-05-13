import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ShoppingCart, 
  DollarSign, 
  MessageSquare, 
  Users,
  TrendingUp,
  Package,
  CheckCircle
} from 'lucide-react'

export default async function AdminDashboard() {
  const [
    orderCount,
    totalRevenue,
    quoteCount,
    userCount,
    productCount,
    recentOrders,
    lowStockProducts
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.quote.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    prisma.product.findMany({
      where: { stock: { lt: 5 } },
      select: { id: true, name: true, stock: true },
      orderBy: { stock: 'asc' },
      take: 5
    })
  ])

  const stats = [
    { label: 'Ventas Totales', value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalRevenue._sum.total || 0), icon: <DollarSign className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pedidos', value: orderCount.toString(), icon: <ShoppingCart className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Cotizaciones Pendientes', value: quoteCount.toString(), icon: <MessageSquare className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Clientes', value: userCount.toString(), icon: <Users className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Productos', value: productCount.toString(), icon: <Package className="text-orange-600" />, bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Dashboard</h1>
        <p className="text-gris-piedra font-dm-sans">Resumen operativo de MaderArte</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gris-piedra/10 shadow-sm flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gris-piedra uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-madera-oscura">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <section className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-crema-marfil flex items-center justify-between">
            <h2 className="font-bold text-madera-oscura flex items-center gap-2">
              <TrendingUp size={18} className="text-dorado-suave" />
              Últimos Pedidos
            </h2>
            <Link href="/admin/pedidos" className="text-xs font-bold text-dorado-suave uppercase tracking-widest hover:text-madera-oscura transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-crema-marfil">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-crema-marfil/20 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-madera-oscura">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] text-gris-piedra">{order.user?.name || 'Invitado'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dorado-suave">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(order.total)}
                    </p>
                    <p className="text-[10px] text-gris-piedra uppercase font-bold">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gris-piedra text-sm italic">
                No hay pedidos registrados aún.
              </div>
            )}
          </div>
        </section>

        {/* Low Stock Inventory */}
        <section className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-crema-marfil flex items-center justify-between">
            <h2 className="font-bold text-madera-oscura flex items-center gap-2">
              <Package size={18} className="text-dorado-suave" />
              Alertas de Inventario
            </h2>
            <Link href="/admin/productos" className="text-xs font-bold text-dorado-suave uppercase tracking-widest hover:text-madera-oscura transition-colors">
              Gestionar
            </Link>
          </div>
          <div className="divide-y divide-crema-marfil">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 flex items-center justify-between hover:bg-crema-marfil/20 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-madera-oscura">{product.name}</p>
                    <p className="text-[10px] text-gris-piedra uppercase tracking-wider">Unidades disponibles</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-green-600 text-sm font-medium">
                <CheckCircle className="mx-auto mb-2" size={24} />
                Todo el inventario está al día.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
