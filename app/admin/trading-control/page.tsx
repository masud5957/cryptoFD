"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export default function TradingControlPage() {
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalTrades: 0,
    winRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState(stats)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/trading-stats")
      const data = await res.json()
      setStats(data)
      setFormData(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch trading stats" })
    } finally {
      setLoading(false)
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
        <h1 className="text-3xl font-bold tracking-tight">Trading Control</h1>
        <p className="text-muted-foreground mt-2">Manage and update company trading profits shown to users</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Trading Stats
          </CardTitle>
          <CardDescription>Values displayed to all users in "Our Works" section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display Current Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Profit</p>
              <p className="text-3xl font-bold text-green-500">
                ${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-2">USDT</p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Trades</p>
              <p className="text-3xl font-bold text-blue-500">
                {stats.totalTrades.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Transactions</p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-3xl font-bold text-amber-500">
                {stats.winRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">Success Rate</p>
            </div>
          </div>

          {/* Update Form */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Update Values</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Total Profit (USDT)</label>
                <Input
                  type="number"
                  value={formData.totalProfit}
                  onChange={(e) => setFormData({ ...formData, totalProfit: parseFloat(e.target.value) || 0 })}
                  placeholder="1247832.45"
                  className="mt-2"
                  step="0.01"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current: ${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Total Trades</label>
                <Input
                  type="number"
                  value={formData.totalTrades}
                  onChange={(e) => setFormData({ ...formData, totalTrades: parseInt(e.target.value) || 0 })}
                  placeholder="15432"
                  className="mt-2"
                  step="1"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current: {stats.totalTrades.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Win Rate (%)</label>
                <Input
                  type="number"
                  value={formData.winRate}
                  onChange={(e) => setFormData({ ...formData, winRate: parseFloat(e.target.value) || 0 })}
                  placeholder="76.5"
                  className="mt-2"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Current: {stats.winRate.toFixed(1)}% (must be 0-100)
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full h-11"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>

          {/* Info */}
          <Alert className="bg-blue-500/10 border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-500 text-sm">
              These values are displayed in real-time to all users on the "Our Works" dashboard page. 
              Update them to reflect your actual trading performance. Historical data is preserved automatically.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
