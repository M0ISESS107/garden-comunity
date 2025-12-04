"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGardenStore } from "@/lib/store"
import type { Volunteer } from "@/lib/types"
import { X } from "lucide-react"

interface VolunteerFormProps {
  volunteer?: Volunteer
  onClose: () => void
}

export function VolunteerForm({ volunteer, onClose }: VolunteerFormProps) {
  const { addVolunteer, updateVolunteer } = useGardenStore()
  const [formData, setFormData] = useState({
    name: volunteer?.name || "",
    email: volunteer?.email || "",
    phone: volunteer?.phone || "",
    availability: volunteer?.availability.join(", ") || "",
    skills: volunteer?.skills.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const volunteerData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      availability: formData.availability
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      joinedDate: volunteer?.joinedDate || new Date().toISOString(),
    }

    if (volunteer) {
      updateVolunteer(volunteer.id, volunteerData)
    } else {
      addVolunteer(volunteerData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{volunteer ? "Editar Voluntário" : "Novo Voluntário"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="availability">Disponibilidade (separar por vírgula)</Label>
            <Input
              id="availability"
              placeholder="Segunda, Quarta, Sábado"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="skills">Habilidades (separar por vírgula)</Label>
            <Input
              id="skills"
              placeholder="Plantio, Irrigação, Compostagem"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {volunteer ? "Atualizar" : "Cadastrar"}
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
