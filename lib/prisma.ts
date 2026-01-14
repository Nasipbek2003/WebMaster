import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Конфигурация для Prisma Client
const prismaClientOptions: {
  log?: ('error' | 'warn')[]
} = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions)

// Функция для проверки подключения к базе данных
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error: any) {
    console.error('Database connection error:', {
      code: error?.code,
      message: error?.message,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    })
    return false
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
