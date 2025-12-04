"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGardenStore } from "@/lib/store"
import type { Harvest } from "@/lib/types"
import { X } from "lucide-react"

interface HarvestFormProps {
  harvest?: Harvest
  onClose: () => void
}

export function HarvestForm({ harvest, onClose }: HarvestFormProps) {
  const { addHarvest, updateHarvest, plots } = useGardenStore()
  const [formData, setFormData] = useState({
    plotId: harvest?.plotId || "",
    crop: harvest?.crop || "",
    quantity: harvest?.quantity.toString() || "",
    unit: harvest?.unit || "kg",
    date: harvest?.date ? new Date(harvest.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const harvestData = {
      plotId: formData.plotId,
      crop: formData.crop,
      quantity: Number.parseFloat(formData.quantity),
      unit: formData.unit,
      date: new Date(formData.date).toISOString(),
      distributed: harvest?.distributed || false,
      familyShares: harvest?.familyShares || [],
    }

    if (harvest) {
      updateHarvest(harvest.id, harvestData)
    } else {
      addHarvest(harvestData)
    }

    onClose()
  }

  const getPlotLabel = (plotId: string) => {
    const plot = plots.find((p) => p.id === plotId)
    return plot ? `Canteiro #${plot.number}` : "Canteiro"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{harvest ? "Editar Colheita" : "Nova Colheita"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plotId">Canteiro</Label>
            <Select value={formData.plotId} onValueChange={(value) => setFormData({ ...formData, plotId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um canteiro" />
              </SelectTrigger>
              <SelectContent>
                {plots.map((plot) => (
                  <SelectItem key={plot.id} value={plot.id}>
                    {getPlotLabel(plot.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="crop">Cultivo</Label>
            <Input
              id="crop"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              placeholder="Ex: Tomate, Alface"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="unidades">unidades</SelectItem>
                  <SelectItem value="maços">maços</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date">Data da Colheita</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {harvest ? "Atualizar" : "Registrar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
