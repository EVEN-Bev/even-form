export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      business_records: {
        Row: {
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
        }
        Insert: {
          id?: string
          business_name: string
          business_street_address: string
          business_city: string
          business_state: string
          business_zip_code: string
          business_phone: string
          website_url?: string | null
          business_category: string
          subcategory: string
          other_subcategory?: string | null
          account_rep: string
          account_manager?: string | null
          location_count?: number | null
          outlet_types?: string[] | null
          other_outlet_description?: string | null
          why_sell_even?: string | null
          ein: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          business_street_address?: string
          business_city?: string
          business_state?: string
          business_zip_code?: string
          business_phone?: string
          website_url?: string | null
          business_category?: string
          subcategory?: string
          other_subcategory?: string | null
          account_rep?: string
          account_manager?: string | null
          location_count?: number | null
          outlet_types?: string[] | null
          other_outlet_description?: string | null
          why_sell_even?: string | null
          ein?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_states: {
        Row: {
          id: string
          business_id: string
          state_code: string
          state_name: string
          reseller_number: string
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          state_code: string
          state_name: string
          reseller_number: string
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          state_code?: string
          state_name?: string
          reseller_number?: string
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
