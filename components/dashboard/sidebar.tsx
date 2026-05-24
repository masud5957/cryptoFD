"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  Wallet,
  ArrowLeftRight,
  Users,
  Gift,
  Settings,
  HelpCircle,
  ExternalLink,
  Info,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Investment", href: "/dashboard/create-fd", icon: PlusCircle },
  { name: "My Investments", href: "/dashboard/my-fds", icon: Layers },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "My Team", href: "/dashboard/team", icon: Users },
  { name: "Referral Program", href: "/dashboard/referral", icon: Gift },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "About Us", href: "/dashboard/about", icon: Info },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
          <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
                {item.name}
                {item.name === "Referral Program" && (
                  <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    EARN
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border p-4 space-y-3">
          {/* Help Card */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Need Help?</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Our support team is available 24/7
            </p>
            <Link 
              href="/dashboard/about" 
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Contact Support
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Version */}
          <p className="text-center text-[10px] text-muted-foreground">
            Version 1.0.0 - Secure Platform
          </p>
        </div>
      </div>
    </aside>
  )
}
