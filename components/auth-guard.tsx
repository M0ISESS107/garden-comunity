"use client"

import type React from "react"

import { useGardenStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@/lib/types"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const currentUser = useGardenStore((state) => state.currentUser)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push("/")
    }
  }, [currentUser, requiredRole, router])

  if (!currentUser) {
    return null
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
