"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Globe, 
  Award,
  CheckCircle,
  Mail,
  MapPin,
  GraduationCap,
  Building2
} from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "10,000+", icon: Users },
    { label: "Total Invested", value: "$5M+", icon: TrendingUp },
    { label: "Countries", value: "50+", icon: Globe },
    { label: "Years Experience", value: "3+", icon: Award },
  ]

  const features = [
    {
      title: "Secure Investments",
      description: "Your funds are protected with industry-leading security measures including cold storage and multi-signature wallets.",
      icon: Shield,
    },
    {
      title: "Daily Returns",
      description: "Earn competitive daily interest on your USDT deposits with our fixed deposit plans ranging from Starter to Diamond tier.",
      icon: TrendingUp,
    },
    {
      title: "Instant Withdrawals",
      description: "Withdraw your earnings anytime to your BEP-20 wallet. No lock-in period for your earned interest.",
      icon: Clock,
    },
    {
      title: "Referral Program",
      description: "Earn up to 10% commission on your referrals' investments through our multi-level referral system.",
      icon: Users,
    },
  ]

  const trustItems = [
    {
      name: "Investment Security",
      description: "All deposits are held in secure cold wallets with multi-signature protection.",
    },
    {
      name: "Transparent Operations",
      description: "All transactions are recorded on the blockchain for complete transparency.",
    },
    {
      name: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist you.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          About <span className="text-primary">CryptoFD</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A leading cryptocurrency fixed deposit platform helping you grow your USDT with competitive daily returns.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card text-center">
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Story */}
      <Card className="border-border/50 bg-card">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 text-muted-foreground">
              <p>
                CryptoFD was founded by a team of passionate students from <span className="text-primary font-semibold">Stanford University</span>, 
                who believed that cryptocurrency investing should be simple, secure, and accessible to everyone.
              </p>
              <p>
                Based in <span className="text-primary font-semibold">London, United Kingdom</span>, we combine cutting-edge 
                blockchain technology with traditional financial principles to create a platform that delivers 
                consistent daily returns on your USDT investments.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">London, UK</p>
                <p className="text-xs text-muted-foreground">Headquarters</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">Stanford</p>
                <p className="text-xs text-muted-foreground">Founded By</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">2022</p>
                <p className="text-xs text-muted-foreground">Established</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">Bank-Grade</p>
                <p className="text-xs text-muted-foreground">Security</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="border-border/50 bg-card hover:border-primary/30 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust */}
      <div className="grid md:grid-cols-3 gap-4">
        {trustItems.map((item, index) => (
          <Card key={index} className="border-border/50 bg-card">
            <CardContent className="pt-6">
              <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need Help? Contact Us</p>
                <a href="mailto:support@cryptofd.com" className="text-lg font-semibold text-primary hover:underline">
                  support@cryptofd.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">London, United Kingdom</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
