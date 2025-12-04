"use client"

import { AuthGuard } from "@/components/auth-guard"
import { ProductionForm } from "@/components/production-form"
import { ProductionList } from "@/components/production-list"

export default function ProductionPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Produção</h1>
            <p className="text-muted-foreground">Registre a quantidade colhida e as famílias beneficiadas</p>
          </div>

          <ProductionForm />
          <ProductionList />
        </div>
      </div>
    </AuthGuard>
  )
}
