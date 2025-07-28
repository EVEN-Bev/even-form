// Interface for database records
export interface BusinessState {
  id: string
  business_id: string
  state_code: string
  state_name: string
  reseller_number: string
  document_url: string | null
  created_at: string
  updated_at: string
}

// Extended interface for form submission with file upload fields
export interface BusinessStateWithFile {
  // Required fields for the database
  state_code: string
  state_name: string
  reseller_number: string

  // Optional fields for file upload
  fileData?: string // Base64 encoded file data
  fileName?: string // Original filename
  fileType?: string // MIME type
  fileSize?: number // File size in bytes

  // Client-side only fields (not sent to server)
  stateCode?: string // Duplicate of state_code for client usage
  stateName?: string // Duplicate of state_name for client usage
  resellerNumber?: string // Duplicate of reseller_number for client usage
  documentFile?: File | null // Original File object (browser only)
  fileError?: string // Error message if file upload fails
}

export interface BusinessRecord {
  id: string
  business_name: string
  business_street_address: string
  business_city: string
  business_state: string
  business_zip_code: string
  business_phone: string
  website_url: string | null
  business_category: string
  subcategory: string
  other_subcategory: string | null
  account_rep: string
  account_manager: string | null
  location_count: number | null
  outlet_types: string[] | null
  other_outlet_description: string | null
  why_sell_even: string | null
  ein: string
  created_at: string
  updated_at: string
  states?: BusinessState[]

  // Additional fields that get added dynamically from related tables
  contact_name?: string | null
  contact_email?: string | null
  contact_phone?: string | null
  account_managers?: Array<{
    id: string
    business_id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    is_main: boolean
    created_at: string
    updated_at: string
    shopify_customer_id: string
  }> | null
}

export interface BusinessFormData {
  businessName: string
  businessType: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  businessEmail: string
  businessWebsite: string
  businessEIN: string
  contactName: string
  contactTitle: string
  contactEmail: string
  contactPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  sameAsBusiness: boolean
  businessDescription: string
  additionalNotes: string
  states?: BusinessStateWithFile[]
  // Additional data for context that doesn't fit the original schema
  _additionalData?: {
    businessCategory?: string
    subcategory?: string
    otherSubcategory?: string
    accountRep?: string
    outletTypes?: string[]
    locationCount?: string | number
    additionalUsers?: Array<{
      firstName: string
      lastName: string
      email: string
      phone: string
    }>
  }
}
