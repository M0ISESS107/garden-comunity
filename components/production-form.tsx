"use client"

import type React from "react"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function ProductionForm() {
  const plots = useGardenStore((state) => state.plots)
  const families = useGardenStore((state) => state.families)
  const addProduction = useGardenStore((state) => state.addProduction)
  const currentUser = useGardenStore((state) => state.currentUser)

  const [plotId, setPlotId] = useState("")
  const [crop, setCrop] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("kg")
  const [harvestDate, setHarvestDate] = useState("")
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(new Set())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const totalPercentage = families
      .filter((f) => selectedFamilies.has(f.id))
      .reduce((sum, f) => sum + f.sharePercentage, 0)

    const benefitedFamilies = families
      .filter((f) => selectedFamilies.has(f.id))
      .map((f) => ({
        familyId: f.id,
        amount: (Number.parseFloat(quantity) * f.sharePercentage) / totalPercentage,
      }))

    addProduction({
      plotId,
      crop,
      quantity: Number.parseFloat(quantity),
      unit,
      harvestDate,
      benefitedFamilies,
      distributed: false,
    })

    setPlotId("")
    setCrop("")
    setQuantity("")
    setUnit("kg")
    setHarvestDate("")
    setSelectedFamilies(new Set())
  }

  const toggleFamily = (familyId: string) => {
    const newSelected = new Set(selectedFamilies)
    if (newSelected.has(familyId)) {
      newSelected.delete(familyId)
    } else {
      newSelected.add(familyId)
    }
    setSelectedFamilies(newSelected)
  }

  if (currentUser?.role !== "coordinator") {
    return null
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Registrar Nova Produção</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="plotId">Canteiro</Label>
            <Select value={plotId} onValueChange={setPlotId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o canteiro" />
              </SelectTrigger>
              <SelectContent>
                {plots.map((plot) => (
                  <SelectItem key={plot.id} value={plot.id}>
                    Canteiro #{plot.number} - {plot.plantType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop">Cultivo</Label>
            <Input id="crop" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Ex: Tomate" required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidade</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                <SelectItem value="unidade">Unidades</SelectItem>
                <SelectItem value="maço">Maços</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestDate">Data da Colheita</Label>
            <Input
              id="harvestDate"
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Famílias Beneficiadas</Label>
          <div className="grid gap-2 sm:grid-cols-2 border rounded-lg p-4">
            {families.map((family) => (
              <div key={family.id} className="flex items-center gap-2">
                <Checkbox
                  id={`family-${family.id}`}
                  checked={selectedFamilies.has(family.id)}
                  onCheckedChange={() => toggleFamily(family.id)}
                />
                <Label htmlFor={`family-${family.id}`} className="text-sm font-normal cursor-pointer">
                  {family.name} ({family.sharePercentage}%)
                </Label>
              </div>
            ))}
          </div>
          {families.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma família cadastrada</p>}
        </div>

        <Button type="submit" className="w-full" disabled={selectedFamilies.size === 0}>
          Registrar Produção
        </Button>
      </form>
    </Card>
  )
}
