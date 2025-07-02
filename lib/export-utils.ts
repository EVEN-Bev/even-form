import type { BusinessRecord, BusinessState } from '@/types/business-types'

// Convert array of objects to CSV string
export function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  // Get all unique keys from all objects
  const allKeys = new Set<string>()
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      // Skip the states array for CSV export
      if (key !== 'states' && key !== 'account_managers') {
        allKeys.add(key)
      }
    })
  })

  // Convert Set to Array and organize in a business-friendly order
  const orderedHeaders = [
    // Basic info
    'business_name',
    'business_street_address',
    'business_city',
    'business_state',
    'business_zip_code',
    'business_phone',
    'website_url',
    'ein',

    // Business category info
    'business_category',
    'subcategory',
    'other_subcategory',
    'account_rep',
    'location_count',

    // Contact info - primary
    'contact_name',
    'contact_email',
    'contact_phone',

    // Main account manager
    'main_account_manager_name',
    'main_account_manager_email',
    'main_account_manager_phone',

    // Additional account managers will be sorted together

    // Additional details
    'outlet_types',
    'other_outlet_description',
    'why_sell_even',

    // State details will be grouped together

    // Metadata
    'created_at',
    'updated_at',
    'id',
  ]

  // Get all headers that weren't in our ordered list
  const remainingHeaders = Array.from(allKeys).filter(key => !orderedHeaders.includes(key))

  // Group them by type
  const additionalManagerHeaders = remainingHeaders
    .filter(h => h.startsWith('additional_account_manager'))
    .sort()
  const stateHeaders = remainingHeaders.filter(h => h.startsWith('state_')).sort()
  const otherHeaders = remainingHeaders
    .filter(h => !h.startsWith('additional_account_manager') && !h.startsWith('state_'))
    .sort()

  // Combine all headers in the business-friendly order
  const headers = [
    ...orderedHeaders.filter(h => allKeys.has(h)),
    ...additionalManagerHeaders,
    ...stateHeaders,
    ...otherHeaders,
  ]

  // Create CSV header row
  const headerRow = headers.map(key => `"${key}"`).join(',')

  // Create data rows
  const rows = data.map(item => {
    return headers
      .map(key => {
        const value = item[key]

        // Handle different value types
        if (value === null || value === undefined) {
          return '""'
        } else if (Array.isArray(value)) {
          return `"${value.join('; ')}"`
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        } else {
          return `"${String(value).replace(/"/g, '""')}"`
        }
      })
      .join(',')
  })

  // Combine header and data rows
  return [headerRow, ...rows].join('\n')
}

// Transform business records for export with secured document links
// Extended type for export records with added properties
type BusinessRecordForExport = BusinessRecord & {
  state_documents?: string
  main_account_manager_name?: string
  main_account_manager_email?: string
  main_account_manager_phone?: string
  [key: string]: any
}

export function prepareBusinessRecordsForExport(
  records: BusinessRecord[]
): BusinessRecordForExport[] {
  return records.map(record => {
    // Create a new object with all fields from the record
    const exportRecord: BusinessRecordForExport = { ...record }

    // Process account managers into flattened columns
    if (record.account_managers && record.account_managers.length > 0) {
      // Find the main account manager
      const mainManager = record.account_managers.find(manager => manager.is_main)

      // Add main account manager fields
      if (mainManager) {
        exportRecord.main_account_manager_name = `${mainManager.first_name} ${mainManager.last_name}`
        exportRecord.main_account_manager_email = mainManager.email
        exportRecord.main_account_manager_phone = mainManager.phone
      }

      // Add additional account managers as separate columns
      const additionalManagers = record.account_managers.filter(manager => !manager.is_main)

      additionalManagers.forEach((manager, index) => {
        const fieldPrefix = `additional_account_manager_${index + 1}`
        exportRecord[`${fieldPrefix}_name`] = `${manager.first_name} ${manager.last_name}`
        exportRecord[`${fieldPrefix}_email`] = manager.email
        exportRecord[`${fieldPrefix}_phone`] = manager.phone
      })

      // Remove the original account_managers array so it doesn't appear in the CSV
      delete exportRecord.account_managers
    }

    // Add a direct public document URL for each state if available
    if (record.states && record.states.length > 0) {
      // Create an array of state records with direct public URLs
      const statesWithSecureLinks = record.states.map((state: BusinessState) => {
        if (state.document_url) {
          // Create a direct public URL to the document in Supabase storage
          const publicUrl = `https://qycfyruqxhypaaehyuvv.supabase.co/storage/v1/object/public/business-documents/${state.document_url}`
          return {
            ...state,
            secure_document_link: publicUrl,
          }
        }
        return state
      })

      // Instead of keeping the states array, process each state into separate columns
      const stateDocumentUrls: string[] = []

      statesWithSecureLinks.forEach((state: any, index: number) => {
        const statePrefix = `state_${index + 1}`
        exportRecord[`${statePrefix}_code`] = state.state_code
        exportRecord[`${statePrefix}_name`] = state.state_name
        exportRecord[`${statePrefix}_reseller_number`] = state.reseller_number

        if (state.secure_document_link) {
          // The secure_document_link already has the full URL, so we don't need to prepend anything
          exportRecord[`${statePrefix}_document_url`] = state.secure_document_link
          stateDocumentUrls.push(`${state.state_name}: ${state.secure_document_link}`)
        }
      })

      // Add a field with all document URLs for convenience
      if (stateDocumentUrls.length > 0) {
        exportRecord.state_documents = stateDocumentUrls.join('\n')
      }

      // Remove the original states array so it doesn't appear in the CSV
      delete exportRecord.states
    }

    return exportRecord
  })
}

// Export data to CSV file
export function exportToCSV(data: BusinessRecord[], filename: string): void {
  // Prepare the data with secure document links
  const preparedData = prepareBusinessRecordsForExport(data)

  // Convert data to CSV string
  const csv = convertToCSV(preparedData)

  // Create a Blob with the CSV data
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

  // Create a download link
  const link = document.createElement('a')

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob)

  // Set link properties
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  // Add link to document
  document.body.appendChild(link)

  // Click the link to trigger download
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
