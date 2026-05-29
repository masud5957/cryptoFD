"use server"

import { prisma } from "@/lib/db"
import { requireAdminSession } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

// Get trading stats
export async function GET() {
  try {
    let stats = await prisma.tradingStats.findUnique({
      where: { id: "main" }
    })
    
    // Initialize if doesn't exist
    if (!stats) {
      stats = await prisma.tradingStats.create({
        data: {
          id: "main",
          totalProfit: 1247832.45,
          totalTrades: 15432,
          winRate: 76.5,
        }
      })
    }
    
    return Response.json(stats)
  } catch (error) {
    console.error("Error fetching trading stats:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

// Update trading stats (admin only)
export async function POST(request: Request) {
  try {
    await requireAdminSession()
    
    const { totalProfit, totalTrades, winRate } = await request.json()
    
    // Validate inputs
    if (typeof totalProfit !== "number" || totalProfit < 0) {
      return Response.json({ error: "Invalid totalProfit" }, { status: 400 })
    }
    if (typeof totalTrades !== "number" || totalTrades < 0) {
      return Response.json({ error: "Invalid totalTrades" }, { status: 400 })
    }
    if (typeof winRate !== "number" || winRate < 0 || winRate > 100) {
      return Response.json({ error: "Invalid winRate (0-100)" }, { status: 400 })
    }
    
    // Update or create
    const stats = await prisma.tradingStats.upsert({
      where: { id: "main" },
      update: {
        totalProfit,
        totalTrades,
        winRate,
        lastUpdated: new Date(),
      },
      create: {
        id: "main",
        totalProfit,
        totalTrades,
        winRate,
      }
    })
    
    revalidatePath("/dashboard/our-works")
    revalidatePath("/admin/trading-control")
    
    return Response.json(stats)
  } catch (error) {
    console.error("Error updating trading stats:", error)
    return Response.json({ error: "Failed to update stats" }, { status: 500 })
  }
}
