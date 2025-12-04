"use client"

import type React from "react"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

export function WorkdayForm() {
  const currentUser = useGardenStore((state) => state.currentUser)
  const addWorkday = useGardenStore((state) => state.addWorkday)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [activities, setActivities] = useState<string[]>([""])
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    addWorkday({
      title,
      date,
      startTime,
      endTime,
      activities: activities.filter((a) => a.trim() !== ""),
      coordinatorId: currentUser.id,
      attendance: [],
      notes,
    })

    setTitle("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setActivities([""])
    setNotes("")
  }

  const addActivity = () => setActivities([...activities, ""])
  const removeActivity = (index: number) => setActivities(activities.filter((_, i) => i !== index))
  const updateActivity = (index: number, value: string) => {
    const newActivities = [...activities]
    newActivities[index] = value
    setActivities(newActivities)
  }

  if (currentUser?.role !== "coordinator") {
    return null
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Criar Novo Mutirão</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Mutirão</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Limpeza e Plantio"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startTime">Horário Início</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">Horário Fim</Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Atividades</Label>
            <Button type="button" variant="outline" size="sm" onClick={addActivity}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Atividade
            </Button>
          </div>
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={activity}
                  onChange={(e) => updateActivity(index, e.target.value)}
                  placeholder="Descreva a atividade"
                />
                {activities.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeActivity(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações adicionais sobre o mutirão"
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full">
          Criar Mutirão
        </Button>
      </form>
    </Card>
  )
}
