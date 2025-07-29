import type React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const runtime = 'edge'
export const metadata: Metadata = {
  title: 'EVEN Business Partner Registration',
  description:
    'Register as an EVEN direct/retail or wholesale/distributor partner. Complete our business registration form to get started.',
  icons: {
    icon: '/favicon.png',
  },
  generator: 'v0.dev',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
