import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllTransactions } from "@/lib/admin-queries"
import { WithdrawalActions } from "./withdrawal-actions"

export default async function PendingWithdrawalsPage() {
  const pendingWithdrawals = await getAllTransactions(undefined, "pending", "withdrawal")
  const completedWithdrawals = await getAllTransactions(50, "completed", "withdrawal")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pending Withdrawals</h1>
        <p className="text-muted-foreground">Review and process withdrawal requests</p>
      </div>

      {/* Pending Withdrawals */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Pending Requests ({pendingWithdrawals.length})
        </h3>
        
        {pendingWithdrawals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No pending withdrawal requests
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {pendingWithdrawals.map((tx) => (
              <div key={tx.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        ${Math.abs(Number(tx.amount)).toFixed(2)}
                      </span>
                      <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.description || "Withdrawal request"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>User ID: {tx.userId.slice(0, 8)}...</span>
                      <span>Requested: {new Date(tx.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <WithdrawalActions transactionId={tx.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Completed Withdrawals */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Recent Completed Withdrawals
        </h3>
        
        {completedWithdrawals.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No completed withdrawals yet
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">TX Hash</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {completedWithdrawals.map((tx) => (
                  <tr key={tx.id} className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-foreground">
                      ${Math.abs(Number(tx.amount)).toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {tx.userId.slice(0, 8)}...
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {tx.description || "-"}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                      {tx.txHash ? `${tx.txHash.slice(0, 10)}...` : "-"}
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
