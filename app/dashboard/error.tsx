'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error)

    // Check if the error is related to authentication
    if (
      error.message?.includes('auth') ||
      error.message?.includes('session') ||
      error.message?.includes('unauthorized')
    ) {
      // Redirect to login page after a short delay
      const timer = setTimeout(() => {
        window.location.href = '/auth/login'
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [error])

  // This will briefly show while the redirect is happening
  // or if the error is not auth-related
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(9,9,11)] text-white p-4">
      <div className="w-full max-w-md p-6 bg-[#1d1e1e] border border-border rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Redirecting to login...</h1>
        <div className="flex justify-center">
          <div className="h-8 w-8 border-4 border-t-[#9D783C] border-r-[#9D783C] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}
