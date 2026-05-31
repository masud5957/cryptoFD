import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Initialize historical trading data
export async function POST(request: Request) {
  try {
    const action = new URL(request.url).searchParams.get("action")

    if (action === "init") {
      // Clear existing data (optional)
      await prisma.tradingActivity.deleteMany()
      await prisma.tradingDailyRecord.deleteMany()
      await prisma.portfolioAllocation.deleteMany()
      await prisma.cryptoPrice.deleteMany()

      // Create 7 months of daily trading records
      const months = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        date.setHours(0, 0, 0, 0)
        return date
      }).reverse()

      const dailyRecords = []
      for (const month of months) {
        for (let day = 1; day <= 20; day++) {
          const date = new Date(month)
          date.setDate(day)
          
          dailyRecords.push({
            date: date,
            profit: Math.round((Math.random() * 150000 + 50000) * 100) / 100,
            trades: Math.floor(Math.random() * 100 + 50),
            winRate: Math.round((70 + Math.random() * 15) * 10) / 10,
          })
        }
      }

      // Bulk insert daily records
      for (const record of dailyRecords) {
        await prisma.tradingDailyRecord.upsert({
          where: { date: record.date },
          update: record,
          create: record,
        })
      }

      // Create portfolio allocation
      const portfolioData = [
        { asset: "Bitcoin", percentage: 35, value: 1050000 },
        { asset: "Ethereum", percentage: 25, value: 750000 },
        { asset: "Stablecoins", percentage: 20, value: 600000 },
        { asset: "Other Altcoins", percentage: 20, value: 600000 },
      ]

      for (const p of portfolioData) {
        await prisma.portfolioAllocation.upsert({
          where: { asset: p.asset },
          update: p,
          create: p,
        })
      }

      // Create 30 recent trades
      const cryptos = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA"]
      const trades = []
      for (let i = 0; i < 30; i++) {
        const timestamp = new Date()
        timestamp.setMinutes(timestamp.getMinutes() - i * 10)
        
        trades.push({
          crypto: cryptos[Math.floor(Math.random() * cryptos.length)],
          action: Math.random() > 0.5 ? "BUY" : "SELL",
          amount: Math.round((Math.random() * 50000 + 5000) * 100) / 100,
          profit: Math.random() > 0.6 ? Math.round((Math.random() * 2000 - 200) * 100) / 100 : null,
          status: "completed",
          timestamp,
        })
      }

      for (const trade of trades) {
        await prisma.tradingActivity.create({ data: trade })
      }

      // Create crypto price history
      const cryptoPrices = [
        { crypto: "BTC", prices: [95000, 94500, 96000, 95500, 97000] },
        { crypto: "ETH", prices: [3500, 3450, 3600, 3550, 3700] },
        { crypto: "BNB", prices: [800, 795, 820, 810, 850] },
        { crypto: "SOL", prices: [250, 248, 260, 255, 270] },
      ]

      for (const cp of cryptoPrices) {
        for (let i = 0; i < cp.prices.length; i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)

          await prisma.cryptoPrice.upsert({
            where: {
              crypto_date: {
                crypto: cp.crypto,
                date,
              },
            },
            update: { price: cp.prices[i] },
            create: {
              crypto: cp.crypto,
              date,
              price: cp.prices[i],
            },
          })
        }
      }

      revalidatePath("/dashboard/our-works")
      revalidatePath("/admin/trading-data")

      return Response.json({
        success: true,
        message: "Historical data initialized successfully",
        stats: {
          dailyRecords: dailyRecords.length,
          portfolioItems: portfolioData.length,
          trades: trades.length,
          pricePoints: cryptoPrices.reduce((sum, cp) => sum + cp.prices.length, 0),
        },
      })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error initializing data:", error)
    return Response.json({ error: "Failed to initialize data" }, { status: 500 })
  }
}
