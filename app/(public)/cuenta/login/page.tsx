import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | MaderArte',
  description: 'Ingresa a tu cuenta de MaderArte para gestionar tus pedidos y cotizaciones.',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-blanco-hueso">
      <Suspense fallback={<div className="text-gris-piedra font-dm-sans">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
