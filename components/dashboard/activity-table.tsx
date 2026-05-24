"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Layers,
  Users,
  ArrowUpFromLine,
  ArrowDownToLine,
  Coins,
  Clock,
  ArrowRight,
  Activity,
} from "lucide-react"
import type { Transaction } from "@/lib/types"

interface ActivityTableProps {
  transactions: Transaction[]
}

const typeConfig: Record<string, { icon: typeof Layers; gradient: string; label: string }> = {
  fd_earning: { icon: Layers, gradient: "from-emerald-500 to-emerald-600", label: "FD Earning" },
  referral_earning: { icon: Users, gradient: "from-blue-500 to-blue-600", label: "Referral Bonus" },
  withdrawal: { icon: ArrowUpFromLine, gradient: "from-orange-500 to-orange-600", label: "Withdrawal" },
  deposit: { icon: ArrowDownToLine, gradient: "from-emerald-500 to-emerald-600", label: "Deposit" },
  fd_investment: { icon: Layers, gradient: "from-violet-500 to-violet-600", label: "New Investment" },
  fd_maturity: { icon: Coins, gradient: "from-amber-500 to-amber-600", label: "FD Maturity" },
}

export function ActivityTable({ transactions }: ActivityTableProps) {
  if (transactions.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Your latest transactions</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Start investing to see your activity here
          </p>
          <Button asChild>
            <Link href="/dashboard/create-fd">
              Make Your First Investment
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Your latest transactions</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/transactions" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const config = typeConfig[tx.type] || typeConfig.fd_earning
          const Icon = config.icon
          const isPositive = tx.amount > 0 && tx.type !== "withdrawal" && tx.type !== "fd_investment"
          
          return (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{config.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${isPositive ? "text-emerald-500" : "text-foreground"}`}>
                  {isPositive ? "+" : tx.type === "withdrawal" || tx.type === "fd_investment" ? "-" : ""}
                  ${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    tx.status === "completed" 
                      ? "bg-emerald-500/10 text-emerald-500 text-xs" 
                      : tx.status === "pending"
                      ? "bg-amber-500/10 text-amber-500 text-xs"
                      : "bg-red-500/10 text-red-500 text-xs"
                  }
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
