'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
    >
      <LogOut size={18} />
      Cerrar Sesión
    </button>
  )
}
