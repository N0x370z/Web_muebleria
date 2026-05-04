import { prisma } from '@/lib/prisma'
import { 
  ShoppingCart, 
  DollarSign, 
  MessageSquare, 
  Users,
  TrendingUp,
  Package
} from 'lucide-react'

export default async function AdminDashboard() {
  const [
    orderCount,
    totalRevenue,
    quoteCount,
    userCount,
    productCount,
    recentOrders
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
    })
  ])

  const stats = [
    { label: 'Ventas Totales', value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalRevenue._sum.total || 0), icon: <DollarSign className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pedidos', value: orderCount.toString(), icon: <ShoppingCart className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Cotizaciones Pendientes', value: quoteCount.toString(), icon: <MessageSquare className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Clientes', value: userCount.toString(), icon: <Users className="text-purple-600" />, bg: 'bg-purple-50' },
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
            <button className="text-xs font-bold text-dorado-suave uppercase tracking-widest hover:text-madera-oscura transition-colors">
              Ver todos
            </button>
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

        {/* Inventory Status Placeholder */}
        <section className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-crema-marfil flex items-center justify-between">
            <h2 className="font-bold text-madera-oscura flex items-center gap-2">
              <Package size={18} className="text-dorado-suave" />
              Estado del Inventario
            </h2>
          </div>
          <div className="p-10 text-center space-y-4">
            <p className="text-4xl font-bold text-madera-oscura">{productCount}</p>
            <p className="text-sm text-gris-piedra max-w-xs mx-auto">
              Productos activos en el catálogo. Próximamente alertas de stock bajo y métricas de popularidad.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
