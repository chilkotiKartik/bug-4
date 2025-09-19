import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/hooks/use-auth"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BugTracker Pro - Professional Issue Management",
  description:
    "Comprehensive bug reporting and tracking system for development teams. Streamline your workflow with AI-powered insights, real-time collaboration, and advanced analytics.",
  generator: "v0.app",
  keywords: ["bug tracking", "issue management", "development tools", "team collaboration", "project management"],
  authors: [{ name: "BugTracker Pro Team" }],
  creator: "BugTracker Pro",
  publisher: "BugTracker Pro",
  openGraph: {
    title: "BugTracker Pro - Professional Issue Management",
    description: "Streamline your development workflow with comprehensive bug tracking and team collaboration tools.",
    type: "website",
    locale: "en_US",
    siteName: "BugTracker Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "BugTracker Pro - Professional Issue Management",
    description: "Streamline your development workflow with comprehensive bug tracking and team collaboration tools.",
    creator: "@bugtrackerPro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
