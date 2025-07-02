import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Create a single supabase client for interacting with your database
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables for admin client')
    throw new Error('Missing Supabase environment variables for admin client')
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error('Error creating Supabase admin client:', error)
    throw new Error('Failed to initialize Supabase admin client')
  }
}

// Get the browser client
export const getBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for browser client')
    throw new Error('Missing Supabase environment variables for browser client')
  }

  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Error creating Supabase browser client:', error)
    throw new Error('Failed to initialize Supabase browser client')
  }
}

// Note: This function should only be used in server components
// We'll create a separate file for this to avoid importing next/headers in client components
