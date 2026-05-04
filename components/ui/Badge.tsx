// ── Tipos ──────────────────────────────────────────────────────────

type BadgeVariant = 'gold' | 'dark' | 'outline' | 'success' | 'danger'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

// ── Estilos ────────────────────────────────────────────────────────

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'badge-gold',
  dark: 'badge-dark',
  outline: 'badge-outline',
  success: 'badge bg-emerald-600 text-white',
  danger: 'badge bg-red-600 text-white',
}

// ── Componente ─────────────────────────────────────────────────────

const Badge = ({ variant = 'outline', children, className = '' }: BadgeProps) => {
  return (
    <span className={`${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export { Badge }
