"use client"

import { useState } from "react"
import { useGardenStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Download } from "lucide-react"
import { nutritionalDatabase } from "@/lib/types"

export function ReportGenerator() {
  const productions = useGardenStore((state) => state.productions)
  const families = useGardenStore((state) => state.families)
  const plots = useGardenStore((state) => state.plots)
  const workdays = useGardenStore((state) => state.workdays)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const generatePDF = () => {
    const filteredProductions = productions.filter((p) => {
      const prodDate = new Date(p.harvestDate)
      const start = startDate ? new Date(startDate) : new Date(0)
      const end = endDate ? new Date(endDate) : new Date()
      return prodDate >= start && prodDate <= end
    })

    // Calculate statistics
    const totalQuantity = filteredProductions.reduce((sum, p) => sum + p.quantity, 0)
    const totalFamilies = new Set(filteredProductions.flatMap((p) => p.benefitedFamilies.map((f) => f.familyId))).size

    let totalCalories = 0
    let totalProtein = 0
    const vitamins = new Set<string>()

    filteredProductions.forEach((prod) => {
      const cropKey = prod.crop.toLowerCase()
      const nutritionalData = nutritionalDatabase[cropKey] || nutritionalDatabase.outros
      totalCalories += (prod.quantity * nutritionalData.caloriesPerKg) / 1000
      totalProtein += (prod.quantity * nutritionalData.proteinPerKg) / 1000
      nutritionalData.vitamins.forEach((v) => vitamins.add(v))
    })

    // Calculate environmental impact
    const co2Saved = totalQuantity * 0.5 // Estimate: 0.5kg CO2 saved per kg produced locally
    const waterSaved = totalQuantity * 25 // Estimate: 25L water saved per kg vs conventional farming

    // Create PDF content
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório - Horta Comunitária</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #16a34a; border-bottom: 3px solid #16a34a; padding-bottom: 10px; }
    h2 { color: #15803d; margin-top: 30px; border-bottom: 2px solid #86efac; padding-bottom: 5px; }
    .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; }
    .stat-label { font-size: 12px; color: #15803d; font-weight: bold; text-transform: uppercase; }
    .stat-value { font-size: 24px; color: #16a34a; font-weight: bold; margin-top: 5px; }
    .crop-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .crop-table th, .crop-table td { border: 1px solid #d9d9d9; padding: 10px; text-align: left; }
    .crop-table th { background: #16a34a; color: white; }
    .crop-table tr:nth-child(even) { background: #f0fdf4; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #d9d9d9; padding-top: 20px; }
  </style>
</head>
<body>
  <h1>Relatório da Horta Comunitária</h1>
  <p><strong>Período:</strong> ${startDate ? new Date(startDate).toLocaleDateString("pt-BR") : "Início"} até ${endDate ? new Date(endDate).toLocaleDateString("pt-BR") : "Hoje"}</p>
  <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>

  <h2>Resumo da Produção</h2>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Total Produzido</div>
      <div class="stat-value">${totalQuantity.toFixed(1)} kg</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Famílias Beneficiadas</div>
      <div class="stat-value">${totalFamilies}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Canteiros Ativos</div>
      <div class="stat-value">${plots.filter((p) => p.status === "active").length}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Mutirões Realizados</div>
      <div class="stat-value">${workdays.length}</div>
    </div>
  </div>

  <h2>Dados Nutricionais</h2>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">Calorias Totais</div>
      <div class="stat-value">${totalCalories.toFixed(0)} kcal</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Proteínas Totais</div>
      <div class="stat-value">${totalProtein.toFixed(1)} g</div>
    </div>
  </div>
  <p><strong>Vitaminas e Nutrientes Fornecidos:</strong> ${Array.from(vitamins).join(", ")}</p>

  <h2>Impacto Ambiental</h2>
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-label">CO₂ Evitado</div>
      <div class="stat-value">${co2Saved.toFixed(1)} kg</div>
      <p style="font-size: 11px; margin-top: 5px; color: #15803d;">Produção local reduz transporte</p>
    </div>
    <div class="stat-card">
      <div class="stat-label">Água Economizada</div>
      <div class="stat-value">${waterSaved.toFixed(0)} L</div>
      <p style="font-size: 11px; margin-top: 5px; color: #15803d;">vs. agricultura convencional</p>
    </div>
  </div>

  <h2>Detalhamento por Cultivo</h2>
  <table class="crop-table">
    <thead>
      <tr>
        <th>Cultivo</th>
        <th>Quantidade (kg)</th>
        <th>Colheitas</th>
        <th>Calorias (kcal)</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(
        filteredProductions.reduce(
          (acc, p) => {
            const crop = p.crop
            if (!acc[crop]) acc[crop] = { quantity: 0, count: 0 }
            acc[crop].quantity += p.quantity
            acc[crop].count += 1
            return acc
          },
          {} as Record<string, { quantity: number; count: number }>,
        ),
      )
        .map(([crop, data]) => {
          const nutritionalData = nutritionalDatabase[crop.toLowerCase()] || nutritionalDatabase.outros
          const calories = (data.quantity * nutritionalData.caloriesPerKg) / 1000
          return `
          <tr>
            <td>${crop}</td>
            <td>${data.quantity.toFixed(1)}</td>
            <td>${data.count}</td>
            <td>${calories.toFixed(0)}</td>
          </tr>`
        })
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <p>Relatório gerado pelo Sistema de Gestão de Hortas Comunitárias</p>
    <p>Promovendo agricultura urbana sustentável e segurança alimentar</p>
  </div>
</body>
</html>
    `

    // Create blob and download
    const blob = new Blob([pdfContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-horta-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Gerar Relatório</h2>
            <p className="text-sm text-muted-foreground">Selecione o período para análise</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h3 className="font-medium text-sm">O relatório incluirá:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Resumo da produção total e famílias beneficiadas</li>
            <li>Dados nutricionais (calorias, proteínas, vitaminas)</li>
            <li>Impacto ambiental (CO₂ evitado, água economizada)</li>
            <li>Detalhamento por cultivo e estatísticas de mutirões</li>
          </ul>
        </div>

        <Button onClick={generatePDF} className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Gerar Relatório HTML
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          O arquivo HTML pode ser aberto no navegador e impresso como PDF
        </p>
      </div>
    </Card>
  )
}
