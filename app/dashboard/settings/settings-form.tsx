"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Camera,
  Mail,
  Phone,
  Lock,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { updateProfile, updatePassword, updateUSDTAddress } from "@/lib/actions"

interface SettingsFormProps {
  email: string
  fullName: string
  phone: string
  avatarUrl: string
  usdtAddress: string
}

export function SettingsForm({ 
  email, 
  fullName, 
  phone, 
  avatarUrl, 
  usdtAddress 
}: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName,
    phone,
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  // USDT address state
  const [usdtAddressState, setUsdtAddressState] = useState(usdtAddress)

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : email.charAt(0).toUpperCase()

  const handleProfileSubmit = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const result = await updateProfile(profileData.fullName, profileData.phone)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess("Profile updated successfully!")
    setIsLoading(false)
    router.refresh()
    setTimeout(() => setSuccess(null), 5000)
  }

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const result = await updatePassword(passwordData.newPassword)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess("Password updated successfully!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setIsLoading(false)
    setTimeout(() => setSuccess(null), 5000)
  }

  const handleUSDTAddressSubmit = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    const result = await updateUSDTAddress(usdtAddressState)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess("Withdrawal address saved successfully!")
    setIsLoading(false)
    router.refresh()
    setTimeout(() => setSuccess(null), 5000)
  }

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="bg-secondary">
        <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-primary">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-primary">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="payment" className="gap-2 data-[state=active]:bg-primary">
          <CreditCard className="h-4 w-4" />
          Payment
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card className="rounded-2xl border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal information
          </p>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} alt={fullName || "User"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium text-foreground">{fullName || "User"}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <Input 
                  value={profileData.fullName} 
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="mt-2 bg-secondary/50" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      value={email} 
                      readOnly 
                      className="bg-secondary/50 pl-10" 
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground">Phone</label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="bg-secondary/50 pl-10" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="mt-6" 
              onClick={handleProfileSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Card>
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <div className="space-y-4">
          <Card className="rounded-2xl border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password regularly</p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">{success}</AlertDescription>
              </Alert>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">New Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter new password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-2 bg-secondary/50" 
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Confirm Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-2 bg-secondary/50" 
                />
              </div>
              <Button 
                onClick={handlePasswordSubmit}
                disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                  <Smartphone className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch />
            </div>
          </Card>
        </div>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card className="rounded-2xl border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose what notifications you want to receive
          </p>

          <div className="mt-6 space-y-4">
            {[
              { title: "FD Maturity Alerts", description: "Get notified when your FD is about to mature" },
              { title: "Interest Credits", description: "Receive notifications when interest is credited" },
              { title: "Referral Earnings", description: "Get notified when you earn referral commission" },
              { title: "Withdrawal Updates", description: "Receive updates on withdrawal status" },
              { title: "Security Alerts", description: "Get notified about account security events" },
              { title: "Promotional Offers", description: "Receive updates about new offers and promotions" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      {/* Payment Tab */}
      <TabsContent value="payment">
        <Card className="rounded-2xl border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Withdrawal Address</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your default withdrawal addresses
          </p>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Default USDT (BEP-20) Address</label>
              <Input 
                placeholder="Enter your BEP-20 (BSC) wallet address (0x...)" 
                value={usdtAddressState}
                onChange={(e) => setUsdtAddressState(e.target.value)}
                className="mt-2 bg-secondary/50 font-mono"
              />
            </div>

            <div className="rounded-xl bg-yellow-500/10 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-yellow-500">Note:</span> Make sure you enter a valid BEP-20 (BSC) address starting with 0x. 
                Withdrawals to incorrect addresses cannot be recovered.
              </p>
            </div>

            <Button 
              onClick={handleUSDTAddressSubmit}
              disabled={isLoading || !usdtAddressState}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
            </Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
