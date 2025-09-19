"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Issue } from "@/lib/api"
import { Calendar, MessageCircle, User } from "lucide-react"
import Link from "next/link"

interface IssueCardProps {
  issue: Issue
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

export function IssueCard({ issue }: IssueCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (firstName?: string, lastName?: string, username?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return username ? username.slice(0, 2).toUpperCase() : "U"
  }

  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2">
              <Badge className={statusColors[issue.status]}>{issue.status.replace("_", " ")}</Badge>
              <Badge className={priorityColors[issue.priority]}>{issue.priority}</Badge>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(issue.created_at)}</span>
            </div>
          </div>
          <CardTitle className="text-lg text-primary line-clamp-2">{issue.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">{issue.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{issue.reporter.username}</span>
              </div>
              {issue.assignee && (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(issue.assignee.first_name, issue.assignee.last_name, issue.assignee.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{issue.assignee.username}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{issue.comments_count}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
