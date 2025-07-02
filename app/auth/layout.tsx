import type React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EVEN Admin Authentication',
  description: 'Authentication portal for EVEN business partner management dashboard.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
