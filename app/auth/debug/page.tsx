'use client'

import { useState, useEffect } from 'react'
import { getAuthClient } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthDebugPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    setLoading(true)
    try {
      const supabase = getAuthClient()
      // @ts-ignore - We know this client exists in the browser context
      const { data, error } = await supabase.auth.getSession()

      setSessionData({
        hasSession: !!data.session,
        sessionData: data.session,
        error: error ? error.message : null,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setSessionData({
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = getAuthClient()
      // @ts-ignore - We know this client exists in the browser context
      await supabase.auth.signOut()
      await checkSession()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleHardRedirect = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(9,9,11)] p-4">
      <Card className="w-full max-w-3xl border-border bg-[#1d1e1e] text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkSession} variant="outline">
              Refresh Session Data
            </Button>
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
            <Button onClick={handleHardRedirect}>Hard Redirect to Dashboard</Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-8 w-8 border-4 border-t-[#9D783C] border-r-[#9D783C] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-4 bg-gray-800 rounded-md overflow-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <a href="/auth/login" className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-center">
              Go to Login Page
            </a>
            <a href="/dashboard" className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-center">
              Go to Dashboard
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
