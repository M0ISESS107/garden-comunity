"use client"

import { useGardenStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Users, Trash2, CheckCircle2 } from "lucide-react"

export function ProductionList() {
  const productions = useGardenStore((state) => state.productions)
  const plots = useGardenStore((state) => state.plots)
  const families = useGardenStore((state) => state.families)
  const deleteProduction = useGardenStore((state) => state.deleteProduction)
  const distributeProduction = useGardenStore((state) => state.distributeProduction)
  const currentUser = useGardenStore((state) => state.currentUser)

  const sortedProductions = [...productions].sort(
    (a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime(),
  )

  const getPlotInfo = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId)
    return plot ? `Canteiro #${plot.number}` : "Canteiro desconhecido"
  }

  const getFamilyName = (familyId: string) => {
    const family = families.find((f) => f.id === familyId)
    return family?.name || "Família desconhecida"
  }

  const totalProduced = productions.reduce((sum, p) => sum + p.quantity, 0)
  const totalDistributed = productions.filter((p) => p.distributed).length

  if (productions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhuma produção registrada ainda.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Produzido</p>
              <p className="text-2xl font-bold">{totalProduced.toFixed(1)} kg</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distribuídas</p>
              <p className="text-2xl font-bold">{totalDistributed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Colheitas</p>
              <p className="text-2xl font-bold">{productions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Histórico de Produção</h2>
        <div className="grid gap-4">
          {sortedProductions.map((production) => (
            <Card key={production.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{production.crop}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {production.quantity} {production.unit}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(production.harvestDate).toLocaleDateString("pt-BR")}
                    </div>
                    <div>{getPlotInfo(production.plotId)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!production.distributed && currentUser?.role === "coordinator" && (
                    <Button variant="outline" size="sm" onClick={() => distributeProduction(production.id)}>
                      Marcar como Distribuída
                    </Button>
                  )}
                  {production.distributed && (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Distribuída</Badge>
                  )}
                  {currentUser?.role === "coordinator" && (
                    <Button variant="outline" size="icon" onClick={() => deleteProduction(production.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {production.benefitedFamilies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Distribuição:</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {production.benefitedFamilies.map((benefit) => (
                      <div key={benefit.familyId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{getFamilyName(benefit.familyId)}</span>
                        <Badge variant="secondary">
                          {benefit.amount.toFixed(2)} {production.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
