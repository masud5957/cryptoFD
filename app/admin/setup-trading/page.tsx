"use server"

import { initializeTradingHistory } from "@/lib/trading-stats"

export default async function SetupPage() {
  const result = await initializeTradingHistory()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Trading History Setup</h1>
        
        {result.success ? (
          <div className="space-y-2">
            <p className="text-lg text-green-500">✓ Trading history initialized successfully!</p>
            <p className="text-muted-foreground">Records created: {result.recordsCreated}</p>
            <p className="text-muted-foreground">Total profit: ${result.totalProfit?.toLocaleString() || 'N/A'} USDT</p>
            <p className="text-muted-foreground">Total trades: {result.totalTrades?.toLocaleString() || 'N/A'}</p>
            <p className="text-sm text-amber-500 mt-4">You can now delete this page. Go to /admin/trading-control to manage trading stats.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg text-amber-500">⚠ {result.message}</p>
            <p className="text-muted-foreground">Go to /admin/trading-control to manage trading stats.</p>
          </div>
        )}
      </div>
    </div>
  )
}
