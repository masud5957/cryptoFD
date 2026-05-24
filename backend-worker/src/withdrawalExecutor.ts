import { ethers } from "ethers";
import { CONFIG } from "./config";
import { prisma, incrementBalance } from "./db";

// BSC USDT uses 18 decimals
const USDT_DECIMALS = 18;

const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

export async function processWithdrawals() {
  try {
    // Get pending withdrawal requests
    const pendingWithdrawals = await prisma.withdrawalRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      take: 5,
    });

    if (!pendingWithdrawals || pendingWithdrawals.length === 0) {
      return;
    }

    console.log(`[WithdrawalExecutor] Processing ${pendingWithdrawals.length} pending withdrawals`);

    const provider = new ethers.JsonRpcProvider(CONFIG.rpc);
    const hotWallet = new ethers.Wallet(CONFIG.hotKey, provider);
    const usdtContract = new ethers.Contract(CONFIG.usdt, USDT_ABI, hotWallet);

    // Check hot wallet USDT balance once
    const hotWalletBalance = await usdtContract.balanceOf(hotWallet.address);
    const hotWalletBalanceFormatted = Number(ethers.formatUnits(hotWalletBalance, USDT_DECIMALS));
    
    console.log(`[WithdrawalExecutor] Hot wallet USDT balance: ${hotWalletBalanceFormatted}`);

    for (const withdrawal of pendingWithdrawals) {
      try {
        const withdrawAmount = Number(withdrawal.amount);

        console.log(`[WithdrawalExecutor] Processing: ${withdrawAmount} USDT to ${withdrawal.toAddress}`);

        // Check if hot wallet has enough balance
        if (hotWalletBalanceFormatted < withdrawAmount) {
          console.log(`[WithdrawalExecutor] Insufficient balance, skipping withdrawal ${withdrawal.id}`);
          continue; // Skip but don't fail - will try again later
        }

        // Mark as processing
        await prisma.withdrawalRequest.update({
          where: { id: withdrawal.id },
          data: { status: "processing" },
        });

        // Convert amount to wei (18 decimals)
        const amountWei = ethers.parseUnits(withdrawal.amount.toString(), USDT_DECIMALS);

        // Send USDT transfer
        const tx = await usdtContract.transfer(withdrawal.toAddress, amountWei);
        console.log(`[WithdrawalExecutor] TX sent: ${tx.hash}`);

        // Wait for confirmation
        const receipt = await tx.wait(1);

        if (receipt && receipt.status === 1) {
          // Update withdrawal request as completed
          await prisma.withdrawalRequest.update({
            where: { id: withdrawal.id },
            data: {
              status: "completed",
              txHash: tx.hash,
              processedAt: new Date(),
            },
          });

          // Create transaction record
          await prisma.transaction.create({
            data: {
              userId: withdrawal.userId,
              type: "withdrawal",
              amount: Number(withdrawal.amount),
              status: "completed",
              txHash: tx.hash,
              description: `Withdrawal to ${withdrawal.toAddress}`,
            },
          });

          console.log(`[WithdrawalExecutor] Withdrawal ${withdrawal.id} completed: ${tx.hash}`);
        } else {
          throw new Error("Transaction failed");
        }

      } catch (err: any) {
        console.error(`[WithdrawalExecutor] Error processing withdrawal ${withdrawal.id}:`, err.message);

        // Mark as failed and refund user
        await prisma.withdrawalRequest.update({
          where: { id: withdrawal.id },
          data: {
            status: "failed",
            errorMessage: err.message || "Unknown error",
            processedAt: new Date(),
          },
        });

        // Refund the user's balance
        await incrementBalance(withdrawal.userId, Number(withdrawal.amount));

        console.log(`[WithdrawalExecutor] Refunded ${withdrawal.amount} USDT to user ${withdrawal.userId}`);
      }
    }

  } catch (err) {
    console.error("[WithdrawalExecutor] Fatal error:", err);
  }
}
