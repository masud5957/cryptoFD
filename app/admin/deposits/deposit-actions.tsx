"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, X, Loader2 } from "lucide-react"
import { approveDeposit, rejectDeposit } from "@/lib/admin-actions"

interface DepositActionsProps {
  transactionId: string
}

export function DepositActions({ transactionId }: DepositActionsProps) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async () => {
    setIsApproving(true)
    const result = await approveDeposit(transactionId)
    setIsApproving(false)
    
    if (result.success) {
      router.refresh()
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    const result = await rejectDeposit(transactionId, rejectReason || undefined)
    setIsRejecting(false)
    
    if (result.success) {
      setShowRejectDialog(false)
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-green-500/50 text-green-500 hover:bg-green-500/10"
          onClick={handleApprove}
          disabled={isApproving}
        >
          {isApproving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Confirm
        </Button>
        <Button
          variant="outline"
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          onClick={() => setShowRejectDialog(true)}
        >
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Deposit</DialogTitle>
            <DialogDescription>
              This deposit will be marked as failed. Enter a reason (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-muted-foreground">Reason</label>
            <Input
              placeholder="Enter rejection reason (optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Deposit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
