import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crear Cuenta | MaderArte',
  description: 'Regístrate en MaderArte y comienza a crear espacios únicos.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-blanco-hueso">
      <RegisterForm />
    </div>
  )
}
