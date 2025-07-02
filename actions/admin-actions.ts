'use server'

import { getServerClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'
import type { BusinessRecord, BusinessState } from '@/types/business-types'

export async function fetchBusinessRecords(): Promise<{
  records: BusinessRecord[]
  error: string | null
}> {
  try {
    // Create Supabase clients
    const supabase = getServerClient()
    const adminSupabase = getAdminClient()

    // Fetch business records
    const { data: businessRecords, error: businessError } = await supabase
      .from('business_records')
      .select('*')
      .order('created_at', { ascending: false })

    if (businessError) {
      console.error('Error fetching business records:', businessError)
      return { records: [], error: businessError.message }
    }

    // If no records, return empty array
    if (!businessRecords || businessRecords.length === 0) {
      return { records: [], error: null }
    }

    // Process each business record
    const enhancedRecords = await Promise.all(
      businessRecords.map(async record => {
        try {
          // 1. Fetch account managers for this business
          const { data: accountManagers, error: managersError } = await supabase
            .from('account_managers')
            .select('*')
            .eq('business_id', record.id)
            .order('is_main', { ascending: false }) // Main contact first

          // Get main contact details
          const mainContact =
            accountManagers && accountManagers.length > 0
              ? accountManagers.find(manager => manager.is_main) || accountManagers[0]
              : null

          // 2. Fetch states for this business
          const { data: stateRecords, error: statesError } = await supabase
            .from('business_states')
            .select('*')
            .eq('business_id', record.id)

          if (statesError) {
            console.error(`Error fetching states for business ${record.id}:`, statesError)
          }

          // 3. Process document URLs for state records
          const statesWithSignedUrls = await Promise.all(
            (stateRecords || []).map(async (state: BusinessState) => {
              if (state.document_url) {
                try {
                  // Keep it simple - just use the filename directly
                  const bucket = 'business-documents'

                  // Extract just the filename from the URL/path
                  const filename = state.document_url.split('/').pop() || state.document_url

                  console.log(`Getting signed URL for document: ${filename} from bucket: ${bucket}`)

                  // Get a signed URL with admin client to bypass RLS policies
                  const { data: signedUrlData, error: urlError } = await adminSupabase.storage
                    .from(bucket)
                    .createSignedUrl(filename, 3600) // 1 hour expiry

                  if (urlError) {
                    console.error(`Error generating signed URL: ${urlError.message}`)
                    return state
                  }

                  return {
                    ...state,
                    document_url: signedUrlData?.signedUrl || state.document_url,
                  }
                } catch (urlError) {
                  console.error(
                    `Error generating signed URL for document ${state.document_url}:`,
                    urlError
                  )
                  return state
                }
              }
              return state
            })
          )

          // 4. Combine everything into an enhanced record
          return {
            ...record,
            // Add contact information
            contact_name: mainContact
              ? `${mainContact.first_name} ${mainContact.last_name}`.trim()
              : null,
            contact_email: mainContact?.email || null,
            contact_phone: mainContact?.phone || null,
            account_managers: accountManagers || [],
            // Add states with signed URLs
            states: statesWithSignedUrls || [],
          }
        } catch (err) {
          console.error(`Error processing business ${record.id}:`, err)
          return { ...record, states: [] }
        }
      })
    )

    return { records: enhancedRecords, error: null }
  } catch (err) {
    console.error('Unexpected error fetching business records:', err)
    return {
      records: [],
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    }
  }
}

// Improve the updateBusinessRecord function with better error handling and logging

export async function updateBusinessRecord(
  id: string,
  data: Partial<BusinessRecord>
): Promise<{ success: boolean; error: string | null }> {
  try {
    console.log('Server action: Updating business record', id, data)
    const supabase = getServerClient()

    // Remove any undefined values to prevent Supabase errors
    const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))

    const { error } = await supabase.from('business_records').update(cleanedData).eq('id', id)

    if (error) {
      console.error('Error updating business record:', error)
      return { success: false, error: error.message }
    }

    console.log('Business record updated successfully')
    return { success: true, error: null }
  } catch (err) {
    console.error('Unexpected error updating business record:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    }
  }
}
