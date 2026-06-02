// Custom chatbot responses - no external AI API needed
const generateChatResponse = async (message: string) => {
  // Use custom chatbot responses
  try {
    return generateFallbackResponse(message)
  } catch (error) {
    // Fallback to default response if any error occurs
    return generateFallbackResponse(message)
  }
}

const generateFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('create') || lowerMessage.includes('deposit')) {
    return `To create a fixed deposit on CryptoFD:

1. Log into your dashboard
2. Click "New Investment" or "Create FD"
3. Choose your plan based on your investment amount:
   - Starter: $50-$499 (2% daily)
   - Bronze: $500-$1,999 (2.2% daily)
   - Silver: $2,000-$4,999 (2.5% daily)
   - Gold: $5,000-$9,999 (2.75% daily)
   - Platinum: $10,000-$49,999 (3% daily)
   - Diamond: $50,000+ (3.3% daily)

4. Enter your USDT amount
5. Approve the transaction
6. Your investment is active immediately!

Daily earnings start accruing the next day. After 30 days, your principal + earnings are automatically returned to your wallet.`
  }

  if (lowerMessage.includes('profit') || lowerMessage.includes('earn') || lowerMessage.includes('calculate')) {
    return `Here's how CryptoFD profits work:

Daily Earnings Formula: Investment Amount × Daily ROI %

Example (Silver Plan - $2,000 at 2.5% daily):
- Daily earnings: $2,000 × 2.5% = $50/day
- 7-day earnings: $50 × 7 = $350
- 30-day earnings: $50 × 30 = $1,500
- Total after 30 days: $2,000 + $1,500 = $3,500 (75% profit!)

You can withdraw daily earnings anytime (3% fee applies).
After 30 days, your principal is returned automatically.

Want to calculate for a different amount? Just tell me the investment size!`
  }

  if (lowerMessage.includes('withdraw')) {
    return `Withdrawal Information:

Daily Earnings: Withdraw ANYTIME
- No lock-in period
- 3% withdrawal fee applies
- Processed in 30 minutes to 1 hour

Principal: Locked for 30 days
- After 30 days: Automatically returned to your wallet
- No fee on principal return
- Can immediately reinvest

Withdrawal Fee Example:
- Withdraw $100 → Fee $3 → You receive $97
- Withdraw $1,000 → Fee $30 → You receive $970
- Withdraw $5,000 → Fee $150 → You receive $4,850

Strategy: Withdraw only earnings, keep principal invested for continuous income!`
  }

  if (lowerMessage.includes('referral') || lowerMessage.includes('earn passive')) {
    return `CryptoFD Referral Program - 10% Lifetime Commission:

How It Works:
- Earn 10% of your referred user's DAILY earnings
- Completely PASSIVE - automatic payments forever
- Unlimited referrals - no maximum cap
- Direct to your wallet daily

Example (Your friend invests $5,000 Gold @ 2.75%):
- Their daily earnings: $5,000 × 2.75% = $137.50/day
- Your 10% commission: $137.50 × 10% = $13.75/day
- Monthly from 1 referral: $412.50
- Annual from 1 referral: $5,018.75

Build a Network:
- 10 referrals × $50,000 average: $417.50/day passive income
- That's $12,525/month without your own investment!
- 50 referrals: $15,000+/month recurring income

Share your unique referral link and start earning!`
  }

  if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
    return `CryptoFD Security & Safety:

Your Investment is Protected By:
✓ Blockchain Verification - All transactions on BSC (auditable)
✓ Smart Contracts - Automated, tamper-proof payouts
✓ Cold Storage - Primary funds stored offline
✓ 100% Capital Guarantee - Principal fully protected
✓ Military-Grade Encryption - AES-256 encryption
✓ Multi-Signature Approvals - Multiple authorizations needed
✓ 24/7 Monitoring - Real-time security surveillance
✓ Insurance Coverage - Additional asset protection

Why You're Safe:
1. Transparent blockchain = no hidden activities
2. Smart contracts = no human error possible
3. Cold storage = protected from hacking
4. Insurance = financial backup
5. Professional team = experienced in crypto security

Your capital is 100% safe!`
  }

  return `Welcome to CryptoFD Assistant! I can help you with:
- Creating fixed deposits
- Calculating profits
- Understanding withdrawals
- Learning about our referral program
- Security information
- Any other questions about CryptoFD

What would you like to know?`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return Response.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    const response = await generateChatResponse(message.trim())

    return Response.json({
      success: true,
      response: response,
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error instanceof Error ? error.message : error)
    
    // Fallback to simple response if everything fails
    const fallbackResponse = generateFallbackResponse('How can I help?')
    
    return Response.json(
      { 
        success: true,
        response: fallbackResponse
      },
      { status: 200 }
    )
  }
}
