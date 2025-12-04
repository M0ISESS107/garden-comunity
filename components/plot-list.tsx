"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlotForm } from "./plot-form"
import { Plus, Edit, Trash2, Ruler, Calendar } from "lucide-react"
import type { Plot } from "@/lib/types"

export function PlotList() {
  const { plots, families, deletePlot } = useGardenStore()
  const [showForm, setShowForm] = useState(false)
  const [editingPlot, setEditingPlot] = useState<Plot | undefined>()

  const handleEdit = (plot: Plot) => {
    setEditingPlot(plot)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingPlot(undefined)
  }

  const getFamilyName = (familyId: string) => {
    const family = families.find((f) => f.id === familyId)
    return family?.name || "Sem família"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "preparation":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "idle":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "preparation":
        return "Em Preparação"
      case "idle":
        return "Ocioso"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Canteiros</h2>
          <p className="text-muted-foreground">Organize os espaços de cultivo da horta</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Canteiro
        </Button>
      </div>

      {plots.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum canteiro cadastrado ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plots
            .sort((a, b) => a.number - b.number)
            .map((plot) => (
              <Card key={plot.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Canteiro #{plot.number}</h3>
                      <p className="text-sm text-muted-foreground">{getFamilyName(plot.familyId)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(plot)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deletePlot(plot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(plot.status)}>{getStatusText(plot.status)}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Ruler className="h-3 w-3" />
                      <span>{plot.size}m²</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Planta: </span>
                      <span className="text-muted-foreground">{plot.plantType}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Plantio: {new Date(plot.plantingDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Colheita: {new Date(plot.harvestForecast).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {showForm && <PlotForm plot={editingPlot} onClose={handleClose} />}
    </div>
  )
}
