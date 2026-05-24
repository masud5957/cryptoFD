"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  TrendingUp,
  Wallet,
  Users,
  HelpCircle,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface QuickAction {
  label: string
  icon: React.ReactNode
  query: string
}

const quickActions: QuickAction[] = [
  { label: "How to earn?", icon: <TrendingUp className="w-3 h-3" />, query: "How do I earn money with CryptoFD?" },
  { label: "Calculate profit", icon: <DollarSign className="w-3 h-3" />, query: "How is my profit calculated?" },
  { label: "Withdrawals", icon: <Wallet className="w-3 h-3" />, query: "How do I withdraw my earnings?" },
  { label: "Referrals", icon: <Users className="w-3 h-3" />, query: "How does the referral program work?" },
  { label: "FD Plans", icon: <Sparkles className="w-3 h-3" />, query: "What are the different FD plans?" },
  { label: "Is it safe?", icon: <Shield className="w-3 h-3" />, query: "Is my money safe?" },
]

const knowledgeBase: { keywords: string[]; response: string }[] = [
  // Greetings
  {
    keywords: ["hello", "hi", "hey", "start", "help", "good morning", "good evening"],
    response: "Hello! Welcome to CryptoFD Support. I'm your AI assistant and I'm here to help you understand how our platform works.\n\nPopular topics:\n- How to earn daily returns (2% - 3.3%)\n- Investment plans (Starter to Diamond)\n- Deposits and withdrawals\n- Profit calculations\n- Referral program (up to 10%)\n- Security information\n\nWhat would you like to know?"
  },
  
  // Earning & ROI
  {
    keywords: ["earn", "earning", "money", "profit", "return", "roi", "daily", "interest", "income"],
    response: "With CryptoFD, you earn guaranteed daily returns on your USDT investments!\n\n**How It Works:**\n1. Deposit USDT to your unique wallet address\n2. Choose a plan (Starter to Diamond)\n3. Earn daily returns - credited every 24 hours\n4. Withdraw anytime - daily earnings are always available\n\n**Daily ROI Rates:**\n- Starter: 2.00% daily\n- Bronze: 2.25% daily\n- Silver: 2.50% daily\n- Gold: 2.75% daily\n- Platinum: 3.00% daily\n- Diamond: 3.30% daily\n\nYour daily earnings go directly to your available balance!"
  },
  
  // Profit Calculation
  {
    keywords: ["calculate", "calculation", "formula", "how much", "example", "estimate", "math"],
    response: "Let me show you exactly how your profit is calculated:\n\n**Daily Earning Formula:**\nDaily Profit = Investment Amount x (Daily ROI / 100)\n\n**Example with Gold Plan (2.75% daily):**\nIf you invest $1,000:\n- Daily earning = $1,000 x 0.0275 = $27.50\n- Weekly earning = $27.50 x 7 = $192.50\n- Monthly earning (30 days) = $27.50 x 30 = $825\n- Total after 30 days = $1,000 + $825 = $1,825\n\n**Example with Diamond Plan (3.30% daily):**\nIf you invest $50,000:\n- Daily earning = $50,000 x 0.033 = $1,650\n- Monthly earning = $1,650 x 30 = $49,500\n- Total after 30 days = $50,000 + $49,500 = $99,500\n\nYour earnings are credited daily and can be withdrawn immediately!"
  },
  
  // Withdrawal
  {
    keywords: ["withdraw", "withdrawal", "cash out", "take out", "get money", "payout", "transfer out"],
    response: "Withdrawing your earnings is simple and fast!\n\n**What You Can Withdraw:**\n- Daily FD earnings (available immediately)\n- Referral commissions\n- Matured FD principal (after 30 days)\n\n**How to Withdraw:**\n1. Go to Wallet page\n2. Click 'Withdraw' tab\n3. Enter your BEP-20 wallet address\n4. Enter amount (min 10 USDT)\n5. Click 'Request Withdrawal'\n\n**Processing:**\n- Time: Usually within 1 hour\n- Network: BEP-20 (BSC)\n- Fee: 1 USDT per withdrawal\n\n**Note:** Your locked FD principal returns to available balance after the 30-day period ends."
  },
  
  // Deposit
  {
    keywords: ["deposit", "add money", "fund", "add funds", "send", "top up", "load"],
    response: "Here's how to deposit USDT:\n\n**Steps:**\n1. Go to your Wallet page\n2. You'll see your unique BEP-20 deposit address\n3. Copy the address or scan QR code\n4. Send USDT from your external wallet\n\n**Important:**\n- Network: BEP-20 (BSC) ONLY\n- Minimum: 10 USDT\n- Detection: Auto-detected in 2-5 minutes\n- Your balance updates automatically\n\n**Warning:**\n- Only send USDT on BEP-20 network\n- Sending other tokens will result in permanent loss\n- Each user has a unique address\n\nOnce deposited, you can immediately invest in any FD plan!"
  },
  
  // FD Plans
  {
    keywords: ["plan", "plans", "tier", "starter", "bronze", "silver", "gold", "platinum", "diamond", "package"],
    response: "We offer 6 investment plans based on your investment amount:\n\n**Starter Plan**\n- Amount: $50 - $499\n- Daily ROI: 2.00%\n- Duration: 30 days\n\n**Bronze Plan**\n- Amount: $500 - $1,999\n- Daily ROI: 2.25%\n- Duration: 30 days\n\n**Silver Plan**\n- Amount: $2,000 - $4,999\n- Daily ROI: 2.50%\n- Duration: 30 days\n\n**Gold Plan**\n- Amount: $5,000 - $9,999\n- Daily ROI: 2.75%\n- Duration: 30 days\n\n**Platinum Plan**\n- Amount: $10,000 - $49,999\n- Daily ROI: 3.00%\n- Duration: 30 days\n\n**Diamond Plan**\n- Amount: $50,000+\n- Daily ROI: 3.30%\n- Duration: 30 days\n\nHigher investment = Higher daily returns!"
  },
  
  // Referral Program
  {
    keywords: ["referral", "refer", "invite", "friend", "commission", "bonus", "affiliate", "share", "link"],
    response: "Our referral program lets you earn from your network!\n\n**Commission Structure:**\n- Level 1 (Direct): 10% of their investment earnings\n- Level 2: 5% of their investment earnings\n- Level 3: 2% of their investment earnings\n\n**How It Works:**\n1. Share your unique referral link\n2. Friend signs up using your link\n3. They make an investment\n4. You earn commission instantly\n\n**Example:**\nYour friend invests $1,000 in Gold plan (2.75% daily = $27.50/day)\n- You earn: $27.50 x 10% = $2.75 daily from them!\n\n**Find Your Link:**\nGo to Referral page in dashboard\n\n**No Limits!**\nRefer unlimited people, earn unlimited commissions!"
  },
  
  // Security
  {
    keywords: ["safe", "secure", "security", "trust", "legit", "scam", "real", "genuine", "protection"],
    response: "Your security is our top priority!\n\n**Security Measures:**\n- Cold Storage: Majority of funds in offline wallets\n- Multi-Signature: Multiple approvals for large transactions\n- SSL Encryption: Bank-grade 256-bit encryption\n- Blockchain: All transactions verifiable on-chain\n- 2FA: Two-factor authentication available\n\n**Company Info:**\n- Founded by Stanford University students\n- Headquartered in London, UK\n- Established 2022\n- 24/7 Support: support@cryptofd.com\n\n**Guarantees:**\n- 100% capital return on maturity\n- Daily earnings always withdrawable\n- Transparent transaction history\n\nWe're committed to your financial security!"
  },
  
  // Balance Types
  {
    keywords: ["balance", "available", "locked", "wallet", "fund", "total"],
    response: "Understanding your balance types:\n\n**Available Balance (Green)**\n- Your deposits after confirmation\n- Daily FD earnings\n- Referral commissions\n- Matured FD principal\n- Can withdraw or reinvest anytime\n\n**Locked Balance (Amber)**\n- Currently invested in active FDs\n- Earning daily returns\n- Cannot withdraw until maturity\n- Returns to available after 30 days\n\n**Total Balance**\n= Available + Locked\n\n**Total Earnings**\n- Cumulative earnings from all FDs\n- Shows your total profit to date\n\nCheck your Dashboard for complete balance overview!"
  },
  
  // Reinvest
  {
    keywords: ["reinvest", "compound", "re-invest", "again", "more"],
    response: "Reinvesting is the best way to grow your wealth faster!\n\n**How to Reinvest:**\n1. Go to 'New Investment' page\n2. See your available balance at top\n3. Click 'Use Full Balance' or enter amount\n4. Select your preferred plan\n5. Confirm investment\n\n**What Can You Reinvest:**\n- Daily earnings (available immediately)\n- Referral commissions\n- Matured FD principal\n\n**Compound Growth Example:**\nStart with $1,000 (Gold, 2.75% daily)\n- Month 1: Earn $825, reinvest\n- Month 2: Now $1,825 earning, get $1,505\n- Month 3: Now $3,330 earning, get $2,747\n\nCompounding turns small investments into big returns!"
  },
  
  // Duration & Lock Period
  {
    keywords: ["time", "duration", "period", "long", "days", "lock", "maturity", "when", "30"],
    response: "All FD plans have a 30-day lock period:\n\n**During Investment (30 days):**\n- Daily earnings credited to available balance\n- Daily earnings can be withdrawn anytime\n- Principal amount is locked\n- Earning continues automatically\n\n**After Maturity (Day 30):**\n- Full principal returned to available balance\n- Final day's earnings credited\n- Can withdraw everything\n- Can reinvest for another cycle\n\n**Timeline:**\n- Day 1: Investment starts earning\n- Day 2-29: Daily earnings continue\n- Day 30: Principal + final earnings released\n\n**Pro Tip:** Start new investments regularly to have continuous income flow!"
  },
  
  // Contact & Support
  {
    keywords: ["contact", "support", "help", "email", "reach", "customer", "service", "problem", "issue"],
    response: "We're here to help 24/7!\n\n**Contact Options:**\n- Email: support@cryptofd.com\n- Response: Usually within 24 hours\n- AI Chatbot: Instant answers (that's me!)\n\n**Self-Service:**\n- Dashboard: Account management\n- Transactions: Complete history\n- Settings: Update profile & security\n\n**Office:**\n- Location: London, United Kingdom\n- Team: Stanford University graduates\n\n**Common Issues I Can Help With:**\n- Understanding earnings\n- Deposit/withdrawal process\n- Plan selection\n- Referral program\n- Account security\n\nAsk me anything!"
  },
  
  // Minimum & Maximum
  {
    keywords: ["minimum", "maximum", "limit", "amount", "min", "max", "least", "most"],
    response: "Investment limits by plan:\n\n**Investment Ranges:**\n- Starter: $50 - $499\n- Bronze: $500 - $1,999\n- Silver: $2,000 - $4,999\n- Gold: $5,000 - $9,999\n- Platinum: $10,000 - $49,999\n- Diamond: $50,000 - $500,000\n\n**Deposit:**\n- Minimum: 10 USDT\n- Maximum: No limit\n\n**Withdrawal:**\n- Minimum: 10 USDT\n- Maximum: Your available balance\n- Fee: 1 USDT\n\n**Multiple FDs:**\nYou can have multiple active FDs at once!\nExample: One Gold + One Platinum = More earnings"
  },
  
  // How to Start
  {
    keywords: ["start", "begin", "new", "first", "getting started", "how to", "step"],
    response: "Getting started is easy! Follow these steps:\n\n**Step 1: Sign Up**\n- Create account with email\n- Use referral code for bonuses\n\n**Step 2: Deposit USDT**\n- Go to Wallet page\n- Copy your unique deposit address\n- Send USDT (BEP-20) from any wallet\n- Minimum: $10 USDT\n\n**Step 3: Create Investment**\n- Go to 'New Investment'\n- Select a plan based on your amount\n- Confirm investment\n\n**Step 4: Earn Daily**\n- Earnings credited every 24 hours\n- Check Dashboard for updates\n- Withdraw or reinvest anytime\n\n**Step 5: Refer & Earn More**\n- Share your referral link\n- Earn 10% from direct referrals\n\nStart with as little as $50!"
  },
  
  // Network & Blockchain
  {
    keywords: ["network", "bep20", "bep-20", "bsc", "binance", "blockchain", "chain", "token"],
    response: "CryptoFD operates on BEP-20 (BSC) network:\n\n**Why BEP-20?**\n- Fast transactions (3-5 seconds)\n- Low fees (< $0.10 per transfer)\n- Widely supported by wallets\n- Reliable Binance Smart Chain\n\n**Supported Token:**\n- USDT (Tether) BEP-20 ONLY\n- Contract: 0x55d398326f99059fF775485246999027B3197955\n\n**Compatible Wallets:**\n- Trust Wallet\n- MetaMask\n- Binance\n- TokenPocket\n- SafePal\n\n**Warning:**\nOnly send USDT on BEP-20 network!\nSending ERC-20 or TRC-20 USDT will result in permanent loss."
  },
  
  // Fees
  {
    keywords: ["fee", "fees", "charge", "cost", "deduction"],
    response: "Our fee structure is simple and transparent:\n\n**Deposit Fees:**\n- CryptoFD: FREE\n- Network: ~$0.10 (BSC gas)\n\n**Withdrawal Fees:**\n- CryptoFD: 1 USDT flat fee\n- Network: Included in fee\n\n**Investment Fees:**\n- Creating FD: FREE\n- Daily earnings: No deductions\n\n**Referral Commissions:**\n- No fees on referral earnings\n- 100% credited to your balance\n\n**Summary:**\nOnly 1 USDT withdrawal fee. Everything else is FREE!"
  },
  
  // Account & Profile
  {
    keywords: ["account", "profile", "settings", "password", "email", "change", "update"],
    response: "Managing your account:\n\n**Profile Settings:**\n- Go to Settings page\n- Update name and phone\n- Change withdrawal address\n\n**Security:**\n- Change password anytime\n- Keep email secure\n- Use strong passwords\n\n**Referral Code:**\n- Unique to your account\n- Cannot be changed\n- Share to earn commissions\n\n**Account Verification:**\n- Email verified on signup\n- No KYC required currently\n\n**Need Help?**\nContact support@cryptofd.com for account issues."
  },
  
  // Daily Crediting
  {
    keywords: ["credit", "when", "time", "24 hour", "daily credit", "earning time"],
    response: "Your daily earnings are credited automatically:\n\n**Crediting Schedule:**\n- Every 24 hours from investment time\n- Automatic - no action needed\n- Goes to available balance\n\n**Example:**\nIf you invest at 2:00 PM:\n- First earning: Next day 2:00 PM\n- Second earning: Day after 2:00 PM\n- Continues for 30 days\n\n**Where to Check:**\n- Dashboard: See total earnings\n- Transactions: See each credit\n- My Investments: See per-FD earnings\n\n**Earnings Are:**\n- Withdrawable immediately\n- Can be reinvested\n- Shown in transaction history"
  },
  
  // Multiple FDs
  {
    keywords: ["multiple", "many", "several", "more than one", "two", "different"],
    response: "Yes! You can have multiple active FDs:\n\n**Benefits:**\n- Diversify across plans\n- Different maturity dates\n- Continuous income stream\n\n**Example Strategy:**\nWeek 1: Invest $2,000 (Silver, 2.5%)\nWeek 2: Invest $5,000 (Gold, 2.75%)\nWeek 3: Invest $10,000 (Platinum, 3%)\n\nResult:\n- Week 5: Silver matures, reinvest\n- Week 6: Gold matures, reinvest\n- Continuous rolling income!\n\n**Tracking:**\n- 'My Investments' page shows all FDs\n- Each FD has its own progress\n- Total earnings combined on Dashboard\n\nCreate as many FDs as you want!"
  },

  // What is CryptoFD
  {
    keywords: ["what is", "about", "cryptofd", "company", "platform", "who"],
    response: "CryptoFD is a premium USDT fixed deposit platform:\n\n**What We Offer:**\n- Fixed deposits with guaranteed daily returns\n- 2% to 3.3% daily ROI\n- 30-day investment cycles\n- Instant withdrawals\n- Referral commissions up to 10%\n\n**Our Story:**\n- Founded by Stanford University students\n- Headquartered in London, UK\n- Launched in 2022\n- Serving investors worldwide\n\n**Why Choose Us:**\n- Transparent & verifiable\n- Blockchain-based security\n- 24/7 customer support\n- No hidden fees\n\nStart earning with as little as $50 USDT!"
  },

  // Thank you / Goodbye
  {
    keywords: ["thank", "thanks", "bye", "goodbye", "great", "awesome", "helpful"],
    response: "You're welcome! I'm glad I could help.\n\n**Quick Links:**\n- Dashboard: Check your earnings\n- New Investment: Start earning\n- Wallet: Deposit or withdraw\n- Referral: Share & earn more\n\n**Need More Help?**\n- I'm available 24/7\n- Email: support@cryptofd.com\n\nHappy investing! May your earnings grow daily!"
  }
]

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // Check each knowledge base entry
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response
    }
  }
  
  // Default response
  return "I'm not sure I understand that question. Here are topics I can help with:\n\n**Investment:**\n- How to earn daily returns\n- FD plans (Starter to Diamond)\n- Profit calculations\n\n**Transactions:**\n- Deposits & withdrawals\n- Fees & limits\n\n**Features:**\n- Referral program\n- Security measures\n- Account settings\n\nOr contact our team at support@cryptofd.com for personalized help!"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm CryptoFD Assistant. I can help you understand how to earn, invest, withdraw, and more. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))

    const response = getBotResponse(text)
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: response,
      timestamp: new Date()
    }
    
    setIsTyping(false)
    setMessages(prev => [...prev, botMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl",
          "bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-200",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center animate-pulse">
          <HelpCircle className="h-3 w-3 text-white" />
        </span>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] flex flex-col shadow-2xl border-border/50 overflow-hidden rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">CryptoFD Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs opacity-90">Online 24/7</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-background">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 border-t border-border bg-secondary/30 flex-shrink-0">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 h-7 rounded-full hover:bg-primary/10 hover:border-primary/50"
                  onClick={() => handleSend(action.query)}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-background flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 rounded-full"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              support@cryptofd.com for personalized help
            </p>
          </div>
        </Card>
      )}
    </>
  )
}
