'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { BusinessRecord } from '@/types/business-types'

interface ViewBusinessModalProps {
  record: BusinessRecord
  onClose: () => void
}

export function ViewBusinessModal({ record, onClose }: ViewBusinessModalProps) {
  const mainManager = record.account_managers?.find(manager => manager.is_main)

  // Helper function to format array values
  const formatArrayValue = (value: string[] | null): string => {
    if (!value || value.length === 0) return 'None'
    return value.join(', ')
  }

  // Helper function to get category label
  const getCategoryLabel = (category: string): string => {
    return category === 'direct-retail' ? 'Direct / Retail' : 'Wholesale / Distributor'
  }

  // Helper function to get subcategory label
  const getSubcategoryLabel = (subcategory: string, category: string): string => {
    if (subcategory === 'other' && record.other_subcategory) {
      return record.other_subcategory
    }

    if (category === 'direct-retail') {
      const subcategories: Record<string, string> = {
        'bar-nightclub': 'Bar / Nightclub',
        restaurant: 'Restaurant',
        'liquor-store': 'Liquor Store',
        'grocery-store': 'Grocery Store',
        'event-coordinator': 'Event Coordinator',
        'golf-course': 'Golf Course',
        catering: 'Catering',
      }
      return subcategories[subcategory] || subcategory
    } else {
      const subcategories: Record<string, string> = {
        beverage: 'Beverage Distributor',
        foodservice: 'Foodservice Distributor',
      }
      return subcategories[subcategory] || subcategory
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}></div>

      <div className="fixed inset-6 z-50 bg-[#1d1e1e] border border-border overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#1d1e1e] p-6 border-b border-border">
          <h2 className="text-xl font-bold">Business Record Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Business Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              Basic Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Name</h4>
                <p className="text-base">{record.business_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Phone</h4>
                <p className="text-base">{record.business_phone}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Address</h4>
                <p className="text-base">
                  {record.business_street_address}, {record.business_city}, {record.business_state}{' '}
                  {record.business_zip_code}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Website URL</h4>
                <p className="text-base">
                  {record.website_url ? (
                    <a
                      href={record.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9D783C] hover:underline"
                    >
                      {record.website_url}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">EIN</h4>
                <p className="text-base">{record.ein}</p>
              </div>
            </div>
          </section>

          {/* Business Category */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              Business Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Retail Category</h4>
                <p className="text-base">{getCategoryLabel(record.business_category)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  {record.business_category === 'direct-retail'
                    ? 'Direct / Retail Type'
                    : 'Wholesale / Distributor Type'}
                </h4>
                <p className="text-base">
                  {getSubcategoryLabel(record.subcategory, record.business_category)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Account Representative
                </h4>
                <p className="text-base">{record.account_rep}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Number of Locations
                </h4>
                <p className="text-base">{record.location_count || 'Not specified'}</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              Contact Information
            </h3>

            {/* Main Contact */}
            <div className="border border-border p-4 rounded-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Main Contact</h4>
                {record.contact_name && (
                  <span className="bg-[#9D783C]/20 text-[#9D783C] text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">Name</h5>
                  <p className="text-base">{record.contact_name || 'Not specified'}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">Email</h5>
                  <p className="text-base">
                    {record.contact_email ? (
                      <a
                        href={`mailto:${record.contact_email}`}
                        className="text-[#9D783C] hover:underline"
                      >
                        {record.contact_email}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">Phone</h5>
                  <p className="text-base">
                    {record.contact_phone ? (
                      <a
                        href={`tel:${record.contact_phone}`}
                        className="text-[#9D783C] hover:underline"
                      >
                        {record.contact_phone}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-1">
                    Shopify Customer ID
                  </h5>
                  <p className="text-base">
                    {mainManager.shopify_customer_id ? (
                      <a
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_DOMAIN}/customers/${mainManager.shopify_customer_id}`}
                        className="text-[#9D783C] hover:underline"
                      >
                        View Customer Record
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Contacts */}
            {record.account_managers && record.account_managers.length > 1 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Additional Contacts</h4>
                <div className="space-y-3">
                  {record.account_managers
                    .filter(manager => !manager.is_main) // Only show non-main contacts here
                    .map((manager, index) => (
                      <div
                        key={manager.id || index}
                        className="border border-border p-4 rounded-sm"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-1">Name</h5>
                            <p className="text-base">
                              {`${manager.first_name} ${manager.last_name}`.trim()}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-1">
                              Email
                            </h5>
                            <p className="text-base">
                              {manager.email ? (
                                <a
                                  href={`mailto:${manager.email}`}
                                  className="text-[#9D783C] hover:underline"
                                >
                                  {manager.email}
                                </a>
                              ) : (
                                'Not specified'
                              )}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-1">
                              Phone
                            </h5>
                            <p className="text-base">
                              {manager.phone ? (
                                <a
                                  href={`tel:${manager.phone}`}
                                  className="text-[#9D783C] hover:underline"
                                >
                                  {manager.phone}
                                </a>
                              ) : (
                                'Not specified'
                              )}
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-1">
                              Shopify Customer ID
                            </h5>
                            <p className="text-base">
                              {manager.shopify_customer_id ? (
                                <a
                                  target="_blank"
                                  href={`${process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_DOMAIN}/customers/${manager.shopify_customer_id}`}
                                  className="text-[#9D783C] hover:underline"
                                >
                                  View Customer Record
                                </a>
                              ) : (
                                'Not specified'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* Additional Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              Additional Details
            </h3>

            {record.business_category === 'wholesale-distributor' && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Outlet Types</h4>
                <p className="text-base">{formatArrayValue(record.outlet_types)}</p>
                {record.outlet_types?.includes('other') && record.other_outlet_description && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Other Outlet Description
                    </h4>
                    <p className="text-base">{record.other_outlet_description}</p>
                  </div>
                )}
              </div>
            )}

            {record.business_category === 'direct-retail' && record.why_sell_even && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Why Sell EVEN</h4>
                <p className="text-base whitespace-pre-wrap">{record.why_sell_even}</p>
              </div>
            )}
          </section>

          {/* States */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              States
            </h3>

            {record.states && record.states.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {record.states.map(state => (
                  <div key={state.id} className="border border-border p-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{state.state_name}</h4>
                      <span className="text-sm text-muted-foreground">{state.state_code}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-1">
                          Reseller Number
                        </h5>
                        <p className="text-base">{state.reseller_number}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground mb-1">
                          Documentation
                        </h5>
                        {state.document_url ? (
                          <a
                            href={state.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#9D783C] hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="text-base">No document provided</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No states added</p>
            )}
          </section>

          {/* Metadata */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Submission Date</h4>
                <p className="text-base">{formatDate(record.created_at)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                <p className="text-base">{formatDate(record.updated_at)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Record ID</h4>
                <p className="text-base font-mono text-sm">{record.id}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 z-10 flex justify-end p-6 bg-[#1d1e1e] border-t border-border">
          <Button
            onClick={onClose}
            className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
