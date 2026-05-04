import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react'

const statusMap = {
  PENDING: { label: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
  CONFIRMED: { label: 'Confirmado', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle2 },
  IN_PRODUCTION: { label: 'En Producción', color: 'text-purple-600', bg: 'bg-purple-50', icon: Package },
  SHIPPED: { label: 'Enviado', color: 'text-orange-600', bg: 'bg-orange-50', icon: Truck },
  DELIVERED: { label: 'Entregado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/cuenta/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/cuenta/login')
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cuenta/perfil" className="text-gris-piedra hover:text-dorado-suave transition-colors">
          Mi Cuenta
        </Link>
        <ChevronRight className="h-4 w-4 text-gris-piedra" />
        <h1 className="font-playfair text-3xl font-bold text-madera-oscura">Mis Pedidos</h1>
      </div>

      <div className="space-y-6">
        {user.orders.length > 0 ? (
          user.orders.map((order) => {
            const statusInfo = statusMap[order.status]
            const StatusIcon = statusInfo.icon

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gris-piedra/10 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-crema-marfil/30 p-4 md:p-6 border-b border-gris-piedra/10 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gris-piedra tracking-wider mb-1">Pedido</p>
                      <p className="text-sm font-courier text-madera-oscura font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gris-piedra tracking-wider mb-1">Fecha</p>
                      <p className="text-sm text-madera-oscura">
                        {new Date(order.createdAt).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gris-piedra tracking-wider mb-1">Total</p>
                      <p className="text-sm font-bold text-dorado-suave">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">{statusInfo.label}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="h-16 w-16 bg-crema-marfil rounded-lg overflow-hidden shrink-0 border border-gris-piedra/10">
                          {item.product.images?.[0] ? (
                             <Image
                               src={item.product.images[0].url}
                               alt={item.product.name}
                               width={64}
                               height={64}
                               className="h-full w-full object-cover"
                             />
                          ) : (
                             <div className="h-full w-full flex items-center justify-center text-gris-piedra/30">
                               <Package className="h-6 w-6" />
                             </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-madera-oscura truncate">{item.product.name}</h4>
                          <p className="text-xs text-gris-piedra">
                            Cant: {item.quantity} • {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-crema-marfil flex justify-end">
                    <button className="btn-secondary text-xs px-4 py-2">
                      Ver detalle del pedido
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gris-piedra/10 p-12 text-center">
            <div className="h-16 w-16 bg-crema-marfil rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gris-piedra/30" />
            </div>
            <h2 className="text-xl font-bold text-madera-oscura mb-2">No tienes pedidos aún</h2>
            <p className="text-gris-piedra text-sm mb-6 max-w-xs mx-auto">
              Cuando realices tu primera compra, podrás ver el historial y estado de tus pedidos aquí.
            </p>
            <Link href="/catalogo">
              <button className="btn-primary px-8 py-3">Explorar Catálogo</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
