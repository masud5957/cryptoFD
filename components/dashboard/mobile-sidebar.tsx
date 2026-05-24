"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  Wallet,
  ArrowLeftRight,
  Users,
  Gift,
  Settings,
  Hexagon,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create FD", href: "/dashboard/create-fd", icon: PlusCircle },
  { name: "My FDs", href: "/dashboard/my-fds", icon: Layers },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Referral", href: "/dashboard/referral", icon: Gift },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Hexagon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">CryptoFD</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
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
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
