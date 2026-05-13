import { Metadata } from 'next'
import { ProductForm } from '@/components/admin/ProductForm'

export const metadata: Metadata = {
  title: 'Nuevo Producto | Admin MaderArte',
}

export default function AdminNewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-madera-oscura">Nuevo Producto</h1>
        <p className="text-gris-piedra mt-1 font-dm-sans">
          Completa el formulario para agregar un nuevo producto al catálogo.
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
