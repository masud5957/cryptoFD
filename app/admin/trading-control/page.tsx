"use client"

import { useState, useEffect, useCallback } from "react"
import React from "react"
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
  
  // Activities state
  const [activities, setActivities] = useState<any[]>([])
  const [addingActivity, setAddingActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({ crypto: "", action: "", amount: 0, profit: null as number | null })

  useEffect(() => {
    fetchStats()
    loadActivities()
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

  async function loadActivities() {
    try {
      const res = await fetch("/api/admin/trading-activities")
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (error) {
      console.error("Error loading activities:", error)
    }
  }

  async function addActivity() {
    setAddingActivity(true)
    try {
      const res = await fetch("/api/admin/trading-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newActivity),
      })
      if (res.ok) {
        await loadActivities()
        setNewActivity({ crypto: "", action: "", amount: 0, profit: null })
      }
    } catch (error) {
      console.error("Error adding activity:", error)
    } finally {
      setAddingActivity(false)
    }
  }

  async function deleteActivity(id: string) {
    try {
      const res = await fetch("/api/admin/trading-activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        await loadActivities()
      }
    } catch (error) {
      console.error("Error deleting activity:", error)
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
                  {stats.winRate.toFixed(1)}%
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
                      Current: {stats.winRate.toFixed(1)}% (must be 0-100)
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

      {isInitialized && (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Trading Activities</CardTitle>
                <CardDescription>Manage trades shown on the "Our Works" page</CardDescription>
              </div>
              <Badge variant="secondary">Control Center</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Activity */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
              <h3 className="font-semibold text-foreground">Add Trading Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <select 
                  onChange={(e) => setNewActivity({ ...newActivity, crypto: e.target.value })}
                  value={newActivity.crypto}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                >
                  <option value="">Select Crypto</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">Binance (BNB)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="XRP">Ripple (XRP)</option>
                  <option value="ADA">Cardano (ADA)</option>
                </select>
                <select 
                  onChange={(e) => setNewActivity({ ...newActivity, action: e.target.value })}
                  value={newActivity.action}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                >
                  <option value="">Action</option>
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Amount (USDT)"
                  value={newActivity.amount}
                  onChange={(e) => setNewActivity({ ...newActivity, amount: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                />
                <input 
                  type="number" 
                  placeholder="Profit (optional)"
                  value={newActivity.profit}
                  onChange={(e) => setNewActivity({ ...newActivity, profit: e.target.value ? parseFloat(e.target.value) : null })}
                  className="px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                />
                <Button 
                  onClick={addActivity}
                  disabled={addingActivity || !newActivity.crypto || !newActivity.action || !newActivity.amount}
                  className="w-full"
                >
                  {addingActivity ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Activity"}
                </Button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Recent Activities (Last 10)</h3>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {activities.length > 0 ? (
                  activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${activity.action === "BUY" ? "bg-emerald-500" : "bg-red-500"}`} />
                        <div>
                          <p className="font-medium text-foreground">{activity.crypto} {activity.action}</p>
                          <p className="text-xs text-muted-foreground">${activity.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {activity.profit !== null && (
                          <p className={`text-sm font-medium ${activity.profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {activity.profit >= 0 ? "+" : ""}{activity.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No activities yet</p>
                )}
              </div>
            </div>

            <Alert className="bg-amber-500/10 border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-500 text-sm">
                <strong>Trading Activities:</strong> These appear on the "Our Works" page as live trades. Add activities to show your trading is active. They will appear to users with a timestamp.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
