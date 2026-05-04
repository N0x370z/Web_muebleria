import { prisma } from '@/lib/prisma'
import { 
  ExternalLink,
  Search,
  Image as ImageIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const statusVariants: Record<string, 'warning' | 'info' | 'success' | 'dark'> = {
    PENDING: 'warning',
    IN_REVIEW: 'info',
    RESPONDED: 'success',
    CLOSED: 'dark',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-madera-oscura">Cotizaciones</h1>
          <p className="text-gris-piedra font-dm-sans">Solicitudes de proyectos personalizados</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gris-piedra" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="pl-9 pr-4 py-2 bg-white border border-gris-piedra/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dorado-suave/20 min-w-[250px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gris-piedra/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-crema-marfil/30 text-[10px] font-bold uppercase tracking-widest text-gris-piedra border-b border-gris-piedra/10">
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Mensaje</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ref.</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-piedra/10">
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-crema-marfil/20 transition-colors text-sm">
                    <td className="px-6 py-4 text-gris-piedra">
                      {new Date(quote.createdAt).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-madera-oscura">{quote.name}</p>
                      <p className="text-xs text-gris-piedra">{quote.email}</p>
                      {quote.phone && <p className="text-[10px] text-dorado-suave font-bold">{quote.phone}</p>}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-gris-piedra line-clamp-2 italic">&quot;{quote.message}&quot;</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariants[quote.status] || 'dark'}>
                        {quote.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {quote.imageUrl ? (
                        <a href={quote.imageUrl} target="_blank" rel="noreferrer" className="text-dorado-suave hover:text-madera-oscura">
                          <ImageIcon size={18} />
                        </a>
                      ) : (
                        <span className="text-gris-piedra/30">—</span>
                      )}
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
                  <td colSpan={6} className="px-6 py-20 text-center text-gris-piedra italic">
                    No hay solicitudes de cotización.
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
