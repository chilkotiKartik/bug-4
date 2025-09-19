"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IssueCard } from "@/components/issues/issue-card"
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog"
import { BulkActionsToolbar } from "@/components/issues/bulk-actions-toolbar"
import { AdvancedFilters } from "@/components/issues/advanced-filters"
import { Search, Filter, Grid, List, Download, Bug, CheckCircle, Clock, AlertTriangle } from "lucide-react"

// Mock data - in real app this would come from API
const mockIssues = [
  {
    id: 1,
    title: "Login form validation not working",
    description: "Users can submit empty forms without validation errors",
    status: "open" as const,
    priority: "high" as const,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    reporter: { id: 1, username: "john_doe", first_name: "John", last_name: "Doe" },
    assignee: { id: 2, username: "jane_smith", first_name: "Jane", last_name: "Smith" },
    comments_count: 3,
    project: { id: 1, name: "Web App" },
  },
  {
    id: 2,
    title: "Database connection timeout",
    description: "Application crashes when database takes too long to respond",
    status: "in_progress" as const,
    priority: "critical" as const,
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-16T09:15:00Z",
    reporter: { id: 3, username: "bob_wilson", first_name: "Bob", last_name: "Wilson" },
    assignee: { id: 1, username: "john_doe", first_name: "John", last_name: "Doe" },
    comments_count: 7,
    project: { id: 1, name: "Web App" },
  },
  {
    id: 3,
    title: "UI layout breaks on mobile",
    description: "Responsive design issues on screens smaller than 768px",
    status: "closed" as const,
    priority: "medium" as const,
    created_at: "2024-01-10T16:45:00Z",
    updated_at: "2024-01-18T11:30:00Z",
    reporter: { id: 2, username: "jane_smith", first_name: "Jane", last_name: "Smith" },
    assignee: { id: 3, username: "bob_wilson", first_name: "Bob", last_name: "Wilson" },
    comments_count: 2,
    project: { id: 2, name: "Mobile App" },
  },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
]

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const sortOptions = [
  { value: "created_desc", label: "Newest First" },
  { value: "created_asc", label: "Oldest First" },
  { value: "updated_desc", label: "Recently Updated" },
  { value: "priority_desc", label: "High Priority First" },
  { value: "title_asc", label: "Title A-Z" },
]

export default function ReportsPage() {
  const [issues, setIssues] = useState(mockIssues)
  const [filteredIssues, setFilteredIssues] = useState(mockIssues)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_desc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedIssues, setSelectedIssues] = useState<number[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filter and sort issues
  useEffect(() => {
    let filtered = [...issues]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "created_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "updated_desc":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "priority_desc":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "title_asc":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredIssues(filtered)
  }, [issues, searchQuery, statusFilter, priorityFilter, sortBy])

  const handleBulkAction = (action: string, issueIds: number[]) => {
    console.log(`Bulk action: ${action} on issues:`, issueIds)
    // Implement bulk actions here
    setSelectedIssues([])
  }

  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in_progress").length,
    closed: issues.filter((i) => i.status === "closed").length,
    critical: issues.filter((i) => i.priority === "critical").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bug Reports</h1>
            <p className="text-muted-foreground">Manage and track all reported issues across your projects</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <CreateIssueDialog
              projectId={1}
              onIssueCreated={() => {
                // Refresh issues
                console.log("Issue created, refreshing...")
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Bug className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertTriangle className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closed}</div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.critical}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              {/* Primary Filters */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>

                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <AdvancedFilters
                  onFiltersChange={(filters) => {
                    console.log("Advanced filters:", filters)
                    // Apply advanced filters
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIssues.length > 0 && (
          <BulkActionsToolbar
            selectedCount={selectedIssues.length}
            onAction={handleBulkAction}
            selectedIssues={selectedIssues}
          />
        )}

        {/* Issues List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredIssues.length} of {issues.length} issues
            </p>
          </div>

          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bug className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No issues found</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No issues have been reported yet"}
                </p>
                {!searchQuery && statusFilter === "all" && priorityFilter === "all" && (
                  <CreateIssueDialog
                    projectId={1}
                    onIssueCreated={() => {
                      console.log("Issue created, refreshing...")
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="relative">
                  <input
                    type="checkbox"
                    className="absolute top-4 left-4 z-10"
                    checked={selectedIssues.includes(issue.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIssues([...selectedIssues, issue.id])
                      } else {
                        setSelectedIssues(selectedIssues.filter((id) => id !== issue.id))
                      }
                    }}
                  />
                  <div className="pl-8">
                    <IssueCard issue={issue} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
