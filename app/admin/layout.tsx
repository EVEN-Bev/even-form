"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  )
}
