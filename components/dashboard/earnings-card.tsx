"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Layers, Users, Sparkles, ArrowUpRight } from "lucide-react"
import type { TeamStats } from "@/lib/types"
import Link from "next/link"

interface FDEarningsCardProps {
  totalEarnings: number
  activeFDs: number
}

export function FDEarningsCard({ totalEarnings, activeFDs }: FDEarningsCardProps) {
  return (
    <Card className="rounded-2xl border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">FD Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <Link href="/dashboard/my-fds" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Layers className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">Active Investments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">{activeFDs}</span>
              {activeFDs > 0 && (
                <span className="flex items-center gap-1 text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Earning
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface ReferralEarningsCardProps {
  totalEarnings: number
  teamStats: TeamStats[]
}

export function ReferralEarningsCard({ totalEarnings, teamStats }: ReferralEarningsCardProps) {
  const totalMembers = teamStats.reduce((sum, level) => sum + level.count, 0)
  
  return (
    <Card className="rounded-2xl border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Referral Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <Link href="/dashboard/referral" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          {teamStats.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {teamStats.slice(0, 3).map((level) => (
                <div 
                  key={level.level} 
                  className="rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40 p-3 text-center"
                >
                  <p className="text-xs font-medium text-muted-foreground">Level {level.level}</p>
                  <p className="text-sm font-bold text-foreground mt-1">
                    ${level.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground">{level.count} members</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">No referrals yet</p>
              <Link href="/dashboard/referral" className="text-xs text-primary hover:underline">
                Start inviting friends
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
