import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Navbar } from "@/components/dashboard/navbar"
import { Chatbot } from "@/components/chatbot"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <Navbar 
          fullName={user.name || null}
          email={user.email || ""}
          avatarUrl={null}
        />
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
