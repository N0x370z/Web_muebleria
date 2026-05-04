import { prisma } from '@/lib/prisma'
import { Layers, Edit, Trash2, Package } from 'lucide-react'
import Image from 'next/image'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Categorías</h1>
          <p className="text-gris-piedra font-dm-sans">Organización del catálogo</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-madera-oscura text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-dorado-suave transition-all shadow-lg">
          <Layers size={18} />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-video bg-crema-marfil overflow-hidden">
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gris-piedra/20">
                    <Layers size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Package size={12} className="text-dorado-suave" />
                  <span className="text-[10px] font-bold text-madera-oscura">
                    {category._count.products} productos
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-madera-oscura">{category.name}</h3>
                  <span className="text-[10px] font-courier text-gris-piedra uppercase">/{category.slug}</span>
                </div>
                {category.description && (
                  <p className="text-sm text-gris-piedra line-clamp-2 mb-4">{category.description}</p>
                )}
                <div className="flex items-center gap-2 pt-4 border-t border-crema-marfil">
                  <span className="text-[10px] font-bold text-gris-piedra uppercase tracking-widest">Orden: {category.order}</span>
                  <div className="flex-1" />
                  <button className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-dorado-suave" title="Editar">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 py-20 text-center bg-white rounded-2xl border border-dashed border-gris-piedra/20">
            <Layers className="h-12 w-12 text-gris-piedra/20 mx-auto mb-4" />
            <p className="text-gris-piedra">No hay categorías creadas aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}
