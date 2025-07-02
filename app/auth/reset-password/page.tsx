'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createAuthClient } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Check if user is in a password reset flow
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createAuthClient()
      const { data } = await supabase.auth.getSession()

      // If no session or not in password reset flow, redirect to login
      if (!data.session) {
        router.push('/auth/login')
      }
    }

    checkSession()
  }, [router])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const supabase = createAuthClient()

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      console.error('Password update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[rgb(9,9,11)] p-4">
        <Card className="w-full max-w-md border-border bg-[#1d1e1e] text-card-foreground shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Password Updated</CardTitle>
              <div className="h-10 w-10 relative">
                <img
                  src="/even-logo.png"
                  alt="EVEN Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <CardDescription>Your password has been successfully updated.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-900/20 border border-green-700 rounded-md">
              <p className="text-sm text-green-500">
                Password reset successful! You can now log in with your new password.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4">
            <Button
              onClick={() => router.push('/auth/login')}
              className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(9,9,11)] p-4">
      <Card className="w-full max-w-md border-border bg-[#1d1e1e] text-card-foreground shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
            <div className="h-10 w-10 relative">
              <img src="/even-logo.png" alt="EVEN Logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <CardDescription>Enter and confirm your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-none"
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="rounded-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2">Updating...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
