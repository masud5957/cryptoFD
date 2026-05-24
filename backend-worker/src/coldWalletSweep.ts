import { ethers } from "ethers";
import { CONFIG } from "./config";
import { prisma } from "./db";

// BSC USDT uses 18 decimals
const USDT_DECIMALS = 18;

const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

/**
 * Auto-sweep excess funds from hot wallet to cold wallet
 * When hot wallet balance exceeds threshold (5000 USDT), sweep to cold wallet
 */
export async function sweepToColdWallet() {
  try {
    if (!CONFIG.coldAddress) {
      console.log("[ColdSweep] Cold wallet address not configured, skipping");
      return;
    }

    const provider = new ethers.JsonRpcProvider(CONFIG.rpc);
    const hotWallet = new ethers.Wallet(CONFIG.hotKey, provider);
    const usdtContract = new ethers.Contract(CONFIG.usdt, USDT_ABI, hotWallet);

    // Check hot wallet USDT balance
    const hotWalletBalance = await usdtContract.balanceOf(hotWallet.address);
    const hotWalletBalanceFormatted = Number(ethers.formatUnits(hotWalletBalance, USDT_DECIMALS));
    
    console.log(`[ColdSweep] Hot wallet balance: ${hotWalletBalanceFormatted} USDT`);

    // Check if balance exceeds threshold
    if (hotWalletBalanceFormatted <= CONFIG.coldSweepThreshold) {
      console.log(`[ColdSweep] Balance below threshold (${CONFIG.coldSweepThreshold}), no sweep needed`);
      return;
    }

    // Calculate amount to sweep (keep some buffer in hot wallet for withdrawals)
    // Sweep amount = balance - 1000 (keep 1000 USDT in hot wallet for pending withdrawals)
    const keepInHot = 1000;
    const sweepAmount = hotWalletBalanceFormatted - keepInHot;

    if (sweepAmount <= 0) {
      console.log("[ColdSweep] Nothing to sweep after keeping buffer");
      return;
    }

    console.log(`[ColdSweep] Sweeping ${sweepAmount} USDT to cold wallet: ${CONFIG.coldAddress}`);

    // Convert amount to wei (18 decimals)
    const amountWei = ethers.parseUnits(sweepAmount.toFixed(6), USDT_DECIMALS);

    // Send USDT transfer to cold wallet
    const tx = await usdtContract.transfer(CONFIG.coldAddress, amountWei);
    console.log(`[ColdSweep] TX sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);

    if (receipt && receipt.status === 1) {
      // Log the cold wallet sweep
      await prisma.transaction.create({
        data: {
          userId: "system", // System transaction
          type: "cold_sweep",
          amount: sweepAmount,
          status: "completed",
          txHash: tx.hash,
          description: `Auto-sweep ${sweepAmount} USDT from hot wallet to cold wallet`,
        },
      });

      console.log(`[ColdSweep] Successfully swept ${sweepAmount} USDT to cold wallet. TX: ${tx.hash}`);
    } else {
      throw new Error("Cold sweep transaction failed");
    }

  } catch (err: any) {
    console.error("[ColdSweep] Error:", err.message);
  }
}
