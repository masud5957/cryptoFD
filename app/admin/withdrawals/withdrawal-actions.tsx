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
import { approveWithdrawal, rejectWithdrawal } from "@/lib/admin-actions"

interface WithdrawalActionsProps {
  transactionId: string
}

export function WithdrawalActions({ transactionId }: WithdrawalActionsProps) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [rejectReason, setRejectReason] = useState("")

  const handleApprove = async () => {
    setIsApproving(true)
    const result = await approveWithdrawal(transactionId, txHash || undefined)
    setIsApproving(false)
    
    if (result.success) {
      setShowApproveDialog(false)
      router.refresh()
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    const result = await rejectWithdrawal(transactionId, rejectReason || undefined)
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
          onClick={() => setShowApproveDialog(true)}
        >
          <Check className="mr-2 h-4 w-4" />
          Approve
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

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Withdrawal</DialogTitle>
            <DialogDescription>
              Enter the transaction hash after completing the payment (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-muted-foreground">Transaction Hash</label>
            <Input
              placeholder="Enter TX hash (optional)"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Withdrawal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
            <DialogDescription>
              The amount will be refunded to the user&apos;s wallet. Enter a reason (optional).
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
                "Reject & Refund"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
