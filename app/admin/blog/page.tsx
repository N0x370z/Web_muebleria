import { prisma } from '@/lib/prisma'
import { FileText, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Blog</h1>
          <p className="text-gris-piedra font-dm-sans">Gestión de artículos y contenido</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-madera-oscura text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-dorado-suave transition-all shadow-lg">
          <Plus size={18} />
          Nuevo Artículo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-crema-marfil/30 text-[10px] font-bold uppercase tracking-widest text-gris-piedra border-b border-gris-piedra/10">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Autor</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-piedra/10">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-crema-marfil/20 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-bold text-madera-oscura truncate">{post.title}</p>
                        <p className="text-[10px] text-gris-piedra font-courier">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase bg-crema-marfil text-gris-piedra px-2 py-1 rounded">
                        {post.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gris-piedra">{post.author}</td>
                    <td className="px-6 py-4 text-gris-piedra">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('es-MX')
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        post.published ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {post.published && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <button className="p-2 hover:bg-crema-marfil rounded-lg transition-colors text-gris-piedra" title="Ver en público">
                              <Eye size={16} />
                            </button>
                          </Link>
                        )}
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
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <FileText className="h-12 w-12 text-gris-piedra/20 mx-auto mb-4" />
                    <p className="text-gris-piedra">No hay artículos creados.</p>
                    <p className="text-xs text-gris-piedra/60 mt-1">Crea tu primer artículo para comenzar a construir tu blog.</p>
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
