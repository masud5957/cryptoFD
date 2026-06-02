import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
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
