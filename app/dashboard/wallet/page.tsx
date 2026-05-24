import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getProfile } from "@/lib/queries"
import { WalletForm } from "./wallet-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Shield, Zap, Clock } from "lucide-react"

export default async function WalletPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const profile = await getProfile()

  const walletBalance = Number(profile?.walletBalance) || 0
  const lockedBalance = Number(profile?.lockedBalance) || 0
  const totalBalance = walletBalance + lockedBalance

  const features = [
    { icon: Zap, label: "Instant Deposits", description: "Auto-detected within minutes", color: "text-green-500 bg-green-500/10" },
    { icon: Clock, label: "Fast Withdrawals", description: "Processed within 1 hour", color: "text-blue-500 bg-blue-500/10" },
    { icon: Shield, label: "Secure Network", description: "BEP-20 (BSC) Only", color: "text-primary bg-primary/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              BEP-20
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage your USDT deposits and withdrawals
          </p>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <ArrowDownToLine className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-500">
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <ArrowUpFromLine className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked in FDs</p>
              <p className="text-2xl font-bold text-amber-500">
                ${lockedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="rounded-xl border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Form */}
      <WalletForm 
        availableBalance={walletBalance}
        savedAddress={profile?.usdtAddress || ""}
      />
    </div>
  )
}
