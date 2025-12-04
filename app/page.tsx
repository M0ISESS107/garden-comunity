"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useGardenStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Users, Grid3x3, Leaf, Share2, CalendarDays, FileText, LogOut } from "lucide-react"

export default function Home() {
  const currentUser = useGardenStore((state) => state.currentUser)
  const logout = useGardenStore((state) => state.logout)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sprout className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hortas Comunitárias</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Plataforma colaborativa para gestão de hortas urbanas, coordenação de voluntários e distribuição justa da
              produção.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <p className="text-sm">
                <span className="text-muted-foreground">Olá, </span>
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  ({currentUser.role === "coordinator" ? "Coordenador" : "Voluntário"})
                </span>
              </p>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Link href="/voluntarios" className="block space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Voluntários</h2>
                </div>
                <p className="text-muted-foreground">
                  Cadastre e organize voluntários com suas disponibilidades e habilidades.
                </p>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Link href="/canteiros" className="block space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Grid3x3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Canteiros</h2>
                </div>
                <p className="text-muted-foreground">Gerencie canteiros com tipo de planta e previsão de colheita.</p>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Link href="/mutiroes" className="block space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Mutirões</h2>
                </div>
                <p className="text-muted-foreground">
                  Organize mutirões de trabalho e registre a presença dos voluntários.
                </p>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Link href="/producao" className="block space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Produção</h2>
                </div>
                <p className="text-muted-foreground">Registre produção colhida e famílias beneficiadas.</p>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Link href="/familias" className="block space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Famílias</h2>
                </div>
                <p className="text-muted-foreground">
                  Organize famílias participantes e distribua a produção de forma justa.
                </p>
              </Link>
            </Card>

            {currentUser.role === "coordinator" && (
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <Link href="/relatorios" className="block space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold">Relatórios</h2>
                  </div>
                  <p className="text-muted-foreground">Gere relatórios com dados nutricionais e ambientais.</p>
                </Link>
              </Card>
            )}
          </div>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Como funciona?</h3>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">Cadastre voluntários e famílias participantes</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">Organize canteiros e distribua responsabilidades</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">Registre colheitas e acompanhe produção</p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <p className="text-sm text-muted-foreground">Distribua a produção entre as famílias</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
