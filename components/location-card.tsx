"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { IssueCounter } from "@/components/issue-counter"
import { MapPin, Plus, Trash2 } from "lucide-react"
import type { LocationSection, IssueItem } from "@/app/page"

interface LocationCardProps {
  section: LocationSection
  onUpdate: (section: LocationSection) => void
  onDelete: () => void
}

export function LocationCard({ section, onUpdate, onDelete }: LocationCardProps) {
  const total = section.issues.filter((i) => i.enabled).reduce((sum, issue) => sum + issue.count, 0)

  const addIssue = () => {
    const issueLabel = prompt("Digite o nome da categoria:")
    if (!issueLabel) return

    const newIssue: IssueItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: issueLabel.toUpperCase(),
      count: 0,
      enabled: false,
    }

    onUpdate({
      ...section,
      issues: [...section.issues, newIssue],
    })
  }

  const updateIssue = (issueId: string, updates: Partial<IssueItem>) => {
    onUpdate({
      ...section,
      issues: section.issues.map((i) => (i.id === issueId ? { ...i, ...updates } : i)),
    })
  }

  const deleteIssue = (issueId: string) => {
    onUpdate({
      ...section,
      issues: section.issues.filter((i) => i.id !== issueId),
    })
  }

  return (
    <Card className="p-5 bg-muted/30 border-border/50 hover:border-border transition-colors">
      <div className="flex items-start gap-2 mb-2">
        <Checkbox
          checked={section.enabled}
          onCheckedChange={(checked) => onUpdate({ ...section, enabled: checked as boolean })}
          className="mt-0.5"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">{section.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-primary">{total}</span> ordens
          </p>
        </div>

        <Button
          onClick={onDelete}
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {section.enabled && (
        <>
          <div className="space-y-2 mb-3">
            {section.issues.map((issue) => (
              <IssueCounter
                key={issue.id}
                issue={issue}
                onUpdate={(updates) => updateIssue(issue.id, updates)}
                onDelete={() => deleteIssue(issue.id)}
              />
            ))}
          </div>

          <Button onClick={addIssue} size="sm" variant="outline" className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </>
      )}
    </Card>
  )
}
