"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LocationCard } from "@/components/location-card"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { LocationSection } from "@/app/page"

interface ReportSectionProps {
  title: string
  date: Date
  sections: LocationSection[]
  onUpdate: (sections: LocationSection[]) => void
  calculateTotal: (sections: LocationSection[]) => number
}

const defaultIssues = ["LENTIDÃO", "SEM CONEXÃO", "LOSS", "SINAL ALTO", "CONFIG.ROTEADOR", "TROCA DE SENHA"]

export function ReportSection({ title, date, sections, onUpdate, calculateTotal }: ReportSectionProps) {
  const total = calculateTotal(sections)

  const addLocation = () => {
    const locationName = prompt("Digite o nome da localização:")
    if (!locationName) return

    const newSection: LocationSection = {
      id: Math.random().toString(36).substr(2, 9),
      name: locationName.toUpperCase(),
      enabled: true,
      issues: defaultIssues.map((label) => ({
        id: Math.random().toString(36).substr(2, 9),
        label,
        count: 0,
        enabled: false,
      })),
    }

    onUpdate([...sections, newSection])
  }

  return (
    <Card className="p-6 mb-6 bg-card/95 backdrop-blur border-border/50 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
            <p className="text-muted-foreground">{format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-primary">{total}</p>
            </div>
            <Button onClick={addLocation} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nova Localização
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <LocationCard
            key={section.id}
            section={section}
            onUpdate={(updated) => {
              onUpdate(sections.map((s) => (s.id === updated.id ? updated : s)))
            }}
            onDelete={() => {
              onUpdate(sections.filter((s) => s.id !== section.id))
            }}
          />
        ))}
      </div>
    </Card>
  )
}
