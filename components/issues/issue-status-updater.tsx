"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type Issue, type User, api } from "@/lib/api"
import { Settings, Loader2, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface IssueStatusUpdaterProps {
  issue: Issue
  users: User[]
  onUpdate: () => void
  canEdit: boolean
}

export function IssueStatusUpdater({ issue, users, onUpdate, canEdit }: IssueStatusUpdaterProps) {
  const [status, setStatus] = useState(issue.status)
  const [assigneeId, setAssigneeId] = useState(issue.assignee?.id?.toString() || "unassigned")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleUpdate = async () => {
    if (!canEdit) return

    setError("")
    setIsUpdating(true)

    try {
      await api.updateIssue(issue.id, {
        status,
        assignee_id: assigneeId === "unassigned" ? null : Number.parseInt(assigneeId),
      })

      toast({
        title: "Issue updated",
        description: "The issue has been updated successfully.",
      })

      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update issue")
    } finally {
      setIsUpdating(false)
    }
  }

  const hasChanges = status !== issue.status || assigneeId !== (issue.assignee?.id?.toString() || "unassigned")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Settings className="h-5 w-5" />
          <span>Issue Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select value={status} onValueChange={setStatus} disabled={!canEdit || isUpdating}>
            <SelectTrigger className="bg-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Assignee</label>
          <Select value={assigneeId} onValueChange={setAssigneeId} disabled={!canEdit || isUpdating}>
            <SelectTrigger className="bg-input">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4" />
                  <span>Unassigned</span>
                </div>
              </SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name} (${user.username})`
                    : user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canEdit && hasChanges && (
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full bg-primary hover:bg-primary/90">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Issue"
            )}
          </Button>
        )}

        {!canEdit && (
          <p className="text-sm text-muted-foreground">Only the reporter or assignee can update this issue.</p>
        )}
      </CardContent>
    </Card>
  )
}
