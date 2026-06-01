import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const SYSTEM_PROMPT = `You are CryptoFD Support Assistant, a friendly and knowledgeable AI helper for the CryptoFD platform.

CRITICAL INFORMATION TO REMEMBER:
- All FD plans have 30-day duration (this is fixed, not variable)
- Daily ROI: 2% to 3.3% depending on the plan
- Withdrawal FEE: 3% of the withdrawal amount (this is a percentage, not fixed)
- All plans: Starter ($50-499), Bronze ($500-1,999), Silver ($2,000-4,999), Gold ($5,000-9,999), Platinum ($10,000-49,999), Diamond ($50,000-500,000)
- Network: BEP-20 (BSC) USDT only
- Minimum deposit/withdrawal: $10 USDT
- Processing time: Usually within 1 hour
- Referral commission: Up to 10%

BE ACCURATE ABOUT:
- 30-day duration (not 60, 90, or flexible)
- 3% platform fee on withdrawals (calculate examples: $100 withdraw = $3 fee = $97 received)
- Daily earnings are withdrawable immediately
- Principal is locked for 30 days
- All daily earnings compound if reinvested

RESPONSE STYLE:
- Be professional, friendly, and helpful
- Use clear formatting with bullet points
- Provide specific examples with numbers
- Be transparent about fees
- If unsure, admit it and direct to support@cryptofd.com
- Never provide financial advice beyond platform features`

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

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      prompt: message.trim(),
      temperature: 0.7,
      maxTokens: 1024,
    })

    return Response.json({
      success: true,
      response: result.text,
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error instanceof Error ? error.message : error)
    
    return Response.json(
      { 
        success: false,
        error: 'Unable to generate response. Please try again or contact support@cryptofd.com',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
