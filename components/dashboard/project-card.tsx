"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/api"
import { Calendar, FolderOpen, Bug } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg text-primary">{project.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {project.issues_count} issues
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(project.created_at)}</span>
          </div>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link href={`/projects/${project.id}`}>
              <Bug className="h-4 w-4 mr-2" />
              View Issues
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
