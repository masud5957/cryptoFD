"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users } from "lucide-react"
import type { TeamStats } from "@/lib/types"

interface TeamCardProps {
  totalMembers: number
  teamStats: TeamStats[]
}

export function TeamCard({ totalMembers, teamStats }: TeamCardProps) {
  // Calculate team growth (percentage of max potential - 5 levels with members)
  const levelsWithMembers = teamStats.filter(s => s.count > 0).length
  const teamGrowth = (levelsWithMembers / 5) * 100

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Team Overview</p>
          <p className="text-xl font-bold text-foreground">{totalMembers} Members</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {teamStats.length > 0 ? (
          <>
            {teamStats.slice(0, 3).map((stat) => (
              <div key={stat.level} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Level {stat.level}</span>
                <span className="text-sm font-medium text-foreground">{stat.count} members</span>
              </div>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            No team members yet
          </p>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network Depth</span>
            <span className="text-foreground">{levelsWithMembers}/5 Levels</span>
          </div>
          <Progress value={teamGrowth} className="mt-2 h-2" />
        </div>
      </div>
    </Card>
  )
}
