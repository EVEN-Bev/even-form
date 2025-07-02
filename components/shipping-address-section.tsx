'use client'

import { useState, useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'

// US States for dropdown
const usStates = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
]

interface ShippingAddressSectionProps {
  form: UseFormReturn<any>
}

export default function ShippingAddressSection({ form }: ShippingAddressSectionProps) {
  // Local state for the shipping address
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  // Errors
  const [errors, setErrors] = useState({
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
  })

  // Initialize from form values if they exist
  useEffect(() => {
    try {
      const formValues = form.getValues()
      if (formValues.shippingAddress) {
        const address = formValues.shippingAddress
        if (address.addressLine1) setAddressLine1(address.addressLine1)
        if (address.addressLine2) setAddressLine2(address.addressLine2)
        if (address.city) setCity(address.city)
        if (address.state) setState(address.state)
        if (address.zipCode) setZipCode(address.zipCode)
      }
    } catch (error) {
      // Silent error handling
    }
  }, [form])

  // Update form values when local state changes
  useEffect(() => {
    try {
      // Validate fields
      const newErrors = {
        addressLine1: addressLine1.length < 5 ? 'Address line 1 is required' : '',
        city: city.length < 2 ? 'City is required' : '',
        state: state.length < 2 ? 'State is required' : '',
        zipCode: zipCode.length < 5 ? 'Valid ZIP code is required' : '',
      }

      setErrors(newErrors)

      // Update form values
      form.setValue('shippingAddress', {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
      })
    } catch (error) {
      // Silent error handling
    }
  }, [addressLine1, addressLine2, city, state, zipCode, form])

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Default Shipping Address</h3>
        <p className="text-muted-foreground">Please provide your primary shipping address.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Address Line 1 <span className="text-[#9D783C]">*</span>
          </label>
          <Input
            placeholder="Street address"
            className="rounded-none"
            value={addressLine1}
            onChange={e => setAddressLine1(e.target.value)}
          />
          {errors.addressLine1 && <p className="text-[#9D783C] text-sm">{errors.addressLine1}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Address Line 2 (Optional)</label>
          <Input
            placeholder="Apt, Suite, Building, etc."
            className="rounded-none"
            value={addressLine2}
            onChange={e => setAddressLine2(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              City <span className="text-[#9D783C]">*</span>
            </label>
            <Input
              placeholder="City"
              className="rounded-none"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            {errors.city && <p className="text-[#9D783C] text-sm">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              State <span className="text-[#9D783C]">*</span>
            </label>
            <select
              className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={state}
              onChange={e => setState(e.target.value)}
            >
              <option value="">Select state</option>
              {usStates.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-[#9D783C] text-sm">{errors.state}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            ZIP Code <span className="text-[#9D783C]">*</span>
          </label>
          <Input
            placeholder="ZIP Code"
            className="rounded-none"
            value={zipCode}
            onChange={e => setZipCode(e.target.value)}
          />
          {errors.zipCode && <p className="text-[#9D783C] text-sm">{errors.zipCode}</p>}
        </div>
      </div>
    </div>
  )
}
