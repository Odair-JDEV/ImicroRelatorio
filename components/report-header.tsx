"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ReportHeaderProps {
  onClearStorage?: () => void
}

export function ReportHeader({ onClearStorage }: ReportHeaderProps) {
  return (
    <div className="text-center mb-8 relative">
      {onClearStorage && (
        <div className="absolute top-0 right-0">
          <Button
            onClick={onClearStorage}
            variant="outline"
            size="sm"
            className="bg-destructive/10 hover:bg-destructive/20 border-destructive/50 text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Memória
          </Button>
        </div>
      )}

      <div className="relative w-full max-w-xs mx-auto mb-6 h-20">
        <Image
          src="https://imicro.com.br/wp-content/uploads/2022/06/imicro-telecom.png"
          alt="iMicro Telecom"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-4xl font-bold text-foreground mb-2">Sistema de Relatórios</h1>
      <p className="text-muted-foreground text-lg">Gestão de Ordens de Serviço</p>
    </div>
  )
}
