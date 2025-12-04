"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ReportGenerator } from "@/components/report-generator"

export default function ReportsPage() {
  return (
    <AuthGuard requiredRole="coordinator">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
            <p className="text-muted-foreground">Gere relatórios em PDF com dados nutricionais e ambientais da horta</p>
          </div>

          <ReportGenerator />
        </div>
      </div>
    </AuthGuard>
  )
}
