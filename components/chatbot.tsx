"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
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
  { label: "How to earn?", icon: <MessageCircle className="w-3 h-3" />, query: "How do I earn money with CryptoFD?" },
  { label: "Calculate profit", icon: <MessageCircle className="w-3 h-3" />, query: "How is my profit calculated?" },
  { label: "Withdrawals", icon: <MessageCircle className="w-3 h-3" />, query: "How do I withdraw my earnings?" },
  { label: "Referrals", icon: <MessageCircle className="w-3 h-3" />, query: "How does the referral program work?" },
  { label: "FD Plans", icon: <MessageCircle className="w-3 h-3" />, query: "What are the different FD plans?" },
  { label: "Is it safe?", icon: <MessageCircle className="w-3 h-3" />, query: "Is my money safe?" },
]

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hello! I'm your CryptoFD AI Assistant. I can help you understand how to invest, earn, withdraw, and more. What would you like to know?",
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
  }, [messages])

  const handleSend = async (userMessage?: string) => {
    const message = (userMessage || input).trim()
    if (!message || isTyping) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to get response")
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content: "Sorry, I couldn't process your request. Please try again or contact support@cryptofd.com.",
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background rounded-2xl shadow-2xl flex flex-col z-50 border border-border">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-sm">CryptoFD Assistant</h3>
            <p className="text-xs opacity-90">AI Powered Support</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2",
              message.type === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.type === "bot" && (
              <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            )}
            <div
              className={cn(
                "px-3 py-2 rounded-lg max-w-xs break-words text-sm",
                message.type === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-secondary text-foreground rounded-bl-none"
              )}
            >
              {message.content.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            {message.type === "user" && (
              <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div className="px-3 py-2 rounded-lg bg-secondary text-foreground rounded-bl-none">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
          <div className="px-4 pb-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs gap-1 h-7 rounded-full"
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

      {/* Input */}
      <div className="p-4 border-t border-border rounded-b-2xl flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          className="text-sm"
          disabled={isTyping}
        />
        <Button
          onClick={() => handleSend()}
          size="icon"
          className="h-9 w-9"
          disabled={!input.trim() || isTyping}
        >
          {isTyping ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
