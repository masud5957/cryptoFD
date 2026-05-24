import { prisma, incrementBalance } from "./db";

// Process daily FD earnings - credits to wallet_balance
export async function processFDEarnings() {
  try {
    const now = new Date();

    // Get all active FDs
    const activeFDs = await prisma.userFD.findMany({
      where: { status: "active" },
    });

    if (!activeFDs || activeFDs.length === 0) {
      return;
    }

    console.log(`[FDEarnings] Processing ${activeFDs.length} active FDs`);

    for (const fd of activeFDs) {
      try {
        const endDate = new Date(fd.endDate);
        const lastPayout = new Date(fd.lastPayoutDate);

        // Check if FD has matured
        if (now >= endDate) {
          await handleFDMaturity(fd);
          continue;
        }

        // Check if 24 hours have passed since last payout
        const hoursSinceLastPayout = (now.getTime() - lastPayout.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastPayout < 24) {
          continue; // Not yet time for daily payout
        }

        // Calculate days to pay (might be multiple if worker was down)
        const daysToPay = Math.floor(hoursSinceLastPayout / 24);
        const earningsToPay = Number(fd.dailyEarning) * daysToPay;

        console.log(`[FDEarnings] Crediting ${earningsToPay} USDT (${daysToPay} days) for user ${fd.userId}`);

        // Update FD record
        const newTotalEarned = Number(fd.totalEarned) + earningsToPay;
        const newLastPayout = new Date(lastPayout.getTime() + (daysToPay * 24 * 60 * 60 * 1000));
        
        await prisma.userFD.update({
          where: { id: fd.id },
          data: {
            totalEarned: newTotalEarned,
            lastPayoutDate: newLastPayout,
          },
        });

        // Credit earnings to user wallet_balance
        await incrementBalance(fd.userId, earningsToPay);

        // Update profile total_earnings
        await prisma.profile.update({
          where: { id: fd.userId },
          data: {
            totalEarnings: { increment: earningsToPay },
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: fd.userId,
            type: "fd_earning",
            amount: earningsToPay,
            status: "completed",
            description: `Daily ROI (${daysToPay} day${daysToPay > 1 ? 's' : ''}) - ${fd.planName}`,
            referenceId: fd.id,
          },
        });

        console.log(`[FDEarnings] Credited ${earningsToPay} USDT to user ${fd.userId}`);

      } catch (err) {
        console.error(`[FDEarnings] Error processing FD ${fd.id}:`, err);
      }
    }

  } catch (err) {
    console.error("[FDEarnings] Fatal error:", err);
  }
}

async function handleFDMaturity(fd: any) {
  console.log(`[FDEarnings] FD ${fd.id} has matured`);

  const principalAmount = Number(fd.amount);
  
  // Calculate any remaining unpaid earnings
  const lastPayout = new Date(fd.lastPayoutDate);
  const endDate = new Date(fd.endDate);
  const hoursSinceLastPayout = (endDate.getTime() - lastPayout.getTime()) / (1000 * 60 * 60);
  const remainingDays = Math.max(0, Math.floor(hoursSinceLastPayout / 24));
  const remainingEarnings = Number(fd.dailyEarning) * remainingDays;

  try {
    // Get profile for locked_balance update
    const profile = await prisma.profile.findUnique({
      where: { id: fd.userId },
      select: { lockedBalance: true, totalEarnings: true },
    });

    if (!profile) {
      console.error(`[FDEarnings] Profile not found for user ${fd.userId}`);
      return;
    }

    // Return principal to wallet_balance and update locked_balance
    await prisma.profile.update({
      where: { id: fd.userId },
      data: {
        walletBalance: { increment: principalAmount + remainingEarnings },
        lockedBalance: { decrement: principalAmount },
        totalEarnings: { increment: remainingEarnings },
      },
    });

    // Mark FD as completed
    await prisma.userFD.update({
      where: { id: fd.id },
      data: {
        status: "completed",
        totalEarned: Number(fd.totalEarned) + remainingEarnings,
        lastPayoutDate: new Date(),
      },
    });

    // Create maturity transaction
    await prisma.transaction.create({
      data: {
        userId: fd.userId,
        type: "fd_maturity",
        amount: principalAmount + Number(fd.totalEarned) + remainingEarnings,
        status: "completed",
        description: `FD matured - Principal: ${principalAmount} USDT + Earnings: ${Number(fd.totalEarned) + remainingEarnings} USDT`,
        referenceId: fd.id,
      },
    });

    console.log(`[FDEarnings] FD ${fd.id} completed. Principal ${principalAmount} + Earnings returned to wallet`);

  } catch (err) {
    console.error(`[FDEarnings] Error handling maturity for FD ${fd.id}:`, err);
  }
}
