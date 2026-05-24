"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, Gift, CheckCircle, Users, Sparkles } from "lucide-react"
import { useState } from "react"

interface ReferralCardProps {
  referralCode: string
}

export function ReferralCard({ referralCode }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const referralLink = `${baseUrl}/auth/sign-up?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join CryptoFD - Earn 2-3.3% Daily",
        text: "I'm earning daily returns with CryptoFD! Join using my referral link and start your investment journey.",
        url: referralLink,
      })
    } else {
      handleCopy()
    }
  }

  return (
    <Card className="rounded-2xl border-border bg-card overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Invite & Earn</h3>
            <p className="text-sm text-white/80">Get 10% of referral investments</p>
          </div>
        </div>
        
        {/* Bonus tiers */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 rounded-lg bg-white/10 backdrop-blur p-2 text-center">
            <p className="text-xs text-white/70">Level 1</p>
            <p className="font-bold">10%</p>
          </div>
          <div className="flex-1 rounded-lg bg-white/10 backdrop-blur p-2 text-center">
            <p className="text-xs text-white/70">Level 2</p>
            <p className="font-bold">5%</p>
          </div>
          <div className="flex-1 rounded-lg bg-white/10 backdrop-blur p-2 text-center">
            <p className="text-xs text-white/70">Level 3</p>
            <p className="font-bold">2%</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Referral Code */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Your Referral Code
          </label>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={referralCode || "Loading..."}
                readOnly
                className="bg-secondary/50 font-mono text-lg font-bold text-center tracking-wider"
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Referral Link
          </label>
          <div className="mt-2">
            <Input
              value={referralCode ? referralLink : "Loading..."}
              readOnly
              className="bg-secondary/50 text-sm text-muted-foreground truncate"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleCopy} 
            className="flex-1 gap-2 h-11" 
            disabled={!referralCode}
            variant={copied ? "secondary" : "default"}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare} 
            className="flex-1 gap-2 h-11" 
            disabled={!referralCode}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            Earn commissions when your referrals make investments. Unlimited earnings potential!
          </p>
        </div>
      </div>
    </Card>
  )
}
