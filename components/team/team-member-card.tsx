"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Shield, User, MoreVertical, Mail, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  status: string
  joinedAt: string
  stats: {
    issuesAssigned: number
    issuesResolved: number
    avgResolutionTime: string
    efficiency: number
  }
}

interface TeamMemberCardProps {
  member: TeamMember
}

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

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const RoleIcon = roleIcons[member.role as keyof typeof roleIcons]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleAction = async (action: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`${action} for member:`, member.id)
    setIsLoading(false)
  }

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${statusColors[member.status as keyof typeof statusColors]}`}
                title={member.status}
              />
            </div>
            <div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Mail className="mr-1 h-3 w-3" />
                {member.email}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction("view_profile")}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send_message")}>Send Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction("change_role")}>Change Role</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("remove_member")} className="text-destructive">
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={roleColors[member.role as keyof typeof roleColors]}>
            <RoleIcon className="mr-1 h-3 w-3" />
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Calendar className="mr-1 h-3 w-3" />
            Joined {formatDate(member.joinedAt)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Assigned</span>
            <span className="font-medium">{member.stats.issuesAssigned}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Resolved</span>
            <span className="font-medium flex items-center">
              <CheckCircle className="mr-1 h-3 w-3 text-chart-3" />
              {member.stats.issuesResolved}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Avg Time</span>
            <span className="font-medium flex items-center">
              <Clock className="mr-1 h-3 w-3 text-chart-4" />
              {member.stats.avgResolutionTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Efficiency</span>
            <span className="font-medium flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-chart-3" />
              {member.stats.efficiency}%
            </span>
          </div>
        </div>

        {/* Efficiency Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Performance</span>
            <span className="font-medium">{member.stats.efficiency}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${member.stats.efficiency}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
