import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Link from "next/link"
import { Sprout } from "lucide-react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hortas Comunitárias - Gestão Colaborativa",
  description:
    "Plataforma para gestão de hortas comunitárias urbanas com controle de canteiros, voluntários, colheitas e distribuição.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
                <Sprout className="h-6 w-6 text-primary" />
                <span>Hortas Comunitárias</span>
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/voluntarios" className="text-sm hover:text-primary transition-colors">
                  Voluntários
                </Link>
                <Link href="/canteiros" className="text-sm hover:text-primary transition-colors">
                  Canteiros
                </Link>
                <Link href="/mutiroes" className="text-sm hover:text-primary transition-colors">
                  Mutirões
                </Link>
                <Link href="/producao" className="text-sm hover:text-primary transition-colors">
                  Produção
                </Link>
                <Link href="/familias" className="text-sm hover:text-primary transition-colors">
                  Famílias
                </Link>
                <Link href="/relatorios" className="text-sm hover:text-primary transition-colors">
                  Relatórios
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
