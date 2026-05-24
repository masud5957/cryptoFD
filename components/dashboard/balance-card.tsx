"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, TrendingUp, Wallet, Lock, ArrowDownLeft, ArrowUpRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface BalanceCardProps {
  totalBalance: number
  availableBalance: number
  lockedBalance: number
}

export function BalanceCard({ totalBalance, availableBalance, lockedBalance }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [displayBalance, setDisplayBalance] = useState(totalBalance)

  useEffect(() => {
    const difference = totalBalance - displayBalance
    if (Math.abs(difference) < 0.01) {
      setDisplayBalance(totalBalance)
      return
    }
    
    const step = difference / 20
    const timer = setTimeout(() => {
      setDisplayBalance(prev => prev + step)
    }, 30)
    
    return () => clearTimeout(timer)
  }, [totalBalance, displayBalance])

  const formatBalance = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 shadow-2xl shadow-primary/20">
      {/* Background decorations */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-white/10 blur-xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Total Portfolio Value</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {totalBalance > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Earning Daily</span>
            </div>
          )}
        </div>

        {/* Main Balance */}
        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-white md:text-6xl">
              {showBalance ? `$${formatBalance(displayBalance)}` : "********"}
            </span>
            <span className="text-xl font-medium text-white/60">USDT</span>
          </div>
        </div>

        {/* Balance Breakdown */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/20">
                <TrendingUp className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Available</p>
                <p className="text-xl font-bold text-white">
                  {showBalance ? `$${formatBalance(availableBalance)}` : "****"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-green-300">Ready to withdraw</span>
            </div>
          </div>
          
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/20">
                <Lock className="h-5 w-5 text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-white/60">Locked in FD</p>
                <p className="text-xl font-bold text-white">
                  {showBalance ? `$${formatBalance(lockedBalance)}` : "****"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs text-yellow-300">Generating ROI</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Button 
            asChild 
            size="lg"
            className="flex-1 h-14 bg-white text-primary hover:bg-white/90 font-semibold text-base shadow-lg"
          >
            <Link href="/dashboard/wallet">
              <ArrowDownLeft className="mr-2 h-5 w-5" />
              Deposit
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="flex-1 h-14 border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold text-base backdrop-blur-sm"
          >
            <Link href="/dashboard/wallet">
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Withdraw
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
