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
  Zap,
  Lock,
  TrendingDown,
  Repeat,
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
  { label: "Getting started", icon: <Zap className="w-3 h-3" />, query: "I'm new, how do I get started?" },
  { label: "Password reset", icon: <Lock className="w-3 h-3" />, query: "How do I reset my password?" },
  { label: "Account security", icon: <Shield className="w-3 h-3" />, query: "How do I secure my account?" },
  { label: "Contact support", icon: <HelpCircle className="w-3 h-3" />, query: "How can I contact support?" },
  { label: "Transaction help", icon: <TrendingDown className="w-3 h-3" />, query: "I have a transaction issue" },
  { label: "Multiple FDs", icon: <Repeat className="w-3 h-3" />, query: "Can I have multiple FD investments?" },
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
    response: "Withdrawing your earnings is simple and fast!\n\n**What You Can Withdraw:**\n- Daily FD earnings (available immediately)\n- Referral commissions\n- Matured FD principal (after 30 days)\n\n**How to Withdraw:**\n1. Go to Wallet page\n2. Click 'Withdraw' tab\n3. Enter your BEP-20 wallet address\n4. Enter amount (min 10 USDT)\n5. Click 'Request Withdrawal'\n\n**Processing:**\n- Time: Usually within 1 hour\n- Network: BEP-20 (BSC)\n- Platform Fee: 3% of withdraw amount\n\n**Fee Example:**\nWithdraw $1000 USDT:\n- Platform Fee (3%): $30 USDT\n- You receive: $970 USDT\n\n**Note:** Your locked FD principal returns to available balance after the 30-day period ends."
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
    response: "Investment limits by plan:\n\n**Investment Ranges:**\n- Starter: $50 - $499\n- Bronze: $500 - $1,999\n- Silver: $2,000 - $4,999\n- Gold: $5,000 - $9,999\n- Platinum: $10,000 - $49,999\n- Diamond: $50,000 - $500,000\n\n**Deposit:**\n- Minimum: 10 USDT\n- Maximum: No limit\n\n**Withdrawal:**\n- Minimum: 10 USDT\n- Maximum: Your available balance\n- Fee: 3% of withdraw amount\n\n**Multiple FDs:**\nYou can have multiple active FDs at once!\nExample: One Gold + One Platinum = More earnings"
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
    response: "Our fee structure is simple and transparent:\n\n**Deposit Fees:**\n- CryptoFD: FREE\n- Network: ~$0.10 (BSC gas)\n\n**Withdrawal Fees:**\n- Platform Fee: 3% of withdraw amount\n- Network: Included in fee\n\n**Fee Examples:**\n- Withdraw $100: Pay $3 fee, receive $97\n- Withdraw $1000: Pay $30 fee, receive $970\n- Withdraw $10,000: Pay $300 fee, receive $9,700\n\n**Investment Fees:**\n- Creating FD: FREE\n- Daily earnings: No deductions\n\n**Referral Commissions:**\n- No fees on referral earnings\n- 100% credited to your balance\n\n**Summary:**\nOnly 3% withdrawal fee. Everything else is FREE!"
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
  },

  // Tax & Compliance
  {
    keywords: ["tax", "taxes", "report", "compliance", "legal", "government", "regulation"],
    response: "Important information about taxes:\n\n**Your Responsibility:**\n- Track all earnings for tax purposes\n- Earnings are taxable income\n- Consult a tax professional in your country\n- Requirements vary by jurisdiction\n\n**What We Provide:**\n- Detailed transaction history\n- Downloadable reports\n- All earnings tracked\n- Export capability for tax filing\n\n**Recommendation:**\n- Keep records of all investments\n- Document daily earnings\n- Report to local tax authorities\n- Consult a tax advisor\n\nWe are compliant with regulations in our jurisdictions."
  },

  // Risk & Disclaimer
  {
    keywords: ["risk", "disclaimer", "warning", "caution", "loss", "liable"],
    response: "**Important Risk Disclosure:**\n\nWhile CryptoFD operates transparently with blockchain verification:\n\n**Risks to Consider:**\n- Crypto market volatility\n- Platform operational risks\n- Network security\n- Regulatory changes\n\n**Our Guarantees:**\n- 100% capital return on maturity\n- Daily earnings withdrawable\n- Transparent on-chain transactions\n- Secure cold storage\n\n**Best Practices:**\n- Never invest more than you can afford\n- Diversify investments\n- Use secure wallet\n- Keep passwords private\n\n**Legal:**\nThis is not financial advice. Always do your own research and consult professionals before investing."
  },

  // Verification & KYC
  {
    keywords: ["verify", "kyc", "verification", "identify", "documents", "proof"],
    response: "Account verification at CryptoFD:\n\n**Current Status:**\n- Email verification required on signup\n- Simple and instant process\n\n**In the Future:**\n- We may implement KYC for higher withdrawals\n- You'll receive advance notice\n- Takes 15-30 minutes typically\n- Required for regulatory compliance\n\n**What You May Need:**\n- Government ID\n- Proof of address\n- Selfie verification\n\n**Privacy:**\n- Data securely stored\n- Never shared with third parties\n- GDPR compliant\n\nStay tuned for announcements on enhanced verification!"
  },

  // API & Developers
  {
    keywords: ["api", "developer", "development", "integration", "technical", "build"],
    response: "Developer information:\n\n**Current Status:**\n- API documentation coming soon\n- Web platform fully functional\n- Mobile app in development\n\n**For Developers:**\n- RESTful API planned\n- Webhook integration support\n- Comprehensive documentation\n- Sandbox environment\n\n**Contact:**\n- Developer inquiries: dev@cryptofd.com\n- Join developer community\n- Beta testing opportunities\n\n**Roadmap:**\n- API Q2 2025\n- Mobile app Q1 2025\n- Additional features quarterly\n\nInterested in integrating? Contact our developer team!"
  },

  // Rewards & Promotions
  {
    keywords: ["reward", "bonus", "promotion", "offer", "discount", "campaign"],
    response: "Special rewards and promotions:\n\n**Current Promotions:**\n- Referral bonuses (up to 10%)\n- Multiple FD benefits (compound growth)\n- Early bird advantages\n\n**Seasonal Campaigns:**\n- Keep checking Dashboard\n- Email notifications for new offers\n- Limited-time bonuses\n\n**Loyalty Rewards:**\n- Higher ROI for repeat investors\n- VIP status for large investments\n- Exclusive opportunities\n\n**How to Stay Updated:**\n- Check Notifications in Dashboard\n- Enable email alerts\n- Follow our social media\n- Join community discussions\n\nNew promotions added regularly! Subscribe for updates."
  },

  // Performance History
  {
    keywords: ["history", "past", "performance", "track record", "record", "statistics", "stats"],
    response: "Track record and platform statistics:\n\n**Platform Stats:**\n- Founded: 2022\n- Investors: Global community\n- Total Investments: Millions in USDT\n- Success Rate: 99.9%\n\n**Your Investment History:**\n- View in 'My Investments' page\n- Complete transaction history\n- Earnings breakdown by FD\n- Download for records\n\n**Performance Metrics:**\n- Dashboard shows all-time stats\n- Monthly earnings summary\n- ROI visualization\n- Growth trends\n\n**Reports:**\n- Generate custom reports\n- Export to CSV/PDF\n- Share performance with advisors\n\nAll data is transparent and verifiable on-chain!"
  },

  // Emergency & Technical Issues
  {
    keywords: ["emergency", "problem", "bug", "error", "not working", "issue", "technical", "broken"],
    response: "Technical issues and urgent help:\n\n**Immediate Problems:**\n1. Check system status page\n2. Clear browser cache\n3. Try different browser\n4. Restart application\n\n**Common Issues:**\n- **Can't log in:** Check caps lock, reset password\n- **Deposit not showing:** Wait 5-10 minutes, refresh\n- **Withdrawal failed:** Verify wallet address format\n- **Slow loading:** Check internet connection\n\n**Get Help:**\n- Email: support@cryptofd.com\n- Subject: Urgent - [Your Issue]\n- Include: Email, timestamp, screenshot\n- Response: Within 1 hour\n\n**Emergency Line:**\n- Critical issues: emergency@cryptofd.com\n- 24/7 response\n\nWe prioritize all technical issues!"
  },

  // Privacy & Data
  {
    keywords: ["privacy", "data", "personal information", "gdpr", "policy", "cookie"],
    response: "Your privacy and data protection:\n\n**Privacy Policy:**\n- We never sell your data\n- Encrypted transmission (SSL)\n- Secure storage\n- GDPR compliant\n\n**What We Collect:**\n- Account information\n- Transaction history\n- Device information (for security)\n\n**What We Don't Collect:**\n- Third-party data\n- Unnecessary personal details\n- Cookie tracking\n\n**Your Rights:**\n- Access your data anytime\n- Request data export\n- Delete account and data\n- Change privacy settings\n\n**Contact:**\nPrivacy questions: privacy@cryptofd.com\n\nRead full policy on Settings page!"
  },

  // Investment Strategy
  {
    keywords: ["strategy", "suggest", "advice", "best", "optimal", "recommend", "should"],
    response: "Investment strategies to consider:\n\n**Conservative Approach:**\n- Start with Starter/Bronze plans\n- $50-$500 per FD\n- Test platform first\n- Build up gradually\n\n**Balanced Approach:**\n- Mix of Silver & Gold plans\n- $2,000-$10,000 per FD\n- Stagger investment dates\n- Reinvest earnings\n\n**Aggressive Approach:**\n- Platinum/Diamond plans\n- $10,000+ per FD\n- Multiple active FDs\n- Maximize compounding\n\n**Recommended For Most:**\n- Reinvest daily earnings\n- Create new FD weekly\n- Rolling maturity schedule\n- Continuous income stream\n\n**Important:**\nThis is not financial advice. Choose strategy matching your risk tolerance."
  },

  // Comparisons & Alternatives
  {
    keywords: ["compare", "better than", "versus", "alternative", "competitor", "similar"],
    response: "Why CryptoFD stands out:\n\n**Our Advantages:**\n- Guaranteed daily returns (2%-3.3%)\n- Quick withdrawals (1 hour)\n- Low fees (3% withdrawal)\n- No lock-in period for earnings\n- Blockchain verified\n- Flexible re-investment\n\n**vs. Traditional Banks:**\n- Banks: 0.5%-2% yearly\n- CryptoFD: 2%-3.3% daily!\n- Returns compound faster\n- Complete control\n\n**vs. Stock Market:**\n- Stocks: Volatile & unpredictable\n- CryptoFD: Stable & predictable\n- Daily income vs. quarterly\n- No market research needed\n\n**Why Choose Us:**\n- Transparency\n- Security\n- Community\n- Support\n\nJoin thousands of successful investors!"
  },

  // Getting Started - Detailed
  {
    keywords: ["beginner", "new user", "first time", "never invested", "explain", "simple"],
    response: "Complete beginner's guide:\n\n**Phase 1: Setup (5 minutes)**\n1. Create account with email\n2. Choose strong password\n3. Optional: Enter referral code\n\n**Phase 2: Fund Account (10 minutes)**\n1. Get USDT on Binance/Coinbase\n2. Go to your deposit address\n3. Send minimum $10 USDT (BEP-20)\n4. Wait 2-5 minutes for confirmation\n\n**Phase 3: First Investment (2 minutes)**\n1. Go to 'New Investment'\n2. See auto-selected plan\n3. Click Invest\n4. Start earning!\n\n**Phase 4: Monitor & Earn (Daily)**\n1. Check Dashboard each day\n2. See new earnings\n3. Withdraw or reinvest\n\n**Pro Tips:**\n- Start small ($50)\n- Reinvest to grow faster\n- Share referral link\n- Create new FDs weekly\n\nEverything takes less than 1 hour!"
  },

  // Wallets & Addresses
  {
    keywords: ["wallet", "address", "metamask", "trust wallet", "binance", "private key"],
    response: "Wallet and address information:\n\n**Your CryptoFD Wallet:**\n- Unique BEP-20 address\n- For deposits only\n- On your Wallet page\n- Never share or change\n\n**Supported External Wallets:**\n- Trust Wallet (recommended)\n- MetaMask\n- Binance\n- TokenPocket\n- SafePal\n- Hardware wallets (Ledger, Trezor)\n\n**For Withdrawals:**\n1. Use any BEP-20 wallet\n2. Enter wallet address\n3. Minimum $10 USDT\n4. Receives in 1 hour\n\n**Security Tips:**\n- Never share private keys\n- Use official apps only\n- Enable 2FA on wallets\n- Backup seed phrases\n\n**Support:**\nChoosing a wallet? Check our guide or email support!"
  },

  // Password Reset
  {
    keywords: ["password", "reset", "forgot", "change", "forgotten", "locked out", "cannot login"],
    response: "Password reset and account access:\n\n**Forgot Your Password:**\n1. Click 'Forgot Password?' on login page\n2. Enter your email address\n3. Check your email for reset link\n4. Click link and set new password\n5. Password must be 8+ characters\n6. Recommended: Use uppercase, numbers, symbols\n\n**Password Requirements:**\n✓ At least 8 characters\n✓ One uppercase letter\n✓ One lowercase letter\n✓ One number\n✓ One special character (@, #, $, etc)\n\n**Still Can't Reset?**\n- Check spam/junk folder\n- Resend reset email\n- Wait 5-10 minutes\n- Try different browser\n- Contact support: support@cryptofd.com\n\n**Security Reminder:**\n- Never share your password\n- Unique password for each account\n- Change password quarterly\n- Report suspicious activity immediately"
  },

  // Account Security
  {
    keywords: ["secure", "security", "protect", "hack", "unsafe", "compromised", "2fa", "two factor"],
    response: "Protecting your account - security best practices:\n\n**Account Protection:**\n1. Strong, unique password\n2. Don't share credentials\n3. Log out after each session\n4. Use secure wifi only\n5. Clear browser cache regularly\n\n**Security Features:**\n- Email verification on signup\n- Session timeout (30 minutes)\n- Login notifications\n- IP address tracking\n- Activity logs\n\n**Two-Factor Authentication (Coming Soon):**\n- 2FA via authenticator app\n- Adds extra login security\n- Backup codes provided\n- Enable immediately when available\n\n**If You Suspect Breach:**\n1. Change password immediately\n2. Email: security@cryptofd.com\n3. Do NOT withdraw\n4. Wait for team confirmation\n5. We'll freeze account to protect you\n\n**Device Security:**\n- Use updated OS\n- Enable device lock\n- Install antivirus\n- Don't use public wifi for transfers\n\nYour security is our priority!"
  },

  // Support Channels
  {
    keywords: ["support", "contact", "help", "call", "email", "phone", "reach out", "customer service"],
    response: "Getting in touch with our support team:\n\n**Email Support:**\n- General: support@cryptofd.com\n- Urgent: emergency@cryptofd.com\n- Billing: billing@cryptofd.com\n- Security: security@cryptofd.com\n- Response time: 1-2 hours\n\n**Response Times:**\n- Priority: 30 minutes\n- Standard: 1-2 hours\n- Non-urgent: 24 hours\n\n**What to Include:**\n- Your email address\n- Transaction ID (if applicable)\n- Screenshots\n- Detailed description\n- What you've already tried\n\n**Support Availability:**\n- Live chat: 24/7 (you're using it!)\n- Email: 24/7\n- Phone: Coming soon\n- Support page: support.cryptofd.com\n\n**Community Help:**\n- Discord community\n- Telegram group\n- FAQ section\n- Knowledge base\n\n**Average Resolution:**\n- Account issues: 1 hour\n- Transaction issues: 2-3 hours\n- Verification: 24 hours\n\nOur team is always ready to help!"
  },

  // Transaction Issues
  {
    keywords: ["transaction", "pending", "failed", "stuck", "error", "deposit not showing", "withdrawal failed"],
    response: "Troubleshooting transaction issues:\n\n**Deposit Not Showing:**\n1. Wait 5-10 minutes (blockchain confirms)\n2. Check transaction on BSCscan.com\n3. Verify you sent to correct address\n4. Confirm amount meets minimum ($10)\n5. Check wallet balance decreased\n\n**If Still Missing (after 30 min):**\n- Email: support@cryptofd.com\n- Include: Transaction hash (TXID)\n- We'll track it on blockchain\n- Typically resolved within 2 hours\n\n**Withdrawal Failed:**\n1. Check wallet address format\n2. Ensure BEP-20 network selected\n3. Verify sufficient balance\n4. Check minimum ($10)\n5. Retry after 5 minutes\n\n**Common Issues:**\n- Wrong network: Use BEP-20 (BSC)\n- Low balance: Need $10+ to withdraw\n- Address error: Typo in wallet address\n- Gas fees: Included in 3% fee\n\n**Status Tracking:**\n- View in Wallet > Transactions\n- Click transaction for details\n- See blockchain confirmation\n- Real-time status updates\n\n**Immediate Help:**\n- Email with transaction hash\n- Include screenshot\n- Describe issue clearly\n- We'll resolve ASAP!"
  },

  // Multiple FDs
  {
    keywords: ["multiple", "many", "several", "more than one", "two investments", "concurrent"],
    response: "Yes! You can create multiple FD investments:\n\n**Multiple FD Benefits:**\n- No limit on quantity\n- Run simultaneously\n- Independent earnings\n- Flexible maturity dates\n- Stagger investments\n\n**Recommended Strategy:**\n- Create 1 FD per week\n- Different plans for variety\n- Rolling maturity schedule\n- Continuous income stream\n\n**Example Portfolio:**\nWeek 1: $1,000 Gold plan\nWeek 2: $500 Silver plan\nWeek 3: $2,000 Platinum plan\nWeek 4: $1,000 Gold plan\n\n**Results:**\n- 4 active investments\n- $4,500 invested\n- Staggered returns\n- New maturity every week\n- Compound growth potential\n\n**Managing Multiple FDs:**\n- Dashboard shows all active FDs\n- Each has independent counter\n- Individual earnings tracked\n- Withdraw from any FD\n- Create new anytime\n\n**Earning Example:**\n4 x Gold ($1,000 each) = $4,000 invested\n- Daily total: $110 (2.75% x $4,000)\n- Monthly: $3,300\n- After 30 days maturity: $7,300\n\nMultiple FDs = Faster wealth growth!"
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
