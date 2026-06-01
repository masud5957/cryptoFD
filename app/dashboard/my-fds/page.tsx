import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserFDs } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, TrendingUp, Calendar, Layers, Wallet, CheckCircle2, Hourglass } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { UserFD } from "@/lib/types"

function FDCard({ fd }: { fd: UserFD }) {
  const startDate = new Date(fd.startDate)
  const endDate = new Date(fd.endDate)
  const now = new Date()
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100))
  
  return (
    <Card className="rounded-2xl border border-border bg-card/50 hover:bg-card hover:shadow-lg hover:border-primary/50 transition-all overflow-hidden">
      <div className="p-6">
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    ${Number(fd.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-muted-foreground">USDT</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{fd.plan?.name} Plan</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge
              className={
                fd.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 border"
                  : fd.status === "completed"
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 border"
                  : "bg-muted text-muted-foreground border-border border"
              }
            >
              <span className="flex items-center gap-1">
                {fd.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Hourglass className="h-3 w-3" />}
                {fd.status.charAt(0).toUpperCase() + fd.status.slice(1)}
              </span>
            </Badge>
            <div className="flex items-center gap-1 text-green-500 mt-2 justify-end">
              <TrendingUp className="h-4 w-4" />
              <span className="text-lg font-bold">{fd.plan?.dailyRoi}%</span>
              <span className="text-xs text-muted-foreground">/day</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Duration Progress</span>
            <span className="text-sm font-bold text-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{Math.max(0, daysElapsed)} / {totalDays} days</span>
            <span>{Math.max(0, totalDays - daysElapsed)} days left</span>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg bg-secondary/50 border border-border p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" />
              <span>Start</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {startDate.toLocaleDateString()}
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 border border-border p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span>Maturity</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {endDate.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Total Earned</span>
              <span className="text-lg font-bold text-green-500">
                +${Number(fd.totalEarned).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block mb-1">Daily Rate</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                +${Number(fd.dailyEarning).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default async function MyFDsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const allFDs = await getUserFDs()
  const activeFDs = allFDs.filter((fd) => fd.status === "active")
  const completedFDs = allFDs.filter((fd) => fd.status === "completed")

  const totalLocked = activeFDs.reduce((acc, fd) => acc + Number(fd.amount), 0)
  const totalEarned = allFDs.reduce((acc, fd) => acc + Number(fd.totalEarned), 0)

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground">My Fixed Deposits</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage all your active and completed FDs
          </p>
        </div>
      </div>

      {/* Summary Cards - Professional Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border bg-card/50 hover:bg-card transition-colors p-6 hover:shadow-lg hover:border-primary/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Locked</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                ${totalLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card/50 hover:bg-card transition-colors p-6 hover:shadow-lg hover:border-green-500/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Earned</p>
              <p className="mt-1 text-2xl font-bold text-green-500">
                +${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="rounded-2xl border-border bg-card/50 hover:bg-card transition-colors p-6 hover:shadow-lg hover:border-blue-500/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Layers className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active FDs</p>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{activeFDs.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {allFDs.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card/50 p-12 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Layers className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No Fixed Deposits Yet</h3>
          <p className="mt-2 text-muted-foreground">
            Start earning daily interest by creating your first FD
          </p>
          <Link href="/dashboard/create-fd">
            <Button className="mt-6">Create Your First FD</Button>
          </Link>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary gap-2">
              <Hourglass className="h-4 w-4" />
              Active ({activeFDs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completedFDs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeFDs.length === 0 ? (
              <Card className="rounded-2xl border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No active FDs currently</p>
                <Link href="/dashboard/create-fd">
                  <Button variant="outline" className="mt-4">Create New FD</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeFDs.map((fd) => (
                  <FDCard key={fd.id} fd={fd} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedFDs.length === 0 ? (
              <Card className="rounded-2xl border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No completed FDs yet</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedFDs.map((fd) => (
                  <FDCard key={fd.id} fd={fd} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
