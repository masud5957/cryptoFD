"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, AlertCircle, CheckCircle, Plus, Minus } from "lucide-react"

export default function TradingControlPage() {
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalTrades: 0,
    winRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState(stats)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/trading-stats")
      const data = await res.json()
      setStats(data)
      setFormData(data)
      setIsInitialized(data.totalProfit > 0)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch trading stats" })
    } finally {
      setLoading(false)
    }
  }

  async function handleInitialize() {
    setInitializing(true)
    try {
      const res = await fetch("/api/admin/trading-stats/init", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to initialize")
      }

      await fetchStats()
      setMessage({ type: "success", text: "Trading data initialized! 7 months of history added." })
      setIsInitialized(true)
      setTimeout(() => setMessage(null), 4000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to initialize trading data" })
    } finally {
      setInitializing(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/trading-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to save")
      }

      const data = await res.json()
      setStats(data)
      setMessage({ type: "success", text: "Trading stats updated successfully!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save trading stats" })
    } finally {
      setSaving(false)
    }
  }

  // Quick update functions
  const updateProfit = (amount: number) => {
    setFormData({ ...formData, totalProfit: Math.max(0, formData.totalProfit + amount) })
  }

  const updateTrades = (amount: number) => {
    setFormData({ ...formData, totalTrades: Math.max(0, formData.totalTrades + amount) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trading Control Panel</h1>
        <p className="text-muted-foreground mt-2">Manage company trading profit shown to users in "Our Works" section</p>
      </div>

      {message && (
        <Alert className={message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <AlertDescription className={message.type === "success" ? "text-emerald-500" : "text-red-500"}>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {!isInitialized && (
        <Alert className="bg-yellow-500/10 border-yellow-500/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-500">
            <div className="flex items-center justify-between">
              <span>No trading data found. Click below to initialize 7 months of history.</span>
              <Button
                onClick={handleInitialize}
                disabled={initializing}
                className="ml-4"
                size="sm"
              >
                {initializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Initialize Data"
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isInitialized && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current Trading Stats
            </CardTitle>
            <CardDescription>Live values displayed to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Display Current Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-4">
                <p className="text-sm text-muted-foreground mb-2">Total Profit</p>
                <p className="text-3xl font-bold text-green-500">
                  ${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">USDT</p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-4">
                <p className="text-sm text-muted-foreground mb-2">Total Trades</p>
                <p className="text-3xl font-bold text-blue-500">
                  {stats.totalTrades.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Transactions</p>
              </div>

              <div className="rounded-xl border border-border bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-4">
                <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
                <p className="text-3xl font-bold text-amber-500">
                  {Number(stats.winRate).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">Success Rate</p>
              </div>
            </div>

            {/* Update Form */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-4">Update Values</h3>
              
              <div className="space-y-5">
                {/* Total Profit */}
                <div>
                  <label className="text-sm font-medium text-foreground">Total Profit (USDT)</label>
                  <div className="mt-2 flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.totalProfit}
                        onChange={(e) => setFormData({ ...formData, totalProfit: parseFloat(e.target.value) || 0 })}
                        placeholder="1247832.45"
                        step="0.01"
                        min="0"
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: ${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProfit(100000)}
                        title="Add 100,000 USDT"
                      >
                        <Plus className="h-4 w-4" /> 100K
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateProfit(-100000)}
                        title="Subtract 100,000 USDT"
                      >
                        <Minus className="h-4 w-4" /> 100K
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Total Trades */}
                <div>
                  <label className="text-sm font-medium text-foreground">Total Trades</label>
                  <div className="mt-2 flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        type="number"
                        value={formData.totalTrades}
                        onChange={(e) => setFormData({ ...formData, totalTrades: parseInt(e.target.value) || 0 })}
                        placeholder="15432"
                        step="1"
                        min="0"
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: {stats.totalTrades.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTrades(100)}
                        title="Add 100 trades"
                      >
                        <Plus className="h-4 w-4" /> 100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTrades(-100)}
                        title="Subtract 100 trades"
                      >
                        <Minus className="h-4 w-4" /> 100
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Win Rate */}
                <div>
                  <label className="text-sm font-medium text-foreground">Win Rate (%)</label>
                  <div className="mt-2">
                    <Input
                      type="number"
                      value={formData.winRate}
                      onChange={(e) => setFormData({ ...formData, winRate: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })}
                      placeholder="76.5"
                      step="0.1"
                      min="0"
                      max="100"
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {Number(stats.winRate).toFixed(1)}% (must be 0-100)
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full h-11 text-base"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "💾 Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {/* Info */}
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-500 text-sm">
                <strong>Live Updates:</strong> Changes appear immediately to users. Historical data is preserved automatically. 
                Use the +/- buttons for quick adjustments or enter exact values manually.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
