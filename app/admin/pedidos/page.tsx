import { prisma } from '@/lib/prisma'
import { 
  ShoppingCart, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } }
    }
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  const statusVariants: Record<string, any> = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    IN_PRODUCTION: 'dark',
    SHIPPED: 'dark',
    DELIVERED: 'success',
    CANCELLED: 'danger',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Gestión de Pedidos</h1>
          <p className="text-gris-piedra font-dm-sans">Control y seguimiento de ventas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gris-piedra" />
            <input 
              type="text" 
              placeholder="Buscar pedido..." 
              className="pl-9 pr-4 py-2 bg-white border border-gris-piedra/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dorado-suave/20"
            />
          </div>
          <button className="p-2 bg-white border border-gris-piedra/20 rounded-lg hover:bg-crema-marfil transition-colors">
            <Filter className="h-4 w-4 text-gris-piedra" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-crema-marfil/30 text-[10px] font-bold uppercase tracking-widest text-gris-piedra border-b border-gris-piedra/10">
                <th className="px-6 py-4">ID Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-piedra/10">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-crema-marfil/20 transition-colors text-sm">
                    <td className="px-6 py-4 font-courier font-bold text-madera-oscura">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-madera-oscura">{order.user?.name || 'Invitado'}</p>
                      <p className="text-xs text-gris-piedra">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-gris-piedra">
                      {new Date(order.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[order.status] || 'dark'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-gris-piedra">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-dorado-suave">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-dorado-suave">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gris-piedra italic">
                    No hay pedidos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
