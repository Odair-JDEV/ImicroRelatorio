"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ReportHeader } from "@/components/report-header"
import { SummaryCards } from "@/components/summary-cards"
import { ReportSection } from "@/components/report-section"
import { Plus, Copy, FileDown, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export interface IssueItem {
  id: string
  label: string
  count: number
  enabled: boolean
}

export interface LocationSection {
  id: string
  name: string
  enabled: boolean
  issues: IssueItem[]
}

export interface Report {
  date: Date
  openOrders: LocationSection[]
  completedOrders: LocationSection[]
}

const defaultIssues = ["LENTIDÃO", "SEM CONEXÃO", "LOSS", "SINAL ALTO", "CONFIG.ROTEADOR", "TROCA DE SENHA"]

const STORAGE_KEY = "report-data-v1"

export default function ReportsPage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.report) {
          parsed.report.date = new Date(parsed.report.date)
        }
        if (parsed.selectedDate) {
          setSelectedDate(new Date(parsed.selectedDate))
        }
        if (parsed.report) {
          setReport(parsed.report)
        }
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (report) {
      const dataToSave = {
        selectedDate: selectedDate.toISOString(),
        report,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [report, selectedDate])

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
    setReport(null)
    setSelectedDate(new Date())
    toast({
      title: "Memória limpa",
      description: "Todos os dados salvos foram removidos",
    })
  }

  const createDefaultSection = (name: string): LocationSection => ({
    id: Math.random().toString(36).substr(2, 9),
    name,
    enabled: true,
    issues: defaultIssues.map((label) => ({
      id: Math.random().toString(36).substr(2, 9),
      label,
      count: 0,
      enabled: false,
    })),
  })

  const generateReport = () => {
    const newReport: Report = {
      date: selectedDate,
      openOrders: [createDefaultSection("UBÁ"), createDefaultSection("TOCANTINS"), createDefaultSection("PIRAUBA")],
      completedOrders: [
        createDefaultSection("UBÁ"),
        createDefaultSection("TOCANTINS"),
        createDefaultSection("PIRAUBA"),
      ],
    }
    setReport(newReport)

    toast({
      title: "Relatório gerado",
      description: `Relatório criado para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`,
    })
  }

  const updateReport = (type: "openOrders" | "completedOrders", sections: LocationSection[]) => {
    if (!report) return
    setReport({ ...report, [type]: sections })
  }

  const calculateTotal = (sections: LocationSection[]) => {
    return sections
      .filter((s) => s.enabled)
      .reduce((total, section) => {
        return total + section.issues.filter((i) => i.enabled).reduce((sum, issue) => sum + issue.count, 0)
      }, 0)
  }

  const generateReportText = () => {
    if (!report) return ""

    const formattedDate = format(report.date, "dd/MM/yyyy", { locale: ptBR })
    let text = ""

    const openTotal = calculateTotal(report.openOrders)
    text += `*PARCIAL DO DIA ${formattedDate} TOTAL DE O.S EM ABERTO NO SISTEMA: ${openTotal}*\n`
    text += "-".repeat(65) + "\n"

    report.openOrders
      .filter((s) => s.enabled)
      .forEach((section) => {
        const sectionTotal = section.issues.filter((i) => i.enabled).reduce((sum, i) => sum + i.count, 0)

        text += `\n*TOTAL EM ${section.name}: ${sectionTotal}*\n\n`

        section.issues
          .filter((i) => i.enabled)
          .forEach((issue) => {
            text += `- ${issue.label}: ${issue.count}\n`
          })

        text += "\n" + "-".repeat(65) + "\n"
      })

    const completedTotal = calculateTotal(report.completedOrders)
    text += `\n*RELATÓRIO DE O.S REALIZADAS DIA ${formattedDate} TOTAL: ${completedTotal}*\n`
    text += "-".repeat(65) + "\n"

    report.completedOrders
      .filter((s) => s.enabled)
      .forEach((section) => {
        const sectionTotal = section.issues.filter((i) => i.enabled).reduce((sum, i) => sum + i.count, 0)

        text += `\n*TOTAL EM ${section.name}: ${sectionTotal}*\n\n`

        section.issues
          .filter((i) => i.enabled)
          .forEach((issue) => {
            text += `- ${issue.label}: ${issue.count}\n`
          })

        text += "\n" + "-".repeat(65) + "\n"
      })

    return text
  }

  const copyReport = async () => {
    const text = generateReportText()
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Relatório copiado para a área de transferência",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o relatório",
        variant: "destructive",
      })
    }
  }

  const exportReport = () => {
    const text = generateReportText()
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-${format(selectedDate, "yyyy-MM-dd")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Exportado!",
      description: "Relatório baixado com sucesso",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ReportHeader onClearStorage={clearLocalStorage} />

        <Card className="p-6 mb-6 bg-card/95 backdrop-blur border-border/50 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Data do Relatório
              </label>
              <input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value + "T12:00:00"))}
                className="w-full md:w-auto px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button onClick={generateReport} className="flex-1 md:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>

              {report && (
                <>
                  <Button onClick={copyReport} variant="outline" className="flex-1 md:flex-none bg-transparent">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>

                  <Button onClick={exportReport} variant="outline" className="flex-1 md:flex-none bg-transparent">
                    <FileDown className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {report && (
          <>
            <SummaryCards report={report} calculateTotal={calculateTotal} />

            <ReportSection
              title="OS EM ABERTO NO SISTEMA"
              date={report.date}
              sections={report.openOrders}
              onUpdate={(sections) => updateReport("openOrders", sections)}
              calculateTotal={calculateTotal}
            />

            <ReportSection
              title="OS REALIZADAS"
              date={report.date}
              sections={report.completedOrders}
              onUpdate={(sections) => updateReport("completedOrders", sections)}
              calculateTotal={calculateTotal}
            />
          </>
        )}

        {!report && (
          <Card className="p-12 text-center bg-card/95 backdrop-blur border-border/50">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhum relatório gerado</h3>
              <p className="text-muted-foreground mb-6">
                Selecione uma data e clique em "Gerar Relatório" para começar
              </p>
            </div>
          </Card>
        )}
      </div>

      <Toaster />
    </div>
  )
}
