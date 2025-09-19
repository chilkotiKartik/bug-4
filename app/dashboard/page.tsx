"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/layout/header"
import { ProjectCard } from "@/components/dashboard/project-card"
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api, type Project } from "@/lib/api"
import { Search, FolderOpen, Loader2, Bug, CheckCircle, Clock, AlertTriangle, TrendingUp, Users } from "lucide-react"

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  // Mock stats data - in real app this would come from API
  const stats = {
    totalIssues: 247,
    openIssues: 45,
    inProgress: 23,
    resolved: 179,
    criticalIssues: 8,
    teamMembers: 12,
    activeProjects: projects.length,
    avgResolutionTime: "2.3 days",
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Filter projects based on search query
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredProjects(filtered)
  }, [projects, searchQuery])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await api.getProjects()
      setProjects(response.results)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {user?.first_name || user?.username}!</h1>
          <p className="text-muted-foreground">Here's an overview of your bug tracking activity and projects.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Bug className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIssues}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openIssues}</div>
              <p className="text-xs text-muted-foreground">{stats.criticalIssues} critical priority</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Avg resolution: {stats.avgResolutionTime}</p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">94% resolution rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover-lift cursor-pointer" onClick={() => router.push("/reports")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bug className="mr-2 h-5 w-5 text-primary" />
                View All Issues
              </CardTitle>
              <CardDescription>Browse and manage all reported bugs across your projects</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => router.push("/analytics")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>View detailed insights and performance metrics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-lift cursor-pointer" onClick={() => router.push("/team")}>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Team Management
              </CardTitle>
              <CardDescription>Manage team members and their assignments</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Your Projects</h2>
              <p className="text-muted-foreground">Manage your projects and track issues efficiently.</p>
            </div>
            <CreateProjectDialog onProjectCreated={loadProjects} />
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input"
            />
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadProjects} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search terms" : "Create your first project to start tracking issues"}
              </p>
              {!searchQuery && <CreateProjectDialog onProjectCreated={loadProjects} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
