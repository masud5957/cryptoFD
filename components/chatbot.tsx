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
  DollarSign,
  Zap,
  Lock,
  TrendingDown,
  Repeat,
  ChevronUp,
  ChevronDown,
  Loader2,
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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm CryptoFD AI Assistant. I'm powered by advanced AI to answer all your questions about investing, earning, and managing your account. What would you like to know?",
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

    try {
      // Call AI API for intelligent response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error response:", errorData)
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (!data.response) {
        throw new Error("No response content from API")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content: "Sorry, I couldn't process your request at the moment. Please try again or contact support@cryptofd.com for assistance.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        )}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 max-h-[600px] shadow-2xl rounded-lg overflow-hidden flex flex-col z-50 border-primary/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="font-semibold">CryptoFD Assistant</p>
                <p className="text-xs opacity-90">Powered by AI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.type === "bot" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap text-sm",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  )}
                >
                  {message.content}
                </div>
                {message.type === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                </div>
                <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2 mb-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                size="sm"
                disabled={!input.trim() || isTyping}
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions - Collapsible */}
          <div className="border-t border-border bg-secondary/30 flex-shrink-0">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <p className="text-xs font-medium text-muted-foreground">Quick questions ({quickActions.length})</p>
              {showQuickActions ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {showQuickActions && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5 h-7 rounded-full hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => handleSend(action.query)}
                    disabled={isTyping}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  )
}
