import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { User, MapPin, Package } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/cuenta/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      addresses: true,
      _count: {
        select: { orders: true },
      },
    },
  })

  if (!user) {
    redirect('/cuenta/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-playfair text-4xl font-bold text-madera-oscura mb-8">Mi Cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gris-piedra/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-dorado-suave/20 flex items-center justify-center">
                <User className="h-8 w-8 text-dorado-suave" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-madera-oscura">{user.name}</h2>
                <p className="text-sm text-gris-piedra">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-crema-marfil">
              <div className="flex justify-between text-sm">
                <span className="text-gris-piedra">Pedidos realizados</span>
                <span className="font-bold text-madera-oscura">{user._count.orders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gris-piedra">Miembro desde</span>
                <span className="font-bold text-madera-oscura">
                  {new Date(user.createdAt).toLocaleDateString('es-MX', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Direcciones */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-madera-oscura flex items-center gap-2">
                <MapPin className="h-5 w-5 text-dorado-suave" />
                Mis Direcciones
              </h3>
              <button className="text-sm font-medium text-dorado-suave hover:text-madera-oscura transition-colors">
                Agregar nueva
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.length > 0 ? (
                user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white p-4 rounded-lg border border-gris-piedra/10 shadow-sm relative group"
                  >
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase bg-dorado-suave/10 text-dorado-suave px-2 py-0.5 rounded">
                        Predeterminada
                      </span>
                    )}
                    <p className="font-bold text-madera-oscura mb-1">{address.label}</p>
                    <p className="text-sm text-gris-piedra leading-relaxed">
                      {address.street}<br />
                      {address.city}, {address.state} {address.postalCode}<br />
                      {address.country}
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button className="text-xs text-gris-piedra hover:text-dorado-suave font-medium transition-colors">
                        Editar
                      </button>
                      <button className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 bg-crema-marfil/30 border border-dashed border-gris-piedra/20 rounded-xl p-8 text-center">
                  <p className="text-gris-piedra text-sm">No tienes direcciones guardadas aún.</p>
                </div>
              )}
            </div>
          </section>

          {/* Pedidos Recientes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-madera-oscura flex items-center gap-2">
                <Package className="h-5 w-5 text-dorado-suave" />
                Pedidos Recientes
              </h3>
              <Link
                href="/cuenta/mis-pedidos"
                className="text-sm font-medium text-dorado-suave hover:text-madera-oscura transition-colors"
              >
                Ver todos
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gris-piedra/10 overflow-hidden">
              <div className="p-8 text-center">
                <p className="text-gris-piedra text-sm mb-4">Próximamente podrás ver aquí el estado detallado de tus pedidos.</p>
                <Link href="/catalogo">
                  <button className="text-dorado-suave font-bold hover:underline">Ir a comprar</button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
