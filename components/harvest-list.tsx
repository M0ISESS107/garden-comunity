"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HarvestForm } from "./harvest-form"
import { Plus, Edit, Trash2, Calendar, Weight } from "lucide-react"
import type { Harvest } from "@/lib/types"

export function HarvestList() {
  const { harvests, plots, deleteHarvest } = useGardenStore()
  const [showForm, setShowForm] = useState(false)
  const [editingHarvest, setEditingHarvest] = useState<Harvest | undefined>()

  const handleEdit = (harvest: Harvest) => {
    setEditingHarvest(harvest)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingHarvest(undefined)
  }

  const getPlotNumber = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId)
    return plot?.number || "?"
  }

  const sortedHarvests = [...harvests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalHarvestsByMonth = harvests.reduce(
    (acc, harvest) => {
      const month = new Date(harvest.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      if (!acc[month]) acc[month] = 0
      acc[month] += harvest.quantity
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Colheitas</h2>
          <p className="text-muted-foreground">Registre e acompanhe a produção da horta</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Colheita
        </Button>
      </div>

      {harvests.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Total de Colheitas</p>
            <p className="text-2xl font-bold">{harvests.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Distribuídas</p>
            <p className="text-2xl font-bold">{harvests.filter((h) => h.distributed).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
            <p className="text-2xl font-bold">{harvests.filter((h) => !h.distributed).length}</p>
          </Card>
        </div>
      )}

      {sortedHarvests.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma colheita registrada ainda.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(totalHarvestsByMonth).length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Produção por Mês</h3>
              <div className="space-y-2">
                {Object.entries(totalHarvestsByMonth).map(([month, total]) => (
                  <div key={month} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{month}</span>
                    <span className="font-medium">{total.toFixed(1)} kg total</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedHarvests.map((harvest) => (
              <Card key={harvest.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{harvest.crop}</h3>
                      <p className="text-sm text-muted-foreground">Canteiro #{getPlotNumber(harvest.plotId)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(harvest)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteHarvest(harvest.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={harvest.distributed ? "default" : "secondary"}>
                      {harvest.distributed ? "Distribuída" : "Pendente"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Weight className="h-4 w-4" />
                      <span>
                        {harvest.quantity} {harvest.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(harvest.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showForm && <HarvestForm harvest={editingHarvest} onClose={handleClose} />}
    </div>
  )
}
