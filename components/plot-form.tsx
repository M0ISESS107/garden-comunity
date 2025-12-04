"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGardenStore } from "@/lib/store"
import type { Plot } from "@/lib/types"
import { X } from "lucide-react"

interface PlotFormProps {
  plot?: Plot
  onClose: () => void
}

export function PlotForm({ plot, onClose }: PlotFormProps) {
  const { addPlot, updatePlot, families } = useGardenStore()
  const [formData, setFormData] = useState({
    number: plot?.number.toString() || "",
    familyId: plot?.familyId || "",
    size: plot?.size.toString() || "",
    plantType: plot?.plantType || "",
    plantingDate: plot?.plantingDate || "",
    harvestForecast: plot?.harvestForecast || "",
    status: plot?.status || "preparation",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const plotData = {
      number: Number.parseInt(formData.number),
      familyId: formData.familyId,
      size: Number.parseFloat(formData.size),
      plantType: formData.plantType,
      plantingDate: formData.plantingDate,
      harvestForecast: formData.harvestForecast,
      status: formData.status as "active" | "idle" | "preparation",
      assignedDate: plot?.assignedDate || new Date().toISOString(),
    }

    if (plot) {
      updatePlot(plot.id, plotData)
    } else {
      addPlot(plotData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{plot ? "Editar Canteiro" : "Novo Canteiro"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="number">Número do Canteiro</Label>
            <Input
              id="number"
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="familyId">Família Responsável</Label>
            <Select value={formData.familyId} onValueChange={(value) => setFormData({ ...formData, familyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma família" />
              </SelectTrigger>
              <SelectContent>
                {families.map((family) => (
                  <SelectItem key={family.id} value={family.id}>
                    {family.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size">Tamanho (m²)</Label>
            <Input
              id="size"
              type="number"
              step="0.1"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="plantType">Tipo de Planta</Label>
            <Input
              id="plantType"
              placeholder="Ex: Tomate, Alface, Cenoura"
              value={formData.plantType}
              onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="plantingDate">Data de Plantio</Label>
            <Input
              id="plantingDate"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="harvestForecast">Previsão de Colheita</Label>
            <Input
              id="harvestForecast"
              type="date"
              value={formData.harvestForecast}
              onChange={(e) => setFormData({ ...formData, harvestForecast: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparation">Em Preparação</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="idle">Ocioso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {plot ? "Atualizar" : "Cadastrar"}
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
