import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getProfile } from "@/lib/queries"
import { SettingsForm } from "./settings-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Lock, Check, Calendar } from "lucide-react"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const profile = await getProfile()

  const settingsSections = [
    { icon: User, label: "Profile", description: "Manage your personal information", color: "text-primary bg-primary/10" },
    { icon: Shield, label: "Security", description: "Password and authentication", color: "text-green-500 bg-green-500/10" },
    { icon: Bell, label: "Notifications", description: "Email and push preferences", color: "text-blue-500 bg-blue-500/10" },
    { icon: Lock, label: "Privacy", description: "Data and account controls", color: "text-amber-500 bg-amber-500/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 border border-primary/20 p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 border">
              Account
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {settingsSections.map((section, index) => (
          <Card key={index} className="rounded-xl border-border bg-card/50 hover:bg-card hover:border-primary/50 hover:shadow-lg transition-all p-4">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.color} flex-shrink-0`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Account Info Card - Premium */}
      <Card className="rounded-2xl border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white flex-shrink-0 shadow-lg">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </div>
            
            {/* Account Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">{profile?.name || "User"}</h3>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs gap-1 border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10">
                  <Check className="h-3 w-3" />
                  {profile?.isVerified ? "Verified Account" : "Pending Verification"}
                </Badge>
                <Badge variant="outline" className="text-xs gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10">
                  <Calendar className="h-3 w-3" />
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : "N/A"}
                </Badge>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Settings Form */}
      <SettingsForm 
        email={user.email || ""}
        fullName={profile?.name || ""}
        phone={profile?.phone || ""}
        avatarUrl={(profile as any)?.profilePhoto || ""}
        usdtAddress={profile?.usdtAddress || ""}
      />
    </div>
  )
}
