"use server"

import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function approveDeposit(transactionId: string) {
  await requireAdmin()
  
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId }
  })
  
  if (!tx) {
    return { error: "Transaction not found" }
  }
  
  if (tx.type !== "deposit" || tx.status !== "pending") {
    return { error: "Invalid transaction for approval" }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (prismaClient: any) => {
    // Update transaction status
    await prismaClient.transaction.update({
      where: { id: transactionId },
      data: { status: "completed" }
    })
    
    // Add to user's wallet balance
    await prismaClient.profile.update({
      where: { id: tx.userId },
      data: {
        walletBalance: { increment: Math.abs(Number(tx.amount)) }
      }
    })
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/transactions")
  
  return { success: true }
}

export async function rejectDeposit(transactionId: string, reason?: string) {
  await requireAdmin()
  
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { 
      status: "failed",
      description: reason || "Deposit rejected by admin"
    }
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/transactions")
  
  return { success: true }
}

export async function approveWithdrawal(transactionId: string, txHash?: string) {
  await requireAdmin()
  
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId }
  })
  
  if (!tx) {
    return { error: "Transaction not found" }
  }
  
  if (tx.type !== "withdrawal" || tx.status !== "pending") {
    return { error: "Invalid transaction for approval" }
  }
  
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { 
      status: "completed",
      txHash: txHash || null
    }
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/transactions")
  
  return { success: true }
}

export async function rejectWithdrawal(transactionId: string, reason?: string) {
  await requireAdmin()
  
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId }
  })
  
  if (!tx) {
    return { error: "Transaction not found" }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (prismaClient: any) => {
    // Refund the amount back to user's wallet
    await prismaClient.profile.update({
      where: { id: tx.userId },
      data: {
        walletBalance: { increment: Math.abs(Number(tx.amount)) }
      }
    })
    
    // Update transaction status
    await prismaClient.transaction.update({
      where: { id: transactionId },
      data: { 
        status: "failed",
        description: reason || "Withdrawal rejected by admin"
      }
    })
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/transactions")
  
  return { success: true }
}

export async function addUserBalance(userId: string, amount: number, description?: string) {
  await requireAdmin()
  
  if (amount <= 0) {
    return { error: "Amount must be positive" }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (prismaClient: any) => {
    await prismaClient.profile.update({
      where: { id: userId },
      data: {
        walletBalance: { increment: amount }
      }
    })
    
    await prismaClient.transaction.create({
      data: {
        userId,
        type: "deposit",
        amount: amount,
        status: "completed",
        description: description || "Admin credit",
      }
    })
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/users")
  
  return { success: true }
}

export async function deductUserBalance(userId: string, amount: number, description?: string) {
  await requireAdmin()
  
  if (amount <= 0) {
    return { error: "Amount must be positive" }
  }
  
  const profile = await prisma.profile.findUnique({
    where: { id: userId }
  })
  
  if (!profile) {
    return { error: "User not found" }
  }
  
  if (Number(profile.walletBalance) < amount) {
    return { error: "Insufficient balance" }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (prismaClient: any) => {
    await prismaClient.profile.update({
      where: { id: userId },
      data: {
        walletBalance: { decrement: amount }
      }
    })
    
    await prismaClient.transaction.create({
      data: {
        userId,
        type: "withdrawal",
        amount: -amount,
        status: "completed",
        description: description || "Admin debit",
      }
    })
  })
  
  revalidatePath("/admin")
  revalidatePath("/admin/users")
  
  return { success: true }
}

export async function setUserAdmin(userId: string, isAdminStatus: boolean) {
  await requireAdmin()
  
  await prisma.profile.update({
    where: { id: userId },
    data: { isAdmin: isAdminStatus }
  })
  
  revalidatePath("/admin/users")
  
  return { success: true }
}

export async function createFDPlan(
  name: string,
  minAmount: number,
  maxAmount: number,
  dailyRoi: number,
  durationDays: number
) {
  await requireAdmin()
  
  const activeCount = await prisma.fdPlan.count({
    where: { isActive: true }
  })
  
  if (activeCount >= 6) {
    return { error: "Maximum 6 FD plans allowed. Please deactivate an existing plan first." }
  }
  
  if (minAmount >= maxAmount) {
    return { error: "Min amount must be less than max amount" }
  }
  
  if (dailyRoi <= 0 || dailyRoi > 10) {
    return { error: "Daily ROI must be between 0 and 10%" }
  }
  
  await prisma.fdPlan.create({
    data: {
      name,
      minAmount,
      maxAmount,
      dailyRoi,
      durationDays,
      isActive: true,
    }
  })
  
  revalidatePath("/admin/plans")
  
  return { success: true }
}

export async function updateFDPlan(
  planId: string,
  name: string,
  minAmount: number,
  maxAmount: number,
  dailyRoi: number,
  durationDays: number,
  isActive: boolean
) {
  await requireAdmin()
  
  await prisma.fdPlan.update({
    where: { id: planId },
    data: {
      name,
      minAmount,
      maxAmount,
      dailyRoi,
      durationDays,
      isActive,
    }
  })
  
  revalidatePath("/admin/plans")
  
  return { success: true }
}

export async function togglePlanStatus(planId: string, isActive: boolean) {
  await requireAdmin()
  
  await prisma.fdPlan.update({
    where: { id: planId },
    data: { isActive }
  })
  
  revalidatePath("/admin/plans")
  
  return { success: true }
}

export async function deletePlan(planId: string) {
  return deleteFDPlan(planId)
}

export async function createPlan(data: {
  name: string
  min_amount: number
  max_amount: number
  daily_roi: number
  duration_days: number
}) {
  return createFDPlan(
    data.name,
    data.min_amount,
    data.max_amount,
    data.daily_roi,
    data.duration_days
  )
}

export async function deleteFDPlan(planId: string) {
  await requireAdmin()
  
  const activeCount = await prisma.userFd.count({
    where: { planId, status: "active" }
  })
  
  if (activeCount > 0) {
    return { error: "Cannot delete plan with active FDs" }
  }
  
  await prisma.fdPlan.update({
    where: { id: planId },
    data: { isActive: false }
  })
  
  revalidatePath("/admin/plans")
  
  return { success: true }
}

// Daily earnings distribution function
export async function processDailyEarnings() {
  await requireAdmin()
  
  const activeFDs = await prisma.userFd.findMany({
    where: { status: "active" }
  })
  
  if (activeFDs.length === 0) {
    return { success: true, processed: 0 }
  }
  
  let processed = 0
  const today = new Date().toISOString().split("T")[0]
  
  for (const fd of activeFDs) {
    const lastPayout = fd.lastPayoutDate?.toISOString().split("T")[0]
    
    if (lastPayout === today) {
      continue // Already paid today
    }
    
    const dailyEarning = Number(fd.dailyEarning)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(async (tx: any) => {
      // Add earning to user's wallet and total_earnings
      await tx.profile.update({
        where: { id: fd.userId },
        data: {
          walletBalance: { increment: dailyEarning },
          totalEarnings: { increment: dailyEarning },
        }
      })
      
      // Update FD record
      await tx.userFd.update({
        where: { id: fd.id },
        data: {
          totalEarned: { increment: dailyEarning },
          daysCompleted: { increment: 1 },
          lastPayoutDate: new Date(),
        }
      })
      
      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: fd.userId,
          type: "fd_earning",
          amount: dailyEarning,
          status: "completed",
          description: "Daily FD interest",
        }
      })
    })
    
    processed++
    
    // Check if FD has matured
    const endDate = new Date(fd.endDate)
    if (new Date() >= endDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.$transaction(async (tx: any) => {
        const profile = await tx.profile.findUnique({
          where: { id: fd.userId }
        })
        
        if (profile) {
          // Return principal to wallet, remove from locked
          await tx.profile.update({
            where: { id: fd.userId },
            data: {
              walletBalance: { increment: Number(fd.amount) },
              lockedBalance: { decrement: Number(fd.amount) },
            }
          })
        }
        
        // Mark FD as completed
        await tx.userFd.update({
          where: { id: fd.id },
          data: { status: "completed" }
        })
        
        // Create maturity transaction
        await tx.transaction.create({
          data: {
            userId: fd.userId,
            type: "fd_maturity",
            amount: Number(fd.amount),
            status: "completed",
            description: "FD maturity - principal returned",
          }
        })
      })
    }
  }
  
  revalidatePath("/admin")
  
  return { success: true, processed }
}
