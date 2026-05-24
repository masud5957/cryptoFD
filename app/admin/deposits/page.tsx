import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllTransactions } from "@/lib/admin-queries"
import { DepositActions } from "./deposit-actions"

export default async function PendingDepositsPage() {
  const pendingDeposits = await getAllTransactions(undefined, "pending", "deposit")
  const completedDeposits = await getAllTransactions(50, "completed", "deposit")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pending Deposits</h1>
        <p className="text-muted-foreground">Review and confirm user deposits</p>
      </div>

      {/* Pending Deposits */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Pending Deposits ({pendingDeposits.length})
        </h3>
        
        {pendingDeposits.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No pending deposits to review
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {pendingDeposits.map((tx) => (
              <div key={tx.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-500">
                        +${Math.abs(Number(tx.amount)).toFixed(2)}
                      </span>
                      <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.description || "Deposit request"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>User ID: {tx.userId.slice(0, 8)}...</span>
                      <span>Submitted: {new Date(tx.createdAt).toLocaleString()}</span>
                      {tx.txHash && <span>TX: {tx.txHash}</span>}
                    </div>
                  </div>
                  
                  <DepositActions transactionId={tx.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Completed Deposits */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Confirmed Deposits
        </h3>
        
        {completedDeposits.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No confirmed deposits yet
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {completedDeposits.map((tx) => (
                  <tr key={tx.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-green-500">
                      +${Math.abs(Number(tx.amount)).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {tx.userId.slice(0, 8)}...
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {tx.description || "-"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
