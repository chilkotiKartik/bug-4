"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InviteTeamMemberDialog } from "@/components/team/invite-team-member-dialog"
import { TeamMemberCard } from "@/components/team/team-member-card"
import { ActivityFeed } from "@/components/team/activity-feed"
import { Search, Users, Crown, Shield, User, TrendingUp, CheckCircle, Clock } from "lucide-react"

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    joinedAt: "2023-01-15",
    stats: {
      issuesAssigned: 28,
      issuesResolved: 23,
      avgResolutionTime: "2.1 days",
      efficiency: 82,
    },
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    role: "developer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    joinedAt: "2023-02-20",
    stats: {
      issuesAssigned: 22,
      issuesResolved: 19,
      avgResolutionTime: "1.8 days",
      efficiency: 86,
    },
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@company.com",
    role: "developer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    joinedAt: "2023-03-10",
    stats: {
      issuesAssigned: 35,
      issuesResolved: 31,
      avgResolutionTime: "2.3 days",
      efficiency: 89,
    },
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@company.com",
    role: "qa",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    joinedAt: "2023-04-05",
    stats: {
      issuesAssigned: 21,
      issuesResolved: 17,
      avgResolutionTime: "3.1 days",
      efficiency: 81,
    },
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva@company.com",
    role: "developer",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    joinedAt: "2023-05-12",
    stats: {
      issuesAssigned: 27,
      issuesResolved: 25,
      avgResolutionTime: "1.9 days",
      efficiency: 93,
    },
  },
]

const roleColors = {
  admin: "bg-chart-5 text-white",
  developer: "bg-chart-1 text-white",
  qa: "bg-chart-2 text-white",
  viewer: "bg-chart-4 text-white",
}

const roleIcons = {
  admin: Crown,
  developer: User,
  qa: Shield,
  viewer: User,
}

const statusColors = {
  online: "bg-chart-3",
  away: "bg-chart-4",
  offline: "bg-muted",
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const teamStats = {
    totalMembers: teamMembers.length,
    onlineMembers: teamMembers.filter((m) => m.status === "online").length,
    avgEfficiency: Math.round(teamMembers.reduce((acc, m) => acc + m.stats.efficiency, 0) / teamMembers.length),
    totalIssuesResolved: teamMembers.reduce((acc, m) => acc + m.stats.issuesResolved, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage your team members, roles, and collaboration</p>
          </div>

          <InviteTeamMemberDialog
            onMemberInvited={() => {
              console.log("Member invited, refreshing...")
            }}
          />
        </div>

        {/* Team Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">{teamStats.onlineMembers} currently online</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.avgEfficiency}%</div>
              <p className="text-xs text-muted-foreground">Average across all members</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalIssuesResolved}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
              <Clock className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.2 days</div>
              <p className="text-xs text-muted-foreground">Team average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="qa">QA</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="away">Away</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No team members found</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="mr-2 h-5 w-5 text-chart-5" />
                    Admin
                  </CardTitle>
                  <CardDescription>Full access to all features and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Manage team members</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Delete projects</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Manage billing</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Export data</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-chart-1" />
                    Developer
                  </CardTitle>
                  <CardDescription>Can create, edit, and resolve issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Create issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Edit assigned issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Comment on issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>View analytics</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-chart-2" />
                    QA
                  </CardTitle>
                  <CardDescription>Can test, verify, and close issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Create issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Verify fixes</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Close issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>View reports</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-chart-4" />
                    Viewer
                  </CardTitle>
                  <CardDescription>Read-only access to issues and reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>View issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>View reports</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Comment on issues</span>
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Export data</span>
                    <span className="text-muted-foreground">×</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
