import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getProfile } from "@/lib/queries"
import { SettingsForm } from "./settings-form"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Lock } from "lucide-react"

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Account
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Settings Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {settingsSections.map((section, index) => (
          <Card key={index} className="rounded-xl border-border bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Account Info Card */}
      <Card className="rounded-2xl border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{profile?.name || "User"}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {profile?.isVerified ? "Verified Account" : "Unverified"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Settings Form */}
      <SettingsForm 
        email={user.email || ""}
        fullName={profile?.name || ""}
        phone={profile?.phone || ""}
        avatarUrl={""}
        usdtAddress={profile?.usdtAddress || ""}
      />
    </div>
  )
}
