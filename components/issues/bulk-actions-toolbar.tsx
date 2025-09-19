"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, X, Users, Tag, Trash2, Archive } from "lucide-react"

interface BulkActionsToolbarProps {
  selectedCount: number
  selectedIssues: number[]
  onAction: (action: string, issueIds: number[]) => void
}

export function BulkActionsToolbar({ selectedCount, selectedIssues, onAction }: BulkActionsToolbarProps) {
  const [bulkAction, setBulkAction] = useState("")

  const handleAction = () => {
    if (bulkAction && selectedIssues.length > 0) {
      onAction(bulkAction, selectedIssues)
      setBulkAction("")
    }
  }

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                <Badge variant="secondary" className="mr-2">
                  {selectedCount}
                </Badge>
                {selectedCount === 1 ? "issue" : "issues"} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status_open">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Mark as Open
                    </div>
                  </SelectItem>
                  <SelectItem value="status_in_progress">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Mark as In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="status_closed">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Mark as Closed
                    </div>
                  </SelectItem>
                  <SelectItem value="assign">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Assign to User
                    </div>
                  </SelectItem>
                  <SelectItem value="priority_high">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Set High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="priority_low">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-4 w-4" />
                      Set Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center">
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Issues
                    </div>
                  </SelectItem>
                  <SelectItem value="delete" className="text-destructive">
                    <div className="flex items-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Issues
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleAction} disabled={!bulkAction} size="sm">
                Apply
              </Button>
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => onAction("clear_selection", [])}>
            <X className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
