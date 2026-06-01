import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const SYSTEM_PROMPT = `You are CryptoFD Assistant, a knowledgeable and friendly customer support AI for CryptoFD - a cryptocurrency Fixed Deposit platform.

**About CryptoFD:**
- Platform for investing in Fixed Deposits (FDs) with guaranteed returns
- All plans have 30-day duration
- Daily ROI ranges from 2% to 3.3% depending on the plan
- 6 investment plans: Starter ($50-499), Bronze ($500-1999), Silver ($2000-4999), Gold ($5000-9999), Platinum ($10000-49999), Diamond ($50000-500000)
- Daily earnings are withdrawable immediately
- Principal locked for 30 days, returns on maturity
- Referral program with up to 10% commission
- Withdrawal fee: 3% platform fee (no fixed fees)
- Network: BSC (BEP-20 USDT)
- Minimum deposit/withdrawal: $10 USDT
- Withdrawal processing: Usually within 1 hour

**Your responsibilities:**
- Provide accurate, helpful information about CryptoFD
- Answer questions about investments, withdrawals, fees, security
- Guide users through the platform features
- Be professional yet friendly
- Never provide investment advice or guarantees beyond what CryptoFD officially offers
- Always direct users to support for account-specific issues
- Be clear and concise in responses

**When responding:**
- Use clear formatting with bullet points when helpful
- Provide specific examples with numbers
- Be transparent about fees and all costs
- Acknowledge if you're unsure and direct to support@cryptofd.com
- Remember: 30-day plans, 2%-3.3% daily ROI, 3% withdrawal fee`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    console.log('[v0] Incoming chat message:', message)

    if (!message || typeof message !== 'string' || !message.trim()) {
      return Response.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    console.log('[v0] Calling OpenAI API with model: gpt-4o-mini')
    
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      prompt: message.trim(),
      temperature: 0.7,
      maxTokens: 1024,
    })

    console.log('[v0] API response generated successfully')

    return Response.json({
      response: result.text,
      usage: {
        inputTokens: result.usage.promptTokens,
        outputTokens: result.usage.completionTokens,
      },
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Error details:', errorMessage)

    return Response.json(
      { 
        error: 'Failed to generate response',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
