import { Card } from "@/components/ui/card"
import { FileText, CheckCircle2, Clock } from "lucide-react"
import type { Report } from "@/app/page"

interface SummaryCardsProps {
  report: Report
  calculateTotal: (sections: any[]) => number
}

export function SummaryCards({ report, calculateTotal }: SummaryCardsProps) {
  const openTotal = calculateTotal(report.openOrders)
  const completedTotal = calculateTotal(report.completedOrders)
  const grandTotal = openTotal + completedTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-6 bg-gradient-to-br from-blue-500/90 to-blue-600/90 text-white border-0 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Geral</p>
            <p className="text-3xl font-bold">{grandTotal}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>
        <p className="text-blue-100 text-sm">Todas as ordens</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-amber-500/90 to-amber-600/90 text-white border-0 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Em Aberto</p>
            <p className="text-3xl font-bold">{openTotal}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <p className="text-amber-100 text-sm">Aguardando conclusão</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 text-white border-0 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Realizadas</p>
            <p className="text-3xl font-bold">{completedTotal}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <p className="text-emerald-100 text-sm">Concluídas hoje</p>
      </Card>
    </div>
  )
}
