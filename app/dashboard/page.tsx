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
import { TrendingUp, Shield, Clock, Zap, Award, BarChart3, Wallet, Users } from "lucide-react"

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
      {/* Premium Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Welcome back{profile?.name ? `, ${profile.name}` : ""}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Track your investments, earnings, and referral network
              </p>
            </div>
            
            {/* Quick Status Pills */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 px-6 py-3 border border-emerald-500/20">
                <Zap className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.activeFDs} Active FDs
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-primary/10 px-6 py-3 border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Secure & Verified
                </span>
              </div>
            </div>
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

      {/* Key Metrics - Enhanced Grid */}
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

      {/* Trust Indicators - Professional Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Why Choose CryptoFD</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all p-5 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bank-Grade</p>
                <p className="text-xs text-muted-foreground">Security</p>
              </div>
            </div>
          </div>
          
          <div className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all p-5 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">24/7</p>
                <p className="text-xs text-muted-foreground">Withdrawals</p>
              </div>
            </div>
          </div>
          
          <div className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all p-5 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Daily</p>
                <p className="text-xs text-muted-foreground">ROI Payouts</p>
              </div>
            </div>
          </div>
          
          <div className="group rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all p-5 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Transparent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
