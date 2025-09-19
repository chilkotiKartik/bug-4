"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/layout/navbar"
import { CommentSection } from "@/components/issues/comment-section"
import { IssueStatusUpdater } from "@/components/issues/issue-status-updater"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { api, type Issue, type Comment, type User } from "@/lib/api"
import { ArrowLeft, Calendar, UserIcon, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function IssueDetailPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [issue, setIssue] = useState<(Issue & { comments: Comment[] }) | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const params = useParams()
  const issueId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && issueId) {
      loadIssue()
      loadUsers()
    }
  }, [isAuthenticated, issueId])

  const loadIssue = async () => {
    try {
      setIsLoading(true)
      const issueData = await api.getIssue(issueId)
      setIssue(issueData)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issue")
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await api.getUsers()
      setUsers(response.results)
    } catch (err) {
      console.error("Failed to load users:", err)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!issue) return

    await api.createComment(issue.id, content)
    await loadIssue() // Reload to get updated comments
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return username ? username.slice(0, 2).toUpperCase() : "U"
  }

  const statusColors = {
    open: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    closed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    critical: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }

  const canEditIssue =
    user && issue && (user.id === issue.reporter.id || (issue.assignee && user.id === issue.assignee.id))

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{error || "Issue not found"}</h3>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href={`/projects/${issue.project}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Issue Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={statusColors[issue.status]}>{issue.status.replace("_", " ")}</Badge>
                <Badge className={priorityColors[issue.priority]}>{issue.priority}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-primary mb-4 text-balance">{issue.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {formatDate(issue.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Reported by {issue.reporter.username}</span>
                </div>
                {issue.assignee && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(issue.assignee.first_name, issue.assignee.last_name, issue.assignee.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span>Assigned to {issue.assignee.username}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Issue Status Updater */}
            <div className="lg:w-80">
              <IssueStatusUpdater issue={issue} users={users} onUpdate={loadIssue} canEdit={!!canEditIssue} />
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{issue.description}</p>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <CommentSection comments={issue.comments} onAddComment={handleAddComment} />
      </main>
    </div>
  )
}
