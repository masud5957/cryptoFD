import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getFDPlans, getProfile } from "@/lib/queries"
import { CreateFDForm } from "./create-fd-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, Clock, Coins, Zap } from "lucide-react"

export default async function CreateFDPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const [plans, profile] = await Promise.all([
    getFDPlans(),
    getProfile(),
  ])

  const features = [
    { icon: TrendingUp, label: "Daily Returns", value: "2% - 3.3%", color: "text-green-500 bg-green-500/10" },
    { icon: Clock, label: "Lock Period", value: "30 Days", color: "text-blue-500 bg-blue-500/10" },
    { icon: Shield, label: "Capital Safe", value: "100%", color: "text-primary bg-primary/10" },
    { icon: Coins, label: "Min Investment", value: "$50 USDT", color: "text-amber-500 bg-amber-500/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">New Investment</h1>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 border gap-1">
              <Zap className="h-3 w-3" />
              High Returns
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Choose a plan and start earning daily interest on your USDT
          </p>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((feature, index) => (
          <Card key={index} className="rounded-xl border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all p-4 hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{feature.label}</p>
                <p className="text-sm font-bold text-foreground">{feature.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Form */}
      <CreateFDForm 
        plans={plans} 
        availableBalance={Number(profile?.walletBalance) || 0} 
      />

      {/* Security Info Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border-border bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 flex-shrink-0">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Your Investment is Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your principal is 100% safe. After the 30-day lock period, your full investment plus all earned returns are credited to your wallet.
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Daily Earnings</h3>
              <p className="text-sm text-muted-foreground">
                Earn daily from day 1. Withdrawable anytime without penalties or waiting periods.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
