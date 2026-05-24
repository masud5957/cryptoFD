import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserFDs } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, TrendingUp, Calendar, Layers } from "lucide-react"
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
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              ${Number(fd.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-muted-foreground">USDT</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              className={
                fd.status === "active"
                  ? "bg-green-500/10 text-green-500"
                  : fd.status === "completed"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-muted text-muted-foreground"
              }
            >
              {fd.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{fd.plan?.name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-lg font-bold">{fd.plan?.dailyRoi}%</span>
          </div>
          <span className="text-xs text-muted-foreground">/day</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="mt-2 h-2" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Start Date
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {startDate.toLocaleDateString()}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            End Date
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">
            {endDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-green-500/10 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Earned</span>
          <span className="text-lg font-bold text-green-500">
            +${Number(fd.totalEarned).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">Daily Earning</span>
          <span className="text-sm text-green-500">
            +${Number(fd.dailyEarning).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Fixed Deposits</h1>
        <p className="mt-1 text-muted-foreground">
          Track and manage all your active and completed FDs
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Locked</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            ${totalLocked.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total Earned</p>
          <p className="mt-1 text-2xl font-bold text-green-500">
            +${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Active FDs</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{activeFDs.length}</p>
        </Card>
      </div>

      {allFDs.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card p-12 text-center">
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
            <TabsTrigger value="active" className="data-[state=active]:bg-primary">
              Active ({activeFDs.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary">
              Completed ({completedFDs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeFDs.length === 0 ? (
              <Card className="rounded-2xl border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No active FDs</p>
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
