"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import { Bug, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-center mb-6">
            <Button asChild variant="ghost" size="sm" className="absolute left-0 hover:bg-primary/10">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Bug className="h-8 w-8 text-primary" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                BugTracker
              </span>
            </Link>
          </div>
        </div>

        <LoginForm />

        <div className="text-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium">
              <Link href="/auth/register">Sign up for free</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
