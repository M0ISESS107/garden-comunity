"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VolunteerForm } from "./volunteer-form"
import { UserPlus, Mail, Phone, Calendar, Edit, Trash2 } from "lucide-react"
import type { Volunteer } from "@/lib/types"

export function VolunteerList() {
  const { volunteers, deleteVolunteer } = useGardenStore()
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | undefined>()

  const handleEdit = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingVolunteer(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voluntários</h2>
          <p className="text-muted-foreground">Gerencie os voluntários da horta</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Voluntário
        </Button>
      </div>

      {volunteers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum voluntário cadastrado ainda.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {volunteers.map((volunteer) => (
            <Card key={volunteer.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{volunteer.name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(volunteer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteVolunteer(volunteer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{volunteer.email}</span>
                  </div>
                  {volunteer.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{volunteer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Desde {new Date(volunteer.joinedDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>

                {volunteer.availability.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Disponibilidade:</p>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.availability.map((day, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {volunteer.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Habilidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <VolunteerForm volunteer={editingVolunteer} onClose={handleClose} />}
    </div>
  )
}
