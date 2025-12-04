"use client"

import { AuthGuard } from "@/components/auth-guard"
import { WorkdayForm } from "@/components/workday-form"
import { WorkdayList } from "@/components/workday-list"

export default function WorkdaysPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mutirões</h1>
            <p className="text-muted-foreground">Organize mutirões de trabalho e registre a presença dos voluntários</p>
          </div>

          <WorkdayForm />
          <WorkdayList />
        </div>
      </div>
    </AuthGuard>
  )
}
