"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FamilyForm } from "./family-form"
import { Plus, Edit, Trash2, Users2, Grid3x3, PieChart } from "lucide-react"
import type { Family } from "@/lib/types"

export function FamilyList() {
  const { families, plots, deleteFamily } = useGardenStore()
  const [showForm, setShowForm] = useState(false)
  const [editingFamily, setEditingFamily] = useState<Family | undefined>()

  const handleEdit = (family: Family) => {
    setEditingFamily(family)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingFamily(undefined)
  }

  const getFamilyPlots = (familyId: string) => {
    return plots.filter((plot) => plot.familyId === familyId)
  }

  const totalSharePercentage = families.reduce((sum, family) => sum + family.sharePercentage, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Famílias</h2>
          <p className="text-muted-foreground">Gerencie famílias e distribuição da produção</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Família
        </Button>
      </div>

      {families.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Total de Distribuição Configurada:</span>
            </div>
            <Badge variant={totalSharePercentage === 100 ? "default" : "secondary"}>
              {totalSharePercentage.toFixed(1)}%
            </Badge>
          </div>
          {totalSharePercentage !== 100 && (
            <p className="text-xs text-muted-foreground mt-2">
              Configure as famílias para que o total seja 100% para uma distribuição justa.
            </p>
          )}
        </Card>
      )}

      {families.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhuma família cadastrada ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => {
            const familyPlots = getFamilyPlots(family.id)
            return (
              <Card key={family.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{family.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {family.sharePercentage}% da produção
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(family)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteFamily(family.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users2 className="h-4 w-4" />
                      <span>
                        {family.members} {family.members === 1 ? "membro" : "membros"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Grid3x3 className="h-4 w-4" />
                      <span>
                        {familyPlots.length} {familyPlots.length === 1 ? "canteiro" : "canteiros"}
                      </span>
                    </div>
                  </div>

                  {familyPlots.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Canteiros:</p>
                      <div className="flex flex-wrap gap-1">
                        {familyPlots.map((plot) => (
                          <Badge key={plot.id} variant="secondary" className="text-xs">
                            #{plot.number}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showForm && <FamilyForm family={editingFamily} onClose={handleClose} />}
    </div>
  )
}
