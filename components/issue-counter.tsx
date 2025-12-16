"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Minus, Plus, X } from "lucide-react"
import type { IssueItem } from "@/app/page"

interface IssueCounterProps {
  issue: IssueItem
  onUpdate: (updates: Partial<IssueItem>) => void
  onDelete: () => void
}

export function IssueCounter({ issue, onUpdate, onDelete }: IssueCounterProps) {
  const increment = () => onUpdate({ count: issue.count + 1 })
  const decrement = () => {
    if (issue.count > 0) {
      onUpdate({ count: issue.count - 1 })
    }
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
      <Checkbox checked={issue.enabled} onCheckedChange={(checked) => onUpdate({ enabled: checked as boolean })} />

      <span className="flex-1 text-sm font-medium text-foreground">{issue.label}</span>

      {issue.enabled && (
        <div className="flex items-center gap-2">
          <Button
            onClick={decrement}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-transparent"
            disabled={issue.count === 0}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="w-12 text-center font-bold text-foreground">{issue.count}</span>

          <Button onClick={increment} size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
            <Plus className="w-4 h-4" />
          </Button>

          <Button
            onClick={onDelete}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
