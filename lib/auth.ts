import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// For client components
export const createAuthClient = () => {
  return createClientComponentClient<Database>()
}

// Singleton pattern for client-side
let clientInstance: ReturnType<typeof createClientComponentClient> | null = null

export const getAuthClient = () => {
  if (typeof window === 'undefined') {
    // Server-side: create a new instance
    return createAuthClient()
  }

  // Client-side: use singleton
  if (!clientInstance) {
    clientInstance = createAuthClient()
  }

  return clientInstance
}
