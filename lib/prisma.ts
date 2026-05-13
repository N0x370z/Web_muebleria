import { PrismaClient } from '@prisma/client'

/** Permite omitir consultas en build/CI cuando no hay `.env` con base de datos. */
export function isDatabaseConfigured(): boolean {
  return typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim().length > 0
}

// Patrón singleton para el cliente Prisma en Next.js
// Evita crear múltiples instancias en desarrollo con hot reload

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
