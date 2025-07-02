'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from('business_records').select('id').limit(1)

        if (error) {
          console.error('Connection check error:', error)
          setIsConnected(false)
        } else {
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Connection check error:', err)
        setIsConnected(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [supabase])

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isLoading ? (
        <>
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
          Checking connection...
        </>
      ) : isConnected ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          Database connection is active
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Database connection error
        </>
      )}
    </div>
  )
}
