import type React from 'react'
import type { Metadata } from 'next'
import { DashboardHeader } from '@/components/admin/dashboard-header'
import { getServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const runtime = 'edge'
export const metadata: Metadata = {
  title: 'EVEN Admin Dashboard',
  description:
    'Secure admin dashboard for managing EVEN business partner records and applications.',
  icons: {
    icon: '/favicon.png',
  },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    // Create a new supabase server client
    const supabase = getServerClient()

    // Get the user's session
    const { data, error } = await supabase.auth.getSession()

    // If there's an error or no session, redirect to login
    if (error || !data.session) {
      // Use a relative URL to avoid issues with different environments
      redirect('/auth/login')
    }

    // If the user is logged in, render the dashboard layout
    return (
      <div className="flex min-h-screen flex-col bg-[rgb(9,9,11)]">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </div>
    )
  } catch (error) {
    // If there's any error, redirect to login
    console.error('Dashboard layout error:', error)
    redirect('/auth/login')
  }
}
