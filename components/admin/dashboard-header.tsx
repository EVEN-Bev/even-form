'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { ConnectionStatus } from './connection-status'
import { DebugImage } from '@/components/debug-image'

export function DashboardHeader() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      // Use window.location for a hard redirect to avoid Next.js router issues
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Error logging out:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-border bg-[#1d1e1e] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl">EVEN Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus />
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            Home
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  )
}
