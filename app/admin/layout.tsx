import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdmin } from "@/lib/admin-queries"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const admin = await isAdmin()
  if (!admin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <AdminNavbar />
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
