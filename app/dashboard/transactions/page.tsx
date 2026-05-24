import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getTransactions } from "@/lib/queries"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Layers, 
  Users,
  Percent,
  Coins
} from "lucide-react"
import type { Transaction } from "@/lib/types"

const typeConfig: Record<string, { icon: typeof Layers; color: string; label: string }> = {
  deposit: { icon: ArrowDownToLine, color: "bg-green-500/10 text-green-500", label: "Deposit" },
  withdrawal: { icon: ArrowUpFromLine, color: "bg-orange-500/10 text-orange-500", label: "Withdrawal" },
  fd_investment: { icon: Layers, color: "bg-blue-500/10 text-blue-500", label: "FD Investment" },
  fd_earning: { icon: Percent, color: "bg-green-500/10 text-green-500", label: "FD Earning" },
  referral_earning: { icon: Users, color: "bg-purple-500/10 text-purple-500", label: "Referral" },
  fd_maturity: { icon: Coins, color: "bg-yellow-500/10 text-yellow-500", label: "FD Maturity" },
}

const statusConfig: Record<string, string> = {
  completed: "bg-green-500/10 text-green-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  failed: "bg-red-500/10 text-red-500",
  cancelled: "bg-muted text-muted-foreground",
}

function TransactionTable({ data }: { data: Transaction[] }) {
  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No transactions found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Description</TableHead>
            <TableHead className="text-muted-foreground">Amount</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">TX Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tx) => {
            const config = typeConfig[tx.type] || typeConfig.fd_earning
            const Icon = config.icon
            const isPositive = Number(tx.amount) > 0

            return (
              <TableRow key={tx.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{config.label}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {tx.description || config.label}
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${isPositive ? "text-green-500" : "text-foreground"}`}>
                    {isPositive ? "+" : ""}${Math.abs(Number(tx.amount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={statusConfig[tx.status]}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {tx.txHash ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}` : "-"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const transactions = await getTransactions()
  
  const deposits = transactions.filter((t) => t.type === "deposit")
  const withdrawals = transactions.filter((t) => t.type === "withdrawal")
  const fdTransactions = transactions.filter((t) => t.type === "fd_investment" || t.type === "fd_earning" || t.type === "fd_maturity")
  const referralTransactions = transactions.filter((t) => t.type === "referral_earning")

  // Calculate totals
  const totalDeposits = deposits.filter(t => t.status === "completed").reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0)
  const totalWithdrawals = withdrawals.filter(t => t.status === "completed").reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0)
  const totalFDEarnings = fdTransactions.filter(t => t.type === "fd_earning" && t.status === "completed").reduce((acc, t) => acc + Number(t.amount), 0)
  const totalReferralEarnings = referralTransactions.filter(t => t.status === "completed").reduce((acc, t) => acc + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="mt-1 text-muted-foreground">
          View all your transaction history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <ArrowDownToLine className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposits</p>
              <p className="text-lg font-bold text-foreground">
                ${totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
              <ArrowUpFromLine className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Withdrawals</p>
              <p className="text-lg font-bold text-foreground">
                ${totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <Percent className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">FD Earnings</p>
              <p className="text-lg font-bold text-green-500">
                +${totalFDEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Referral Earnings</p>
              <p className="text-lg font-bold text-purple-500">
                +${totalReferralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-2xl border-border bg-card p-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary">
              All ({transactions.length})
            </TabsTrigger>
            <TabsTrigger value="deposits" className="data-[state=active]:bg-primary">
              Deposits ({deposits.length})
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-primary">
              Withdrawals ({withdrawals.length})
            </TabsTrigger>
            <TabsTrigger value="fd" className="data-[state=active]:bg-primary">
              FD ({fdTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="referral" className="data-[state=active]:bg-primary">
              Referral ({referralTransactions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TransactionTable data={transactions} />
          </TabsContent>
          <TabsContent value="deposits">
            <TransactionTable data={deposits} />
          </TabsContent>
          <TabsContent value="withdrawals">
            <TransactionTable data={withdrawals} />
          </TabsContent>
          <TabsContent value="fd">
            <TransactionTable data={fdTransactions} />
          </TabsContent>
          <TabsContent value="referral">
            <TransactionTable data={referralTransactions} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
