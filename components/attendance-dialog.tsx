"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCheck } from "lucide-react"
import type { Workday } from "@/lib/types"

interface AttendanceDialogProps {
  workday: Workday
}

export function AttendanceDialog({ workday }: AttendanceDialogProps) {
  const volunteers = useGardenStore((state) => state.volunteers)
  const markAttendance = useGardenStore((state) => state.markAttendance)
  const currentUser = useGardenStore((state) => state.currentUser)
  const [open, setOpen] = useState(false)

  const handleAttendanceChange = (volunteerId: string, present: boolean, hours: number) => {
    markAttendance(workday.id, volunteerId, present, hours)
  }

  const getAttendance = (volunteerId: string) => {
    return workday.attendance.find((a) => a.volunteerId === volunteerId) || { present: false, hours: 0 }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserCheck className="h-4 w-4 mr-2" />
          Presença
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Presença - {workday.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {volunteers.map((volunteer) => {
            const attendance = getAttendance(volunteer.id)
            return (
              <div key={volunteer.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Checkbox
                  checked={attendance.present}
                  onCheckedChange={(checked) =>
                    handleAttendanceChange(volunteer.id, checked as boolean, attendance.hours)
                  }
                  disabled={currentUser?.role !== "coordinator"}
                />
                <div className="flex-1">
                  <p className="font-medium">{volunteer.name}</p>
                  <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`hours-${volunteer.id}`} className="text-sm">
                    Horas:
                  </Label>
                  <Input
                    id={`hours-${volunteer.id}`}
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={attendance.hours}
                    onChange={(e) =>
                      handleAttendanceChange(volunteer.id, attendance.present, Number.parseFloat(e.target.value) || 0)
                    }
                    className="w-20"
                    disabled={!attendance.present || currentUser?.role !== "coordinator"}
                  />
                </div>
              </div>
            )
          })}
          {volunteers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum voluntário cadastrado</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
