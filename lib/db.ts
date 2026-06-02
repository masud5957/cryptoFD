import { PrismaClient } from "@prisma/client"

// Force reconnection to new Render database - timestamp: 2026-06-02
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma

// Helper function to increment balance with proper connection handling
export async function incrementBalance(userId: string, amount: number) {
  return prisma.profile.update({
    where: { id: userId },
    data: { walletBalance: { increment: amount } },
  })
}
