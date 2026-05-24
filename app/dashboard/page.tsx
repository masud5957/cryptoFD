import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getDashboardStats, getTransactions, getTeamStats, getProfile, getEarningsHistory } from "@/lib/queries"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { BalanceTable } from "@/components/dashboard/balance-table"
import { FDEarningsCard, ReferralEarningsCard } from "@/components/dashboard/earnings-card"
import { TeamCard } from "@/components/dashboard/team-card"
import { ActionGrid } from "@/components/dashboard/action-grid"
import { ChartCard } from "@/components/dashboard/chart-card"
import { ActivityTable } from "@/components/dashboard/activity-table"
import { ReferralCard } from "@/components/dashboard/referral-card"
import { TrendingUp, Shield, Clock } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const [stats, transactions, teamStats, profile, earningsHistory] = await Promise.all([
    getDashboardStats(),
    getTransactions(10),
    getTeamStats(),
    getProfile(),
    getEarningsHistory(30),
  ])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your investment portfolio overview
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {stats.activeFDs} Active FDs
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Secure & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Hero Balance Card */}
      <BalanceCard
        totalBalance={stats.totalBalance}
        availableBalance={stats.availableBalance}
        lockedBalance={stats.lockedBalance}
      />

      {/* Balance Overview Table */}
      <BalanceTable
        availableBalance={stats.availableBalance}
        lockedBalance={stats.lockedBalance}
        totalEarnings={stats.fdEarnings}
        referralEarnings={stats.referralEarnings}
      />

      {/* Earnings & Team Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FDEarningsCard
          totalEarnings={stats.fdEarnings}
          activeFDs={stats.activeFDs}
        />
        <ReferralEarningsCard
          totalEarnings={stats.referralEarnings}
          teamStats={teamStats}
        />
        <TeamCard
          totalMembers={stats.totalTeamMembers}
          teamStats={teamStats}
        />
      </div>

      {/* Quick Actions Grid */}
      <ActionGrid />

      {/* Charts & Referral Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard earningsHistory={earningsHistory} />
        </div>
        <ReferralCard referralCode={profile?.referralCode || ""} />
      </div>

      {/* Recent Activity */}
      <ActivityTable transactions={transactions} />

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Shield className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Bank-Grade</p>
            <p className="text-xs text-muted-foreground">Security</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">24/7</p>
            <p className="text-xs text-muted-foreground">Withdrawals</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
            <TrendingUp className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Daily</p>
            <p className="text-xs text-muted-foreground">ROI Payouts</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">100%</p>
            <p className="text-xs text-muted-foreground">Transparent</p>
          </div>
        </div>
      </div>
    </div>
  )
}
