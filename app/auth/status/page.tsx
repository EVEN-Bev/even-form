'use client'

import { useEffect, useState } from 'react'
import { createAuthClient } from '@/lib/auth'

export default function AuthStatusPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const supabase = createAuthClient()
        const { data, error } = await supabase.auth.getSession()

        setStatus({
          hasSession: !!data.session,
          user: data.session?.user?.email || null,
          error: error ? error.message : null,
        })
      } catch (err) {
        setStatus({
          error: err instanceof Error ? err.message : String(err),
        })
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Status</h1>

      {loading ? (
        <p>Checking authentication status...</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-md">
          <pre className="whitespace-pre-wrap">{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}

      <div className="mt-4">
        <a href="/dashboard" className="text-blue-500 hover:underline mr-4">
          Go to Dashboard
        </a>
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Go to Login
        </a>
      </div>
    </div>
  )
}
