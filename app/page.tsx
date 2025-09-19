"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckCircle, Users, BarChart3, Zap, Shield, Clock, Target, ArrowRight, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: CheckCircle,
    title: "Smart Issue Tracking",
    description: "Advanced bug tracking with AI-powered categorization, priority detection, and automated workflows.",
    color: "text-chart-3",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time collaboration tools with comments, mentions, and seamless team communication.",
    color: "text-chart-1",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards with insights, trends, and performance metrics for data-driven decisions.",
    color: "text-chart-2",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with instant search, real-time updates, and responsive design.",
    color: "text-chart-4",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with SSO, role-based access control, and compliance certifications.",
    color: "text-chart-5",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Continuous monitoring with automated alerts, SLA tracking, and proactive issue detection.",
    color: "text-secondary",
  },
]

const stats = [
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Bugs Resolved", value: "2M+", icon: CheckCircle },
  { label: "Teams", value: "5K+", icon: Target },
  { label: "Uptime", value: "99.9%", icon: TrendingUp },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp",
    content:
      "BugTracker Pro transformed our development workflow. We've reduced bug resolution time by 60% and improved team collaboration significantly.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Michael Rodriguez",
    role: "Lead Developer",
    company: "StartupXYZ",
    content:
      "The analytics dashboard gives us incredible insights into our development process. It's like having a crystal ball for project management.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Johnson",
    role: "QA Director",
    company: "Enterprise Inc",
    content:
      "The real-time notifications and advanced filtering make it easy to stay on top of critical issues. Our team productivity has never been higher.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in-up">
              <Star className="mr-1 h-3 w-3" />
              Trusted by 50,000+ developers worldwide
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl animate-fade-in-up">
              Professional <span className="text-gradient">Bug Tracking</span> Made Simple
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground text-pretty animate-fade-in-up">
              Streamline your development workflow with our comprehensive issue management system. Track bugs, manage
              projects, and collaborate with your team efficiently with AI-powered insights.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 group">
                <Link href="/auth/register">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover-lift bg-transparent">
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground animate-fade-in-up">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-chart-3" />
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-chart-5" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-chart-4" />
                Setup in 2 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="text-center animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Everything you need to manage bugs effectively
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Powerful features designed to streamline your development workflow and boost team productivity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className="hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Loved by development teams worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              See what our customers have to say about their experience with BugTracker Pro.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed mb-4">"{testimonial.content}"</blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl bg-gradient-to-r from-primary to-secondary text-primary-foreground hover-lift">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-balance">Ready to transform your bug tracking?</h2>
              <p className="text-lg mb-8 text-primary-foreground/90 text-pretty">
                Join thousands of development teams who have streamlined their workflow with BugTracker Pro. Start your
                free trial today and experience the difference.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href="/auth/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
