"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGardenStore } from "@/lib/store"
import type { Family } from "@/lib/types"
import { X } from "lucide-react"

interface FamilyFormProps {
  family?: Family
  onClose: () => void
}

export function FamilyForm({ family, onClose }: FamilyFormProps) {
  const { addFamily, updateFamily } = useGardenStore()
  const [formData, setFormData] = useState({
    name: family?.name || "",
    members: family?.members.toString() || "",
    contactPerson: family?.contactPerson || "",
    contactPhone: family?.contactPhone || "",
    sharePercentage: family?.sharePercentage.toString() || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const familyData = {
      name: formData.name,
      members: Number.parseInt(formData.members),
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      plotIds: family?.plotIds || [],
      volunteerIds: family?.volunteerIds || [],
      sharePercentage: Number.parseFloat(formData.sharePercentage),
    }

    if (family) {
      updateFamily(family.id, familyData)
    } else {
      addFamily(familyData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{family ? "Editar Família" : "Nova Família"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Família</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Família Silva"
              required
            />
          </div>

          <div>
            <Label htmlFor="members">Número de Membros</Label>
            <Input
              id="members"
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="contactPerson">Pessoa de Contato</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="Nome do responsável"
              required
            />
          </div>

          <div>
            <Label htmlFor="contactPhone">Telefone de Contato</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <Label htmlFor="sharePercentage">Percentual de Distribuição (%)</Label>
            <Input
              id="sharePercentage"
              type="number"
              step="0.1"
              value={formData.sharePercentage}
              onChange={(e) => setFormData({ ...formData, sharePercentage: e.target.value })}
              placeholder="Ex: 20"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Define a proporção da produção que essa família recebe</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {family ? "Atualizar" : "Cadastrar"}
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
