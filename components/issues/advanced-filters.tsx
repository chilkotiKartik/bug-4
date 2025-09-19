"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function AdvancedFilters({ onFiltersChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    assignee: "any_assignee",
    reporter: "any_reporter",
    project: "any_project",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    tags: [] as string[],
    hasComments: "any_comments",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)

    // Update active filters list
    const active = Object.entries(newFilters)
      .filter(([k, v]) => {
        if (Array.isArray(v)) return v.length > 0
        return v !== "" && v !== null
      })
      .map(([k]) => k)
    setActiveFilters(active)
  }

  const clearFilter = (key: string) => {
    const value = Array.isArray(filters[key as keyof typeof filters]) ? [] : ""
    updateFilter(key, value)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      assignee: "any_assignee",
      reporter: "any_reporter",
      project: "any_project",
      dateFrom: null,
      dateTo: null,
      tags: [],
      hasComments: "any_comments",
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFiltersChange(clearedFilters)
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Active filters:</span>
              {activeFilters.map((filterKey) => (
                <Badge key={filterKey} variant="secondary" className="gap-1">
                  {filterKey.replace(/([A-Z])/g, " $1").toLowerCase()}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => clearFilter(filterKey)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Controls */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Assignee Filter */}
            <div className="space-y-2">
              <Label htmlFor="assignee-filter">Assignee</Label>
              <Select value={filters.assignee} onValueChange={(value) => updateFilter("assignee", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_assignee">Any assignee</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="john_doe">John Doe</SelectItem>
                  <SelectItem value="jane_smith">Jane Smith</SelectItem>
                  <SelectItem value="bob_wilson">Bob Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reporter Filter */}
            <div className="space-y-2">
              <Label htmlFor="reporter-filter">Reporter</Label>
              <Select value={filters.reporter} onValueChange={(value) => updateFilter("reporter", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any reporter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_reporter">Any reporter</SelectItem>
                  <SelectItem value="john_doe">John Doe</SelectItem>
                  <SelectItem value="jane_smith">Jane Smith</SelectItem>
                  <SelectItem value="bob_wilson">Bob Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Filter */}
            <div className="space-y-2">
              <Label htmlFor="project-filter">Project</Label>
              <Select value={filters.project} onValueChange={(value) => updateFilter("project", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_project">Any project</SelectItem>
                  <SelectItem value="web-app">Web App</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comments Filter */}
            <div className="space-y-2">
              <Label htmlFor="comments-filter">Comments</Label>
              <Select value={filters.hasComments} onValueChange={(value) => updateFilter("hasComments", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_comments">Any</SelectItem>
                  <SelectItem value="has_comments">Has comments</SelectItem>
                  <SelectItem value="no_comments">No comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Created From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Created To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => updateFilter("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
