'use server'

import { revalidatePath } from 'next/cache'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getServerClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'
import { sendBusinessRecordEmail } from '@/lib/email-utils'
import type { BusinessFormData } from '@/types/business-types'
import { shopifyCreateCustomer } from '@/actions/shopify-create-customer'

// Name of the storage bucket
const STORAGE_BUCKET = 'business-documents'

/**
 * Generate a signed URL for a file path
 * This can be called whenever you need to access a file, even weeks/months later
 */
export async function getFileSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    // Use admin client to bypass RLS policies
    const supabase = getAdminClient()

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      console.error(`Error creating signed URL for ${filePath}:`, error)
      return null
    }

    return data?.signedUrl || null
  } catch (error) {
    console.error('Error in getFileSignedUrl:', error)
    return null
  }
}

/**
 * Simple function to decode base64 data to binary for Supabase upload
 */
function base64ToBuffer(base64String: string): { buffer: Buffer; type: string } {
  // Extract MIME type and base64 data
  const matches = base64String.match(/^data:(.+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format')
  }

  const type = matches[1]
  const base64 = matches[2]

  // Convert base64 to Buffer (Node.js Buffer works with Supabase)
  const buffer = Buffer.from(base64, 'base64')

  return { buffer, type }
}

/**
 * Upload a base64 file to Supabase storage and return the file path
 * (not the URL - we'll generate signed URLs on demand)
 */
async function uploadFile(
  supabase: SupabaseClient,
  base64Data: string,
  bucketName: string,
  filePath: string
): Promise<string | null> {
  try {
    // Skip if no file data
    if (!base64Data) return null

    console.log(`Uploading file to ${bucketName}/${filePath}`)

    // Convert base64 to buffer
    const { buffer, type } = base64ToBuffer(base64Data)

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
      contentType: type,
      upsert: true,
    })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    // Return the file path instead of a URL
    // This allows us to generate fresh signed URLs whenever needed
    return filePath
  } catch (error) {
    console.error('Error in uploadFile:', error)
    return null
  }
}

export async function submitBusinessForm(formData: BusinessFormData) {
  try {
    console.log('Submitting business form')

    // Initialize Supabase client for database operations
    const supabase = getServerClient()

    // Initialize admin client for storage operations
    const adminSupabase = getAdminClient()

    // Create primary account manager in Shopify
    const { data: customerData, errors: createCustomerErrors } = await shopifyCreateCustomer(
      true,
      formData.contactEmail,
      formData.contactPhone,
      formData.contactName.split(' ')[0] || '',
      formData.contactName.split(' ').slice(1).join(' ') || '',
      formData._additionalData?.businessCategory || '',
      formData.businessAddress,
      formData.businessCity,
      formData.businessState,
      formData.businessPhone,
      formData.businessZip,
      formData.businessName
    )

    if (createCustomerErrors) {
      console.error(
        `Error inserting customer record for ${formData.contactEmail}:`,
        createCustomerErrors
      )
      return { success: false, error: createCustomerErrors.message }
    }

    if (customerData.customerCreate.userErrors[0]?.message) {
      console.error(
        `Error inserting customer record for ${formData.contactEmail}:`,
        customerData.customerCreate.userErrors[0].message
      )
      return {
        success: false,
        error:
          customerData.customerCreate.userErrors[0].message +
          ` for the user '${formData.contactEmail}'`,
      }
    }

    let additionalShopifyCustomerAccounts = null

    // Create additional managers in Shopify
    if (
      formData._additionalData?.additionalUsers &&
      formData._additionalData.additionalUsers.length > 0
    ) {
      const submissionPromise = formData._additionalData.additionalUsers.map(
        async (user, index) => {
          const { data: customerData, errors: createAdditionalCustomerErrors } =
            await shopifyCreateCustomer(
              false, // Assuming 'false' for additional users based on your snippet
              user.email,
              user.phone,
              user.firstName,
              user.lastName,
              formData._additionalData?.businessCategory || '',
              formData.businessAddress,
              formData.businessCity,
              formData.businessState,
              formData.businessPhone,
              formData.businessZip,
              formData.businessName
            )
          if (createAdditionalCustomerErrors) {
            console.error(
              `Error inserting customer record for ${formData.contactEmail}:`,
              createCustomerErrors
            )
            return { success: false, error: createAdditionalCustomerErrors.message, data: null }
          }

          if (customerData.customerCreate.userErrors[0]?.message) {
            console.error(
              `Error inserting customer record for ${formData.contactEmail}:`,
              customerData.customerCreate.userErrors[0].message
            )
            return {
              success: false,
              error:
                customerData.customerCreate.userErrors[0].message +
                ` for the user '${formData.contactEmail}'`,
              data: null,
            }
          }

          return { success: true, error: null, data: customerData }
        }
      )

      additionalShopifyCustomerAccounts = await Promise.all(submissionPromise)
      const failedResults = additionalShopifyCustomerAccounts.filter(
        additionalShopifyCustomerAccounts => !additionalShopifyCustomerAccounts.success
      )

      if (failedResults.length > 0) {
        console.error('Some customers failed to create:', failedResults)
        const errorMessage = failedResults
          .map(additionalShopifyCustomerAccounts => additionalShopifyCustomerAccounts.error)
          .join('\n')
        return { success: false, error: errorMessage }
      }
    }

    // 1. Insert the business record first to get the ID
    const { data: businessRecord, error: businessError } = await supabase
      .from('business_records')
      .insert([
        {
          // Fields exactly matching the business_records table schema
          business_name: formData.businessName,
          business_street_address: formData.businessAddress,
          business_city: formData.businessCity || '',
          business_state: formData.businessState || '',
          business_zip_code: formData.businessZip || '',
          business_phone: formData.businessPhone,
          website_url: formData.businessWebsite || null,
          business_category: formData._additionalData?.businessCategory || '',
          subcategory: formData._additionalData?.subcategory || '',
          other_subcategory: formData._additionalData?.otherSubcategory || null,
          account_rep: formData._additionalData?.accountRep || '',
          account_manager: `${formData.contactName || ''}`,
          location_count: formData._additionalData?.locationCount
            ? parseInt(formData._additionalData.locationCount.toString())
            : null,
          outlet_types: formData._additionalData?.outletTypes || null,
          other_outlet_description: null,
          why_sell_even: formData.businessDescription || null,
          ein: formData.businessEIN || '',
        },
      ])
      .select()

    if (businessError) {
      console.error('Error inserting business record:', businessError)
      return { success: false, error: businessError.message }
    }

    if (!businessRecord || businessRecord.length === 0) {
      return { success: false, error: 'Failed to create business record' }
    }

    const businessId = businessRecord[0].id
    console.log(`Business record created with ID: ${businessId}`)

    // 2. Insert the main account manager
    const { error: managerError } = await supabase.from('account_managers').insert([
      {
        // Fields exactly matching the account_managers table schema
        business_id: businessId,
        first_name: formData.contactName.split(' ')[0] || '',
        last_name: formData.contactName.split(' ').slice(1).join(' ') || '',
        email: formData.contactEmail,
        phone: formData.contactPhone,
        is_main: true,
        shopify_customer_id: customerData.customerCreate.customer.id.split('/').pop(),
      },
    ])

    if (managerError) {
      console.error('Error inserting account manager:', managerError)
      // Continue with the process even if there's an error here
    } else {
      console.log('Main account manager inserted successfully')
    }

    // 3. Insert additional account managers to supabase if any
    if (
      formData._additionalData?.additionalUsers &&
      formData._additionalData.additionalUsers.length > 0
    ) {
      const additionalManagers = formData._additionalData.additionalUsers.map((user, index) => ({
        business_id: businessId,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone,
        is_main: false,
        shopify_customer_id: additionalShopifyCustomerAccounts
          ? additionalShopifyCustomerAccounts[index].data.customerCreate.customer.id
              .split('/')
              .pop()
          : null,
      }))

      const { error: additionalManagersError } = await supabase
        .from('account_managers')
        .insert(additionalManagers)

      if (additionalManagersError) {
        console.error('Error inserting additional managers:', additionalManagersError)
      } else {
        console.log(`Inserted ${additionalManagers.length} additional account managers`)
      }
    }

    // 4. Process state information and upload files if any
    if (formData.states && formData.states.length > 0) {
      console.log(`Processing ${formData.states.length} states with possible file uploads`)

      // Check if our storage bucket exists
      const { data: bucketData, error: bucketError } =
        await supabase.storage.getBucket(STORAGE_BUCKET)

      if (bucketError && bucketError.message.includes('does not exist')) {
        // Bucket doesn't exist, create it
        const { error: createBucketError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true, // Make bucket public so files can be accessed
          fileSizeLimit: 10485760, // 10MB limit per file
        })

        if (createBucketError) {
          console.error('Error creating storage bucket:', createBucketError)
        } else {
          console.log(`Created storage bucket: ${STORAGE_BUCKET}`)
        }
      }

      const stateRecordsPromises = formData.states.map(async state => {
        // Default record with no file
        const stateRecord: any = {
          business_id: businessId,
          state_code: state.state_code,
          state_name: state.state_name,
          reseller_number: state.reseller_number,
          document_url: null as string | null,
        }

        // If there's file data, upload it to Supabase storage
        if (state.fileData) {
          try {
            // Create a unique filename that's easy to identify without nested folders
            const fileName = `${businessId}_${state.state_code}_${Date.now()}`
            const fileExt = state.fileName ? state.fileName.split('.').pop() : 'pdf'
            const fullFileName = `${fileName}.${fileExt}`

            // Store directly at the root - no nested folders to worry about
            console.log(`Uploading file for state ${state.state_name} (${state.state_code})`)

            // Upload file to Supabase storage using admin client to bypass RLS
            const uploadedPath = await uploadFile(
              adminSupabase,
              state.fileData,
              STORAGE_BUCKET,
              fullFileName
            )

            if (uploadedPath) {
              console.log(`File uploaded successfully, path: ${uploadedPath}`)
              // Store just the filename - easier to retrieve later
              stateRecord.document_url = fullFileName
            }
          } catch (fileError) {
            console.error(`Error processing file for state ${state.state_code}:`, fileError)
          }
        }

        return stateRecord
      })

      // Wait for all state record processing to complete
      const stateRecords = await Promise.all(stateRecordsPromises)

      // Insert the state records into the database
      const { error: statesError } = await supabase.from('business_states').insert(stateRecords)

      if (statesError) {
        console.error('Error inserting state records:', statesError)
      } else {
        console.log(`Inserted ${stateRecords.length} state records successfully`)
      }
    }

    // Revalidate the dashboard page to show the new record
    revalidatePath('/dashboard')

    // Get the full business record with related data for the email
    const { data: fullRecord, error: fetchError } = await supabase
      .from('business_records')
      .select(
        `
        *,
        states:business_states(*),
        account_managers(*)
      `
      )
      .eq('id', businessId)
      .single()

    if (!fetchError && fullRecord) {
      try {
        // Send notification emails
        // Send email to both Sumner and Laura

        switch (process.env.NODE_ENV) {
          case 'development':
            await sendBusinessRecordEmail(
              fullRecord,
              'sumner.erhard@evenbev.com',
              'sumner.erhard@evenbev.com'
            )
            break
          case 'test':
            await sendBusinessRecordEmail(
              fullRecord,
              'sumner.erhard@evenbev.com',
              'sumner.erhard@evenbev.com'
            )
            break
          case 'production':
            await sendBusinessRecordEmail(fullRecord, 'laura.bethea@evenbev.com')
            await sendBusinessRecordEmail(fullRecord, 'sumner.erhard@evenbev.com')
            break
          default:
            break
        }

        console.log('Notification emails sent successfully')
      } catch (emailError) {
        console.error('Error sending notification emails:', emailError)
        // Don't fail the submission if email fails
      }
    }

    return { success: true, data: businessRecord[0] }
  } catch (error) {
    console.error('Error in submitBusinessForm:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
