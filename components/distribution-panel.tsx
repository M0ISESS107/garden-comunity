"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Check } from "lucide-react"

export function DistributionPanel() {
  const { harvests, families, plots, distributeHarvest, updateHarvest } = useGardenStore()
  const [selectedHarvest, setSelectedHarvest] = useState<string | null>(null)

  const pendingHarvests = harvests.filter((h) => !h.distributed)

  const handleDistribute = (harvestId: string) => {
    const harvest = harvests.find((h) => h.id === harvestId)
    if (!harvest) return

    const totalPercentage = families.reduce((sum, family) => sum + family.sharePercentage, 0)

    if (totalPercentage !== 100) {
      alert("O total de distribuição das famílias deve ser 100%")
      return
    }

    const familyShares = families.map((family) => ({
      familyId: family.id,
      amount: (harvest.quantity * family.sharePercentage) / 100,
    }))

    updateHarvest(harvestId, { familyShares, distributed: true })
    setSelectedHarvest(null)
  }

  const getPlotNumber = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId)
    return plot?.number || "?"
  }

  const distributedHarvests = harvests.filter((h) => h.distributed)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Distribuição de Colheitas</h2>
        <p className="text-muted-foreground">Distribua as colheitas entre as famílias participantes</p>
      </div>

      {families.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Cadastre famílias primeiro para distribuir colheitas.</p>
        </Card>
      ) : pendingHarvests.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma colheita pendente de distribuição.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold">Colheitas Pendentes</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingHarvests.map((harvest) => (
              <Card key={harvest.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{harvest.crop}</h4>
                      <p className="text-sm text-muted-foreground">Canteiro #{getPlotNumber(harvest.plotId)}</p>
                    </div>
                    <Badge variant="secondary">Pendente</Badge>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium">
                      {harvest.quantity} {harvest.unit}
                    </p>
                    <p className="text-muted-foreground">{new Date(harvest.date).toLocaleDateString("pt-BR")}</p>
                  </div>

                  {selectedHarvest === harvest.id ? (
                    <div className="space-y-3 pt-2 border-t">
                      <p className="text-sm font-medium">Distribuição por família:</p>
                      {families.map((family) => {
                        const amount = (harvest.quantity * family.sharePercentage) / 100
                        return (
                          <div key={family.id} className="flex items-center justify-between text-sm">
                            <span>{family.name}</span>
                            <span className="font-medium">
                              {amount.toFixed(2)} {harvest.unit}
                            </span>
                          </div>
                        )
                      })}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1" onClick={() => handleDistribute(harvest.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Confirmar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedHarvest(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full" onClick={() => setSelectedHarvest(harvest.id)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Distribuir
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {distributedHarvests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Colheitas Distribuídas</h3>
          <div className="space-y-3">
            {distributedHarvests.slice(0, 5).map((harvest) => (
              <Card key={harvest.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{harvest.crop}</p>
                    <p className="text-sm text-muted-foreground">
                      {harvest.quantity} {harvest.unit} - {new Date(harvest.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge>
                    <Check className="h-3 w-3 mr-1" />
                    Distribuída
                  </Badge>
                </div>
                {harvest.familyShares.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    {harvest.familyShares.map((share) => {
                      const family = families.find((f) => f.id === share.familyId)
                      return (
                        <div key={share.familyId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{family?.name}</span>
                          <span>
                            {share.amount.toFixed(2)} {harvest.unit}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
