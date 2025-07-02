'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createAuthClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
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
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
              <div className="h-10 w-10 relative">
                <img
                  src="/even-logo.png"
                  alt="EVEN Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <CardDescription>
              We&apos;ve sent you a password reset email. Please check your inbox and follow the
              instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-900/20 border border-green-700 rounded-md">
              <p className="text-sm text-green-500">Password reset email sent successfully!</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-4">
            <Button
              onClick={() => router.push('/auth/login')}
              className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
            >
              Return to Login
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
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <div className="h-10 w-10 relative">
              <img src="/even-logo.png" alt="EVEN Logo" className="h-full w-full object-contain" />
            </div>
          </div>
          <CardDescription>Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
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
                  <span className="mr-2">Sending...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-border pt-4">
          <div className="text-center text-sm text-muted-foreground">
            <span>Remember your password? </span>
            <Link href="/auth/login" className="text-[#9D783C] hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
