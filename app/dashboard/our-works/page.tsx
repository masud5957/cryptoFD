import { OurWorksContent } from "@/components/dashboard/our-works-content"
import { getTradingStats, getMonthlyTradingRecords, getTodayProfit } from "@/lib/trading-stats"

export const metadata = {
  title: "Our Works - CryptoFD",
  description: "See how CryptoFD generates returns through cryptocurrency trading",
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function OurWorksPage() {
  const [stats, monthlyRecords, todayProfit] = await Promise.all([
    getTradingStats(),
    getMonthlyTradingRecords(),
    getTodayProfit(),
  ])
  
  return (
    <OurWorksContent 
      initialStats={stats}
      monthlyRecords={monthlyRecords}
      todayProfit={todayProfit}
    />
  )
}
