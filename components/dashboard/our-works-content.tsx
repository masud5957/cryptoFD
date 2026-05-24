"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Activity,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Clock,
  Globe,
} from "lucide-react"

// Seeded random for consistent data generation
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate 7 months of realistic trading data (deterministic)
function generateMonthlyProfitData() {
  const months = ["Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"]
  let cumulativeProfit = 0
  
  return months.map((month, index) => {
    const monthlyProfit = 150000 + seededRandom(index * 7 + 1) * 100000 + (index * 20000)
    cumulativeProfit += monthlyProfit
    return {
      month,
      profit: Math.round(monthlyProfit),
      cumulative: Math.round(cumulativeProfit),
      trades: Math.floor(1200 + seededRandom(index * 7 + 2) * 800 + (index * 100)),
      winRate: Math.round(72 + seededRandom(index * 7 + 3) * 8),
    }
  })
}

// Generate realistic crypto price data for the past 7 months (deterministic)
function generateCryptoData(basePrices: { btc: number; eth: number; bnb: number; sol: number }) {
  const data = []
  const startDate = new Date("2024-11-01")
  
  let btcPrice = basePrices.btc
  let ethPrice = basePrices.eth
  let bnbPrice = basePrices.bnb
  let solPrice = basePrices.sol
  
  for (let i = 0; i < 210; i++) { // ~7 months of daily data
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Simulate realistic price movements using seeded random
    btcPrice = btcPrice * (1 + (seededRandom(i * 4 + 1) - 0.48) * 0.03)
    ethPrice = ethPrice * (1 + (seededRandom(i * 4 + 2) - 0.48) * 0.035)
    bnbPrice = bnbPrice * (1 + (seededRandom(i * 4 + 3) - 0.47) * 0.025)
    solPrice = solPrice * (1 + (seededRandom(i * 4 + 4) - 0.46) * 0.04)
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      btc: Math.round(btcPrice),
      eth: Math.round(ethPrice),
      bnb: Math.round(bnbPrice),
      sol: Math.round(solPrice * 100) / 100,
    })
  }
  
  return data
}

// Static initial trading activity (no random values for SSR)
const initialTradingActivity = [
  { id: 1, crypto: "BTC", action: "BUY", amount: 32456.78, profit: null, time: "--:--:--", status: "completed" },
  { id: 2, crypto: "ETH", action: "SELL", amount: 18234.50, profit: 856.23, time: "--:--:--", status: "completed" },
  { id: 3, crypto: "SOL", action: "BUY", amount: 12890.00, profit: null, time: "--:--:--", status: "completed" },
  { id: 4, crypto: "BNB", action: "SELL", amount: 8765.43, profit: 423.10, time: "--:--:--", status: "completed" },
  { id: 5, crypto: "XRP", action: "BUY", amount: 15432.10, profit: null, time: "--:--:--", status: "completed" },
  { id: 6, crypto: "ADA", action: "SELL", amount: 9876.54, profit: 312.45, time: "--:--:--", status: "completed" },
  { id: 7, crypto: "ETH", action: "BUY", amount: 22345.67, profit: null, time: "--:--:--", status: "completed" },
  { id: 8, crypto: "BTC", action: "SELL", amount: 45678.90, profit: 1234.56, time: "--:--:--", status: "completed" },
  { id: 9, crypto: "DOGE", action: "BUY", amount: 5432.10, profit: null, time: "--:--:--", status: "completed" },
  { id: 10, crypto: "AVAX", action: "SELL", amount: 7654.32, profit: 567.89, time: "--:--:--", status: "completed" },
  { id: 11, crypto: "SOL", action: "SELL", amount: 11234.56, profit: 678.90, time: "--:--:--", status: "completed" },
  { id: 12, crypto: "BNB", action: "BUY", amount: 13456.78, profit: null, time: "--:--:--", status: "completed" },
  { id: 13, crypto: "ETH", action: "SELL", amount: 19876.54, profit: 945.67, time: "--:--:--", status: "completed" },
  { id: 14, crypto: "BTC", action: "BUY", amount: 38765.43, profit: null, time: "--:--:--", status: "completed" },
  { id: 15, crypto: "XRP", action: "SELL", amount: 6543.21, profit: 234.56, time: "--:--:--", status: "completed" },
]

// Generate live trading activity (client-side only)
function generateTradingActivity() {
  const cryptos = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE", "AVAX"]
  const actions = ["BUY", "SELL"]
  
  return Array.from({ length: 15 }, (_, i) => {
    const crypto = cryptos[Math.floor(Math.random() * cryptos.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const amount = Math.round((Math.random() * 50000 + 5000) * 100) / 100
    const profit = action === "SELL" ? Math.round((Math.random() * 2000 - 200) * 100) / 100 : null
    const time = new Date(Date.now() - i * 120000 - Math.random() * 60000)
    
    return {
      id: i + 1,
      crypto,
      action,
      amount,
      profit,
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      status: "completed",
    }
  })
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"]

const cryptoIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  BNB: "◈",
  SOL: "◎",
  XRP: "✕",
  ADA: "₳",
  DOGE: "Ð",
  AVAX: "△",
}

const portfolioAllocation = [
  { name: "Bitcoin", value: 35, color: "#f7931a" },
  { name: "Ethereum", value: 28, color: "#627eea" },
  { name: "BNB", value: 15, color: "#f3ba2f" },
  { name: "Solana", value: 12, color: "#00ffa3" },
  { name: "Others", value: 10, color: "#8b5cf6" },
]

export function OurWorksContent() {
  const [monthlyData] = useState(() => generateMonthlyProfitData())
  const [cryptoData] = useState(() => generateCryptoData({ btc: 68000, eth: 3200, bnb: 580, sol: 120 }))
  const [tradingActivity, setTradingActivity] = useState(initialTradingActivity)
  const [isHydrated, setIsHydrated] = useState(false)
  const [liveStats, setLiveStats] = useState({
    totalProfit: 1247832.45,
    todayProfit: 18432.67,
    activeTrades: 24,
    winRate: 76.4,
  })

  // Hydrate with live data after mount
  useEffect(() => {
    setIsHydrated(true)
    setTradingActivity(generateTradingActivity())
  }, [])

  // Simulate live updates (only after hydration)
  useEffect(() => {
    if (!isHydrated) return
    
    const interval = setInterval(() => {
      setTradingActivity(generateTradingActivity())
      setLiveStats(prev => ({
        totalProfit: prev.totalProfit + (Math.random() * 500 - 100),
        todayProfit: prev.todayProfit + (Math.random() * 200 - 50),
        activeTrades: Math.floor(20 + Math.random() * 15),
        winRate: 74 + Math.random() * 5,
      }))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isHydrated])

  const totalTrades = monthlyData.reduce((acc, m) => acc + m.trades, 0)
  const avgWinRate = Math.round(monthlyData.reduce((acc, m) => acc + m.winRate, 0) / monthlyData.length)
  const totalProfit = monthlyData[monthlyData.length - 1].cumulative

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Our Trading Operations</h1>
          <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Trading
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Real-time overview of our cryptocurrency trading activities that generate returns for our investors.
        </p>
      </div>

      {/* Live Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/20 blur-2xl" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Profit (7 Months)
            </CardDescription>
            <CardTitle className="text-2xl text-emerald-600 dark:text-emerald-400">
              ${liveStats.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span>+23.5% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/20 blur-2xl" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {"Today's Profit"}
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
              ${liveStats.todayProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="h-4 w-4" />
              <span>Updated live</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-amber-500/20 blur-2xl" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Trades
            </CardDescription>
            <CardTitle className="text-2xl text-amber-600 dark:text-amber-400">
              {totalTrades.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
              <span>{liveStats.activeTrades} active now</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-500/20 blur-2xl" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Win Rate
            </CardDescription>
            <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">
              {liveStats.winRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
              <span>Above industry avg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profit Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Monthly Trading Performance
            </CardTitle>
            <CardDescription>
              Cumulative profit from our trading operations over the past 7 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cumulative Profit']}
                />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-amber-500" />
              Portfolio Allocation
            </CardTitle>
            <CardDescription>Current distribution of trading capital</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={portfolioAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {portfolioAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {portfolioAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crypto Price Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Cryptocurrency Market Tracking
          </CardTitle>
          <CardDescription>
            7-month price movements of our primary trading assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="btc" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="btc" className="gap-1.5">
                <span className="text-amber-500">₿</span> BTC
              </TabsTrigger>
              <TabsTrigger value="eth" className="gap-1.5">
                <span className="text-blue-500">Ξ</span> ETH
              </TabsTrigger>
              <TabsTrigger value="bnb" className="gap-1.5">
                <span className="text-yellow-500">◈</span> BNB
              </TabsTrigger>
              <TabsTrigger value="sol" className="gap-1.5">
                <span className="text-emerald-500">◎</span> SOL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="btc">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cryptoData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} interval={10} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'BTC Price']} />
                  <Line type="monotone" dataKey="btc" stroke="#f7931a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="eth">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cryptoData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} interval={10} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'ETH Price']} />
                  <Line type="monotone" dataKey="eth" stroke="#627eea" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="bnb">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cryptoData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} interval={10} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'BNB Price']} />
                  <Line type="monotone" dataKey="bnb" stroke="#f3ba2f" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="sol">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={cryptoData.filter((_, i) => i % 3 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} interval={10} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'SOL Price']} />
                  <Line type="monotone" dataKey="sol" stroke="#00ffa3" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Monthly Performance Table & Live Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Monthly Performance Breakdown
            </CardTitle>
            <CardDescription>Detailed monthly trading statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly Profit']} />
                <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">Month</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Profit</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Trades</th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month) => (
                    <tr key={month.month} className="border-b border-border/50">
                      <td className="py-2 text-foreground">{month.month}</td>
                      <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                        ${month.profit.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">{month.trades}</td>
                      <td className="py-2 text-right">
                        <Badge variant="outline" className="text-xs">
                          {month.winRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live Trading Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Live Trading Activity
              <Badge variant="outline" className="ml-2 gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Real-time
              </Badge>
            </CardTitle>
            <CardDescription>Recent trades executed by our trading algorithms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {tradingActivity.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                      trade.action === "BUY" 
                        ? "bg-emerald-500/20 text-emerald-500" 
                        : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {cryptoIcons[trade.crypto] || trade.crypto[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{trade.crypto}/USDT</span>
                        <Badge 
                          variant="outline" 
                          className={trade.action === "BUY" 
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                            : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }
                        >
                          {trade.action}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {trade.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      ${trade.amount.toLocaleString()}
                    </div>
                    {trade.profit !== null && (
                      <div className={`flex items-center justify-end gap-1 text-xs ${
                        trade.profit >= 0 
                          ? "text-emerald-600 dark:text-emerald-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {trade.profit >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {trade.profit >= 0 ? "+" : ""}${trade.profit.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Indicators */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Security</div>
                <div className="font-semibold text-foreground">Bank-Grade Encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Trading Hours</div>
                <div className="font-semibold text-foreground">24/7 Operations</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Execution Speed</div>
                <div className="font-semibold text-foreground">{'< 100ms Latency'}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Markets</div>
                <div className="font-semibold text-foreground">50+ Trading Pairs</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
