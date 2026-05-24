import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { generateToken, createReferralChain } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"

// POST /api/auth/verify-otp - Verify OTP and complete registration/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check OTP
    if (!user.otpCode || user.otpCode !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Check if OTP expired
    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      )
    }

    // Clear OTP and mark as verified
    const wasVerified = user.isVerified
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      }
    })

    // If this is first verification (registration), create referral chain
    if (!wasVerified && user.referredBy) {
      await createReferralChain(user.id, user.referredBy)
      await sendWelcomeEmail(user.email, user.name || undefined)
    }

    // Generate JWT token
    const token = await generateToken(user.id)

    // Create response with cookie
    const response = NextResponse.json({
      message: "Verification successful",
      redirectTo: "/dashboard",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      }
    })

    // Set auth cookie on response
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("[v0] Verify OTP - Cookie set, redirecting to dashboard")
    return response
  } catch (error) {
    console.error("[Verify OTP] Error:", error)
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    )
  }
}
