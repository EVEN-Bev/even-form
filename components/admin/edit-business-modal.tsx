'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { BusinessRecord } from '@/types/business-types'

interface EditBusinessModalProps {
  record: BusinessRecord
  onClose: () => void
  onUpdate: (data: Partial<BusinessRecord>) => Promise<boolean>
}

// Form schema
const formSchema = z.object({
  business_name: z.string().min(2, { message: 'Business name is required' }),
  business_street_address: z.string().min(5, { message: 'Street address is required' }),
  business_city: z.string().min(2, { message: 'City is required' }),
  business_state: z.string().min(2, { message: 'State is required' }),
  business_zip_code: z.string().min(5, { message: 'ZIP code is required' }),
  business_phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  website_url: z.string().url({ message: 'Please enter a valid URL' }).or(z.string().length(0)),
  business_category: z.string().min(1, { message: 'Please select a business category' }),
  subcategory: z.string().min(1, { message: 'Please select a subcategory' }),
  other_subcategory: z
    .string()
    .optional()
    .refine(
      val => {
        if (val === undefined) return true
        return val.length > 0
      },
      { message: 'Please specify the subcategory' }
    ),
  account_rep: z.string().min(1, { message: 'Please select an account representative' }),
  location_count: z
    .string()
    .optional()
    .refine(
      val => {
        if (val === undefined) return true
        return val.length > 0 && Number.parseInt(val) > 0
      },
      { message: 'Please enter a valid number of locations' }
    ),
  outlet_types: z.array(z.string()).optional(),
  other_outlet_description: z.string().optional(),
  why_sell_even: z.string().optional(),
  ein: z.string().min(9, { message: 'Please enter a valid EIN' }),
})

// Business categories
const businessCategories = [
  { id: 'direct-retail', label: 'Direct / Retail' },
  { id: 'wholesale-distributor', label: 'Wholesale / Distributor' },
]

// Subcategories
const wholesaleSubcategories = [
  { id: 'bar-nightclub', label: 'Bar / Nightclub' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'liquor-store', label: 'Liquor Store' },
  { id: 'grocery-store', label: 'Grocery Store' },
  { id: 'event-coordinator', label: 'Event Coordinator' },
  { id: 'golf-course', label: 'Golf Course' },
  { id: 'catering', label: 'Catering' },
  { id: 'other', label: 'Other' },
]

const distributorSubcategories = [
  { id: 'beverage', label: 'Beverage Distributor' },
  { id: 'foodservice', label: 'Foodservice Distributor' },
  { id: 'other', label: 'Other' },
]

// Outlet types
const outletTypes = [
  { id: 'bar-nightclub', label: 'Bar / Nightclub' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'liquor-store', label: 'Liquor Store' },
  { id: 'grocery-store', label: 'Grocery Store' },
  { id: 'events', label: 'Events' },
  { id: 'golf-courses', label: 'Golf Courses' },
  { id: 'sporting-events', label: 'Sporting Events' },
  { id: 'stadiums', label: 'Stadiums' },
  { id: 'cruise-lines', label: 'Cruise Lines' },
  { id: 'catering', label: 'Catering' },
  { id: 'other', label: 'Other' },
]

// Account representatives
const accountReps = [
  { id: 'alana-wigdahl', label: 'Alana Wigdahl' },
  { id: 'matt-vandelec', label: 'Matt Vandelec' },
  { id: 'james-ganino', label: 'James Ganino' },
  { id: 'no-rep', label: 'I Do Not Have A Rep' },
]

export function EditBusinessModal({ record, onClose, onUpdate }: EditBusinessModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Format phone number for display
  const formatPhoneNumber = (value: string): string => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) {
      return `(${digits}`
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  // Initialize form with record data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: record.business_name || '',
      business_street_address: record.business_street_address || '',
      business_city: record.business_city || '',
      business_state: record.business_state || '',
      business_zip_code: record.business_zip_code || '',
      business_phone: record.business_phone || '',
      website_url: record.website_url || '',
      business_category: record.business_category || '',
      subcategory: record.subcategory || '',
      other_subcategory: record.other_subcategory || '',
      account_rep: record.account_rep || '',
      location_count: record.location_count ? String(record.location_count) : '',
      outlet_types: record.outlet_types || [],
      other_outlet_description: record.other_outlet_description || '',
      why_sell_even: record.why_sell_even || '',
      ein: record.ein || '',
    },
  })

  // Watch form values for conditional rendering
  const watchBusinessCategory = form.watch('business_category')
  const watchSubcategory = form.watch('subcategory')
  const isDistributor = watchBusinessCategory === 'wholesale-distributor'
  const isWholesale = watchBusinessCategory === 'direct-retail'
  const isOtherSubcategory = watchSubcategory === 'other'

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setError(null)

      // Convert location_count to number
      const formattedValues = {
        ...values,
        location_count: values.location_count ? Number.parseInt(values.location_count) : null,
      }

      // Call the onUpdate function passed from parent
      const success = await onUpdate(formattedValues)

      if (success) {
        onClose()
      } else {
        setError('Failed to update business record. Please try again.')
      }
    } catch (err) {
      console.error('Error updating business record:', err)
      setError(
        `Failed to update business record: ${err instanceof Error ? err.message : String(err)}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}></div>

      <div className="fixed inset-6 z-50 bg-[#1d1e1e] border border-border overflow-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#1d1e1e] p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Business Record</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Business Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
                Basic Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter business name" {...field} />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(123) 456-7890"
                          value={formatPhoneNumber(field.value)}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '')
                            field.onChange(digits)
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_street_address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="business_state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage className="text-[#9D783C]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_zip_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage className="text-[#9D783C]" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EIN</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XX-XXXXXXX"
                          value={
                            field.value
                              ? `${field.value.slice(0, 2)}${field.value.length > 2 ? '-' : ''}${field.value.slice(2, 9)}`
                              : ''
                          }
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '')
                            field.onChange(digits)
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Business Category */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
                Business Category
              </h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="business_category"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Retail Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {businessCategories.map(category => (
                            <FormItem
                              key={category.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={category.id}
                                  className="border-[#9D783C] text-[#9D783C]"
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{category.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                {watchBusinessCategory && (
                  <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isWholesale ? 'Direct / Retail Type' : 'Wholesale / Distributor Type'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none">
                              <SelectValue
                                placeholder={`Select ${isWholesale ? 'direct / retail' : 'wholesale / distributor'} type`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(isWholesale ? wholesaleSubcategories : distributorSubcategories).map(
                              subcat => (
                                <SelectItem key={subcat.id} value={subcat.id}>
                                  {subcat.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[#9D783C]" />
                      </FormItem>
                    )}
                  />
                )}

                {isOtherSubcategory && (
                  <FormField
                    control={form.control}
                    name="other_subcategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${isWholesale ? 'direct / retail' : 'wholesale / distributor'} type`}
                            className="rounded-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#9D783C]" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="account_rep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EVEN Account Representative</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none">
                            <SelectValue placeholder="Select account representative" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountReps.map(rep => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Additional Details */}
            <section className="space-y-4">
              <h3 className="text-lg font-medium text-[#9D783C] border-b border-border pb-2">
                Additional Details
              </h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="location_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Locations</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" className="rounded-none" {...field} />
                      </FormControl>
                      <FormMessage className="text-[#9D783C]" />
                    </FormItem>
                  )}
                />

                {isDistributor && (
                  <>
                    <FormField
                      control={form.control}
                      name="outlet_types"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              What kind of outlets do you serve?
                            </FormLabel>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {outletTypes.map(item => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="outlet_types"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={checked => {
                                            const newValue = checked
                                              ? [...(field.value || []), item.id]
                                              : field.value?.filter(value => value !== item.id)
                                            field.onChange(newValue)
                                          }}
                                          className="border-[#9D783C] data-[state=checked]:bg-[#9D783C] data-[state=checked]:text-white"
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage className="text-[#9D783C]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="other_outlet_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>If Other, please specify</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe other outlet types"
                              className="resize-none rounded-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[#9D783C]" />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {isWholesale && (
                  <FormField
                    control={form.control}
                    name="why_sell_even"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to sell EVEN?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us why you're interested in selling EVEN"
                            className="resize-none rounded-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#9D783C]" />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </section>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </form>
        </Form>

        <div className="sticky bottom-0 z-10 flex justify-end p-6 bg-[#1d1e1e] border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
