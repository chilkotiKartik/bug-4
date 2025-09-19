"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bug, CheckCircle, MessageCircle, UserPlus, Settings, GitCommit, Clock, Filter } from "lucide-react"
import { useState } from "react"

// Mock activity data
const activities = [
  {
    id: 1,
    type: "issue_created",
    user: { name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    action: "created issue",
    target: "Login form validation not working",
    project: "Web App",
    timestamp: "2 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    type: "issue_resolved",
    user: { name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32" },
    action: "resolved issue",
    target: "Database connection timeout",
    project: "API",
    timestamp: "15 minutes ago",
    priority: "critical",
  },
  {
    id: 3,
    type: "comment_added",
    user: { name: "Carol Davis", avatar: "/placeholder.svg?height=32&width=32" },
    action: "commented on",
    target: "UI layout breaks on mobile",
    project: "Mobile App",
    timestamp: "1 hour ago",
    priority: "medium",
  },
  {
    id: 4,
    type: "member_joined",
    user: { name: "David Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    action: "joined the team",
    target: "",
    project: "",
    timestamp: "2 hours ago",
    priority: "",
  },
  {
    id: 5,
    type: "issue_assigned",
    user: { name: "Eva Brown", avatar: "/placeholder.svg?height=32&width=32" },
    action: "was assigned to",
    target: "Performance optimization needed",
    project: "Web App",
    timestamp: "3 hours ago",
    priority: "low",
  },
  {
    id: 6,
    type: "project_created",
    user: { name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    action: "created project",
    target: "New Dashboard",
    project: "",
    timestamp: "1 day ago",
    priority: "",
  },
]

const activityIcons = {
  issue_created: Bug,
  issue_resolved: CheckCircle,
  comment_added: MessageCircle,
  member_joined: UserPlus,
  issue_assigned: Settings,
  project_created: GitCommit,
}

const activityColors = {
  issue_created: "text-chart-1",
  issue_resolved: "text-chart-3",
  comment_added: "text-chart-2",
  member_joined: "text-chart-4",
  issue_assigned: "text-chart-5",
  project_created: "text-primary",
}

const priorityColors = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-chart-5 text-white",
  medium: "bg-chart-4 text-white",
  low: "bg-chart-1 text-white",
}

export function ActivityFeed() {
  const [filter, setFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all_time")

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    return activity.type === filter
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="issue_created">Issues Created</SelectItem>
                <SelectItem value="issue_resolved">Issues Resolved</SelectItem>
                <SelectItem value="comment_added">Comments</SelectItem>
                <SelectItem value="member_joined">Team Changes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_time">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>Recent actions and updates from your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const Icon = activityIcons[activity.type as keyof typeof activityIcons]
              const iconColor = activityColors[activity.type as keyof typeof activityColors]

              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback className="text-xs">{getInitials(activity.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-background border`}>
                      <Icon className={`h-3 w-3 ${iconColor}`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.target && (
                        <>
                          <span className="font-medium text-primary truncate">{activity.target}</span>
                          {activity.priority && (
                            <Badge
                              className={`text-xs ${priorityColors[activity.priority as keyof typeof priorityColors]}`}
                            >
                              {activity.priority}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                      {activity.project && (
                        <>
                          <span>•</span>
                          <span>{activity.project}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activity found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more activities</p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button variant="outline">Load More Activities</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
