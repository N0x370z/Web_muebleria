import { Suspense } from 'react'
import { ProductForm } from '@/components/admin/ProductForm'

export default function AdminNewProductPage() {
  return (
    <Suspense fallback={<div className="text-gris-piedra font-dm-sans">Cargando formulario…</div>}>
      <ProductForm />
    </Suspense>
  )
}
