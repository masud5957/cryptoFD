import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getFDPlans, getProfile } from "@/lib/queries"
import { CreateFDForm } from "./create-fd-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, Clock, Coins } from "lucide-react"

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
    { icon: Coins, label: "Min Investment", value: "$50", color: "text-amber-500 bg-amber-500/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">New Investment</h1>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              High Returns
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Choose a plan and start earning daily interest on your USDT
          </p>
        </div>
      </div>

      {/* Features Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((feature, index) => (
          <Card key={index} className="rounded-xl border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{feature.label}</p>
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

      {/* Info Section */}
      <Card className="rounded-2xl border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Your Investment is Secure</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your principal is 100% safe. After the 30-day lock period, your full investment amount plus all earned returns are credited to your available balance for withdrawal or reinvestment.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
