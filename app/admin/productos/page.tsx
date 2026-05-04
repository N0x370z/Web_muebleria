import { prisma } from '@/lib/prisma'
import { 
  Package, 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { order: 'asc' } }
    }
  })

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Productos</h1>
          <p className="text-gris-piedra font-dm-sans">Inventario y catálogo de MaderArte</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <button className="flex items-center gap-2 px-6 py-3 bg-madera-oscura text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-dorado-suave transition-all shadow-lg">
            <Plus size={18} />
            Nuevo Producto
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-crema-marfil bg-crema-marfil/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gris-piedra" />
            <input 
              type="text" 
              placeholder="Buscar producto por nombre o SKU..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gris-piedra/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dorado-suave/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-gris-piedra border-b border-gris-piedra/10">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-piedra/10">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-crema-marfil/20 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-crema-marfil overflow-hidden border border-gris-piedra/10 relative shrink-0">
                          {product.images[0] ? (
                            <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gris-piedra/20">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-madera-oscura">{product.name}</p>
                          <p className="text-[10px] text-gris-piedra font-courier uppercase">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gris-piedra">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 font-bold text-madera-oscura">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-gris-piedra'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/catalogo/producto/${product.slug}`} target="_blank">
                          <button className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-gris-piedra" title="Ver en tienda">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-dorado-suave" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gris-piedra italic">
                    No hay productos en el inventario.
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
