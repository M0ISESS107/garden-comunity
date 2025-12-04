"use client"

import { useGardenStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Trash2 } from "lucide-react"
import { AttendanceDialog } from "./attendance-dialog"

export function WorkdayList() {
  const workdays = useGardenStore((state) => state.workdays)
  const deleteWorkday = useGardenStore((state) => state.deleteWorkday)
  const currentUser = useGardenStore((state) => state.currentUser)

  const sortedWorkdays = [...workdays].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (workdays.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Nenhum mutirão cadastrado ainda.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mutirões Agendados</h2>
      <div className="grid gap-4">
        {sortedWorkdays.map((workday) => {
          const presentCount = workday.attendance.filter((a) => a.present).length
          const totalHours = workday.attendance.reduce((sum, a) => sum + (a.present ? a.hours : 0), 0)

          return (
            <Card key={workday.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{workday.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(workday.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {workday.startTime} - {workday.endTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {presentCount} voluntários ({totalHours}h trabalhadas)
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AttendanceDialog workday={workday} />
                  {currentUser?.role === "coordinator" && (
                    <Button variant="outline" size="icon" onClick={() => deleteWorkday(workday.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Atividades:</h4>
                  <div className="flex flex-wrap gap-2">
                    {workday.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {workday.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Observações:</h4>
                    <p className="text-sm text-muted-foreground">{workday.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
