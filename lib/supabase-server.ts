import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

// Get the server client - only use this in Server Components or Server Actions
export const getServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
