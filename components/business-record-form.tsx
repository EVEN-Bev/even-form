'use client'

import type React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  CircleUserRound,
  AlertCircle,
} from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { StatesSelector, type StateWithReseller } from '@/components/state-selector'
import { submitBusinessForm } from '@/actions/submit-business-form'

// Custom FormLabel with required indicator
function RequiredFormLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <FormLabel>
      {children} <span className="text-[#9D783C]">*</span>
    </FormLabel>
  )
}

const businessCategories = [
  { id: 'direct-retail', label: 'Direct / Retail' },
  { id: 'wholesale-distributor', label: 'Wholesale / Distributor' },
]

const wholesaleSubcategories = [
  { id: 'bar-nightclub', label: 'Bar / Nightclub' },
  { id: 'catering', label: 'Catering' },
  { id: 'cruise-line', label: 'Cruise Line' },
  { id: 'event-coordinator', label: 'Event Coordinator' },
  { id: 'golf-course', label: 'Golf Course' },
  { id: 'grocery-store', label: 'Grocery Store' },
  { id: 'liquor-store', label: 'Liquor Store' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'stadium', label: 'Stadium' },
  { id: 'other', label: 'Other' },
]

const distributorSubcategories = [
  { id: 'beverage', label: 'Beverage Distributor' },
  { id: 'foodservice', label: 'Foodservice Distributor' },
  { id: 'other', label: 'Other' },
]

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
  { id: 'alana-wigdahl', label: 'Alana Wigdahl', image: '/images/alana-wigdahl.png' },
  { id: 'matt-vandelec', label: 'Matt Vandelec', image: '/images/matt-vandelec.png' },
  { id: 'james-ganino', label: 'James Ganino', image: '/images/james-ganino.png' },
  { id: 'derek-kuehl', label: 'Derek Kuehl', image: '/images/derek.jpeg' },
  { id: 'no-rep', label: "I don't have a rep", image: null },
]

// Format phone number as (XXX) XXX-XXXX
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

// US States list for dropdown
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
]

// Form schema with validation - with separate address fields
const formSchema = z.object({
  // Step 1: Basic Business Information
  businessName: z.string().min(2, { message: 'Business name is required' }),
  // Field names matching the database schema fields business_street_address, business_city, etc.
  businessStreetAddress: z.string().min(5, { message: 'Street address is required' }),
  businessCity: z.string().min(2, { message: 'City is required' }),
  businessState: z.string().min(2, { message: 'State is required' }),
  businessZipCode: z.string().min(5, { message: 'ZIP code is required' }),
  businessPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  websiteUrl: z.string().url({ message: 'Please enter a valid URL' }).or(z.string().length(0)),

  // Step 2: Business Category
  businessCategory: z.string().min(1, { message: 'Please select a business category' }),
  subcategory: z.string().min(1, { message: 'Please select a subcategory' }),
  otherSubcategory: z
    .string()
    .optional()
    .refine(
      val => {
        if (val === undefined) return true
        return val.length > 0
      },
      { message: 'Please specify the subcategory' }
    ),
  accountRep: z.string().min(1, { message: 'Please select an account representative' }),

  // Step 3: Conditional Fields
  locationCount: z
    .string()
    .optional()
    .refine(
      val => {
        if (val === undefined) return true
        return val.length > 0 && Number.parseInt(val) > 0
      },
      { message: 'Please enter a valid number of locations' }
    ),
  outletTypes: z
    .array(z.string())
    .min(1, { message: 'Please select at least one outlet type' })
    .optional(),
  otherOutletDescription: z.string().optional(),
  whySellEven: z
    .string()
    .min(10, { message: 'Please provide a reason for selling EVEN' })
    .optional(),

  // Step 4: Tax and Legal Information
  ein: z.string().min(9, { message: 'Please enter a valid EIN' }),

  // Step 5: Account Information
  mainContactFirstName: z.string().min(2, { message: 'First name is required' }),
  mainContactLastName: z.string().min(2, { message: 'Last name is required' }),
  mainContactEmail: z.string().email({ message: 'Please enter a valid email address' }),
  mainContactPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
})

export default function BusinessRecordForm() {
  const [step, setStep] = useState(1)
  const totalSteps = 7 // Updated to 7 steps (5 input steps + summary + success)
  const progressPercentage = Math.round(((step - 1) / (totalSteps - 2)) * 100) // Exclude success page from progress
  const [selectedStates, setSelectedStates] = useState<StateWithReseller[]>([])
  const [statesError, setStatesError] = useState<string | undefined>(undefined)
  const [isStepValid, setIsStepValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submissionId, setSubmissionId] = useState<string>('')
  const [additionalUsers, setAdditionalUsers] = useState<
    Array<{
      firstName: string
      lastName: string
      email: string
      phone: string
    }>
  >([])

  // Create a wrapped version of setSelectedStates
  const wrappedSetSelectedStates = useCallback(
    (newStates: StateWithReseller[] | ((prev: StateWithReseller[]) => StateWithReseller[])) => {
      setSelectedStates(prevStates => {
        const updatedStates = typeof newStates === 'function' ? newStates(prevStates) : newStates
        return updatedStates
      })
    },
    []
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      businessStreetAddress: '',
      businessCity: '',
      businessState: '',
      businessZipCode: '',
      businessPhone: '',
      websiteUrl: '',

      businessCategory: '',
      subcategory: '',
      otherSubcategory: '',
      accountRep: '',

      locationCount: '',
      outletTypes: [],
      otherOutletDescription: '',
      whySellEven: '',

      ein: '',

      mainContactFirstName: '',
      mainContactLastName: '',
      mainContactEmail: '',
      mainContactPhone: '',
    },
    mode: 'onChange', // Validate on change for real-time feedback
  })

  const watchBusinessCategory = form.watch('businessCategory')
  const watchSubcategory = form.watch('subcategory')
  const formState = form.formState

  const isDistributor = watchBusinessCategory === 'wholesale-distributor'
  const isWholesale = watchBusinessCategory === 'direct-retail'
  const isOtherSubcategory = watchSubcategory === 'other'

  // Reset subcategory when business category changes
  useEffect(() => {
    form.setValue('subcategory', '')
    form.setValue('otherSubcategory', '')
  }, [watchBusinessCategory, form])

  // Set up specific field watchers for each step
  useEffect(() => {
    // Set up subscription for specific fields based on current step
    let subscription: ReturnType<typeof form.watch>

    if (step === 1) {
      subscription = form.watch((value, { name }) => {
        if (
          name &&
          ['businessName', 'businessStreetAddress', 'businessPhone', 'websiteUrl'].includes(name)
        ) {
          validateCurrentStep()
        }
      })
    } else if (step === 2) {
      subscription = form.watch((value, { name }) => {
        if (
          name &&
          ['businessCategory', 'subcategory', 'otherSubcategory', 'accountRep'].includes(name)
        ) {
          validateCurrentStep()
        }
      })
    } else if (step === 3) {
      subscription = form.watch((value, { name }) => {
        if (name && ['locationCount', 'outletTypes', 'whySellEven'].includes(name)) {
          validateCurrentStep()
        }
      })
    } else if (step === 4) {
      subscription = form.watch((value, { name }) => {
        if (name && ['ein'].includes(name)) {
          validateCurrentStep()
        }
      })
    } else if (step === 5) {
      subscription = form.watch((value, { name }) => {
        if (
          name &&
          [
            'mainContactFirstName',
            'mainContactLastName',
            'mainContactEmail',
            'mainContactPhone',
          ].includes(name)
        ) {
          validateCurrentStep()
        }
      })
    }

    return () => subscription?.unsubscribe()
  }, [step])

  // Add a separate effect to validate when selectedStates changes
  useEffect(() => {
    if (step === 4) {
      validateCurrentStep()
    }
  }, [selectedStates, step])

  // Validate on step change
  useEffect(() => {
    validateCurrentStep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Helper function to convert a File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Function to validate the current step
  const validateCurrentStep = () => {
    let isValid = true

    // Check specific fields for each step
    if (step === 1) {
      const businessName = form.getValues('businessName')
      const businessStreetAddress = form.getValues('businessStreetAddress')
      const businessPhone = form.getValues('businessPhone')

      isValid =
        businessName.length >= 2 && businessStreetAddress.length >= 5 && businessPhone.length >= 10
    } else if (step === 2) {
      const businessCategory = form.getValues('businessCategory')
      const subcategory = form.getValues('subcategory')
      const otherSubcategory = form.getValues('otherSubcategory')
      const accountRep = form.getValues('accountRep')

      isValid = businessCategory.length > 0 && subcategory.length > 0 && accountRep.length > 0

      // If "other" is selected, check that the other field is filled
      if (subcategory === 'other') {
        const otherValid = (otherSubcategory?.length || 0) > 0
        isValid = isValid && otherValid
      }
    } else if (step === 3) {
      if (isDistributor) {
        const locationCount = form.getValues('locationCount') || ''
        const outletTypes = form.getValues('outletTypes') || []

        isValid =
          locationCount.length > 0 &&
          Number.parseInt(locationCount || '0') > 0 &&
          outletTypes.length > 0
      } else if (isWholesale) {
        const locationCount = form.getValues('locationCount') || ''
        const whySellEven = form.getValues('whySellEven') || ''

        isValid =
          locationCount.length > 0 &&
          Number.parseInt(locationCount || '0') > 0 &&
          whySellEven.length >= 10
      }
    } else if (step === 4) {
      const ein = form.getValues('ein')
      const statesValid = validateStates(false)

      isValid = ein.length >= 9 && statesValid
    } else if (step === 5) {
      // Validate account contact information
      const mainFirstName = form.getValues('mainContactFirstName')
      const mainLastName = form.getValues('mainContactLastName')
      const mainEmail = form.getValues('mainContactEmail')
      const mainPhone = form.getValues('mainContactPhone')

      isValid =
        mainFirstName.length >= 2 &&
        mainLastName.length >= 2 &&
        mainEmail.includes('@') &&
        mainEmail.includes('.') &&
        mainPhone.length >= 10

      // Validate additional contacts if any
      const invalidUsers = additionalUsers.filter(
        user =>
          !user.firstName || !user.lastName || !user.email || !user.phone || user.phone.length < 10
      )

      if (invalidUsers.length > 0) {
        isValid = false
      }
    } else if (step === 6) {
      // Summary page is always valid
      isValid = true
    }

    // Only update state if the validation result has changed
    if (isStepValid !== isValid) {
      setIsStepValid(isValid)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Final validation for states
    if (step === 4 && !validateStates(true)) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmissionError(null)

      console.log('Preparing form data and files for submission')

      // Process files: convert document files to base64
      const statesWithFileData = await Promise.all(
        selectedStates.map(async state => {
          // Default state record without file data
          const stateWithData = {
            ...state,
            // Convert to server-side expected format
            state_code: state.stateCode,
            state_name: state.stateName,
            reseller_number: state.resellerNumber,
            fileData: undefined as string | undefined,
          }

          // Process file if exists
          if (state.documentFile) {
            try {
              // Convert file to base64
              const fileData = await fileToBase64(state.documentFile)

              // Add file data to the state record
              stateWithData.fileData = fileData
              stateWithData.fileName = state.documentFile.name
              stateWithData.fileType = state.documentFile.type
              stateWithData.fileSize = state.documentFile.size

              console.log(`Prepared file for ${state.stateName}: ${state.documentFile.name}`)
            } catch (error) {
              console.error(`Error processing file for ${state.stateName}:`, error)
            }
          }

          return stateWithData
        })
      )

      // Format data to exactly match what our server expects
      const formData = {
        // Basic business information
        businessName: values.businessName,
        businessType: values.businessCategory === 'direct-retail' ? 'Retail' : 'Distributor',
        // Map our form fields to match what the submit function expects
        businessAddress: values.businessStreetAddress, // Map to what BusinessFormData interface expects
        businessCity: values.businessCity,
        businessState: values.businessState,
        businessZip: values.businessZipCode, // Map to what BusinessFormData interface expects
        businessPhone: values.businessPhone,
        businessEmail: values.mainContactEmail,
        businessWebsite: values.websiteUrl || '',
        businessEIN: values.ein,

        // Account manager information
        contactName: `${values.mainContactFirstName} ${values.mainContactLastName}`,
        contactEmail: values.mainContactEmail,
        contactPhone: values.mainContactPhone,
        contactTitle: 'Account Manager',

        // Shipping info (required by interface but not used)
        shippingAddress: values.businessStreetAddress,
        shippingCity: values.businessCity,
        shippingState: values.businessState,
        shippingZip: values.businessZipCode, // Using the same field naming pattern
        sameAsBusiness: true,

        // Business description (maps to why_sell_even in the database)
        businessDescription: values.whySellEven || '',
        additionalNotes: '', // Required by interface but not used

        // Process state data for Supabase storage file uploads
        states: statesWithFileData,

        // Additional data for context
        _additionalData: {
          // These fields map directly to database columns
          businessCategory: values.businessCategory,
          subcategory: values.subcategory,
          otherSubcategory: values.otherSubcategory || '',
          accountRep: values.accountRep,
          outletTypes: values.outletTypes || [],
          locationCount: values.locationCount || '',

          // Additional users for account_managers table
          additionalUsers: additionalUsers,
        },
      }

      // Submit the form data to the server action
      console.log('Submitting form data to server')
      const result = await submitBusinessForm(formData)

      if (result.success && result.data) {
        console.log('Form submitted successfully:', result.data.id)
        // Store the submission ID for display
        setSubmissionId(result.data.id)
        setSubmissionSuccess(true)
        setIsSubmitted(true)

        // Clear form data from localStorage after successful submission
        try {
          localStorage.removeItem('evenFormData')
          console.log('Form data cleared from local storage')
        } catch (e) {
          console.error('Failed to clear localStorage:', e)
        }

        // Immediately go to thank you page
        setStep(7)
      } else {
        console.error('Form submission failed:', result.error)
        setSubmissionError(result.error || 'An error occurred during submission')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmissionError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStates = (showErrors = true) => {
    let validationResult = true
    let errorMessage

    if (selectedStates.length === 0) {
      validationResult = false
      errorMessage = 'Please add at least one state'
    } else {
      // Check if all states have reseller numbers and documentation
      const invalidStates = selectedStates.filter(
        state => !state.resellerNumber || !state.documentFile || state.fileError
      )

      if (invalidStates.length > 0) {
        validationResult = false

        if (invalidStates.some(state => state.fileError)) {
          errorMessage = 'Please fix file format errors'
        } else {
          errorMessage = 'All states must have a reseller number and documentation'
        }
      }
    }

    if (showErrors) {
      setStatesError(errorMessage)
    }

    return validationResult
  }

  const nextStep = async () => {
    const fieldsToValidate = {
      1: [
        'businessName',
        'businessStreetAddress',
        'businessCity',
        'businessState',
        'businessZipCode',
        'businessPhone',
        'websiteUrl',
      ],
      2: [
        'businessCategory',
        'subcategory',
        'accountRep',
        ...(isOtherSubcategory ? ['otherSubcategory'] : []),
      ],
      3: isDistributor
        ? ['locationCount', 'outletTypes']
        : isWholesale
          ? ['locationCount', 'whySellEven']
          : [],
      4: ['ein'],
      5: ['mainContactFirstName', 'mainContactLastName', 'mainContactEmail', 'mainContactPhone'],
      6: [], // Summary page doesn't need validation
    }[step] as Array<keyof z.infer<typeof formSchema>>

    const isValid = await form.trigger(fieldsToValidate)

    // Additional validation for states in step 4
    if (step === 4 && isValid) {
      if (!validateStates(true)) {
        return
      }
    }

    if (isValid) {
      if (step === 6) {
        // Directly call onSubmit instead of going through form.handleSubmit
        // This ensures we control the submission flow
        onSubmit(form.getValues())
      } else {
        setStep(step + 1)
      }
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  // Format a value for display in the summary
  const formatSummaryValue = (value: any): string => {
    if (value === undefined || value === null || value === '') {
      return 'Not provided'
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return 'None selected'
      return value.join(', ')
    }

    return String(value)
  }

  // Get the label for a value from a list of options
  const getLabelForValue = (value: string, options: { id: string; label: string }[]): string => {
    const option = options.find(opt => opt.id === value)
    return option ? option.label : value
  }

  // Force validation on step change
  useEffect(() => {
    // Force validation when step changes
    setTimeout(() => {
      validateCurrentStep()
    }, 100)
  }, [step])

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto border-border bg-[#1d1e1e] text-card-foreground shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Direct / Retail & Wholesale / Distributor Application</CardTitle>
            <CardDescription>
              Please provide your business information to register as an EVEN direct / retail or
              wholesale / distributor partner.
            </CardDescription>
          </div>
          <div className="h-20 w-10 relative">
            <Image
              src="/even-logo.png"
              alt="EVEN Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </CardHeader>

        {step < 7 && (
          <div className="px-6 pb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-1 bg-secondary"
              indicatorClassName="bg-even"
            />
          </div>
        )}

        <CardContent className="pt-6">
          {step === 7 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-[#9D783C]/20 p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-[#9D783C]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Thank you for submitting your business information. Your application has been
                received and is being processed.
              </p>
              <p className="text-muted-foreground mb-6 max-w-md">
                An EVEN representative will contact you shortly to discuss next steps.
              </p>
              {submissionSuccess && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-md text-left w-full max-w-md">
                  <p className="text-sm text-green-500">
                    Form submitted successfully! Reference ID: {submissionId || 'No ID generated'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFormLabel>Official Business Name</RequiredFormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business name" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#9D783C]" />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-base font-medium">Business Address</h3>

                      <FormField
                        control={form.control}
                        name="businessStreetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <RequiredFormLabel>Street Address</RequiredFormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage className="text-[#9D783C]" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="businessCity"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <RequiredFormLabel>City</RequiredFormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessState"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <RequiredFormLabel>State</RequiredFormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {usStates.map(state => (
                                    <SelectItem key={state.value} value={state.value}>
                                      {state.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessZipCode"
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <RequiredFormLabel>ZIP Code</RequiredFormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFormLabel>Business Phone</RequiredFormLabel>
                          <FormControl>
                            <Input
                              placeholder="(123) 456-7890"
                              {...field}
                              value={field.value ? formatPhoneNumber(field.value) : ''}
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
                      name="websiteUrl"
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="accountRep"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFormLabel>EVEN Account Representative</RequiredFormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {accountReps.map(rep => (
                              <div
                                key={rep.id}
                                className={`relative flex ${rep.id === 'no-rep' ? 'flex-row items-center p-2 w-full whitespace-nowrap' : 'flex-col items-center p-4'} rounded cursor-pointer transition-colors ${field.value === rep.id ? 'bg-[#1A1A1A] border-2 border-[#9D783C]' : 'hover:bg-[#1A1A1A] hover:border-2 hover:border-[#9D783C] border-2 border-transparent'}`}
                                onClick={() => {
                                  field.onChange(rep.id)
                                  // Trigger validation on both the specific field and the entire step
                                  Promise.all([
                                    form.trigger('accountRep'),
                                    form.trigger([
                                      'businessCategory',
                                      'subcategory',
                                      'otherSubcategory',
                                      'accountRep',
                                    ]),
                                  ]).then(() => {
                                    validateCurrentStep()
                                  })
                                }}
                              >
                                {rep.id === 'no-rep' ? (
                                  <div className="w-full text-center">
                                    <div className="text-sm font-medium text-white">
                                      I don't have a rep
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden">
                                      <Image
                                        src={rep.image}
                                        alt={rep.label}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                      />
                                    </div>
                                    <div className="font-medium text-white">{rep.label}</div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <FormMessage className="text-[#9D783C]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessCategory"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <RequiredFormLabel>Retail Category</RequiredFormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={value => {
                                field.onChange(value)
                                // Trigger validation when changing business category
                                setTimeout(() => validateCurrentStep(), 100)
                              }}
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
                            <RequiredFormLabel>
                              {isWholesale
                                ? 'Direct / Retail Type'
                                : 'Wholesale / Distributor Type'}
                            </RequiredFormLabel>
                            <Select
                              onValueChange={value => {
                                field.onChange(value)
                                // Trigger validation when changing subcategory
                                setTimeout(() => validateCurrentStep(), 100)
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="rounded-none">
                                  <SelectValue
                                    placeholder={`Select ${isWholesale ? 'direct / retail' : 'wholesale / distributor'} type`}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(isWholesale
                                  ? wholesaleSubcategories
                                  : distributorSubcategories
                                ).map(subcat => (
                                  <SelectItem key={subcat.id} value={subcat.id}>
                                    {subcat.label}
                                  </SelectItem>
                                ))}
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
                        name="otherSubcategory"
                        render={({ field }) => (
                          <FormItem>
                            <RequiredFormLabel>Please specify</RequiredFormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${isWholesale ? 'direct / retail' : 'wholesale / distributor'} type`}
                                className="rounded-none"
                                {...field}
                                onChange={e => {
                                  field.onChange(e)
                                  // Force validation after input
                                  setTimeout(() => validateCurrentStep(), 100)
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-[#9D783C]" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    {(isDistributor || isWholesale) && (
                      <FormField
                        control={form.control}
                        name="locationCount"
                        render={({ field }) => (
                          <FormItem>
                            <RequiredFormLabel>
                              How many locations will you sell EVEN to?
                            </RequiredFormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                className="rounded-none"
                                {...field}
                                onChange={e => {
                                  field.onChange(e)
                                  // Force validation after input
                                  setTimeout(() => validateCurrentStep(), 100)
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-[#9D783C]" />
                          </FormItem>
                        )}
                      />
                    )}

                    {isDistributor && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="outletTypes"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <RequiredFormLabel className="text-base">
                                  What kind of outlets do you serve?
                                </RequiredFormLabel>
                                <FormDescription>Select all that apply</FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {outletTypes.map(item => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="outletTypes"
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
                                                // Force validation after checkbox change
                                                setTimeout(() => validateCurrentStep(), 100)
                                              }}
                                              className="border-[#9D783C] data-[state=checked]:bg-[#9D783C] data-[state=checked]:text-white"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {item.label}
                                          </FormLabel>
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
                          name="otherOutletDescription"
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
                      </div>
                    )}

                    {isWholesale && (
                      <FormField
                        control={form.control}
                        name="whySellEven"
                        render={({ field }) => (
                          <FormItem>
                            <RequiredFormLabel>Why do you want to sell EVEN?</RequiredFormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us why you're interested in selling EVEN"
                                className="resize-none rounded-none"
                                {...field}
                                onChange={e => {
                                  field.onChange(e)
                                  // Force validation after input
                                  setTimeout(() => validateCurrentStep(), 100)
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-[#9D783C]" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ein"
                      render={({ field }) => (
                        <FormItem>
                          <RequiredFormLabel>
                            EIN (Employer Identification Number)
                          </RequiredFormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="XX-XXXXXXX"
                              maxLength={10}
                              className="rounded-none"
                              value={
                                field.value
                                  ? `${field.value.slice(0, 2)}${field.value.length > 2 ? '-' : ''}${field.value.slice(2, 9)}`
                                  : ''
                              }
                              onChange={e => {
                                const digits = e.target.value.replace(/\D/g, '')
                                field.onChange(digits)
                                // Force validation after input
                                setTimeout(() => validateCurrentStep(), 100)
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[#9D783C]" />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <RequiredFormLabel>List States You Do Business In</RequiredFormLabel>
                      <StatesSelector
                        selectedStates={selectedStates}
                        setSelectedStates={wrappedSetSelectedStates}
                        error={statesError}
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Account Information</h3>
                    <p className="text-muted-foreground">
                      Please provide contact information for account access.
                    </p>

                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium mb-3">Main Account Manager</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="mainContactFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <RequiredFormLabel>First Name</RequiredFormLabel>
                              <FormControl>
                                <Input
                                  placeholder="First Name"
                                  className="rounded-none"
                                  {...field}
                                  onChange={e => {
                                    field.onChange(e)
                                    setTimeout(() => validateCurrentStep(), 100)
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mainContactLastName"
                          render={({ field }) => (
                            <FormItem>
                              <RequiredFormLabel>Last Name</RequiredFormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Last Name"
                                  className="rounded-none"
                                  {...field}
                                  onChange={e => {
                                    field.onChange(e)
                                    setTimeout(() => validateCurrentStep(), 100)
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mainContactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <RequiredFormLabel>Email</RequiredFormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="email@example.com"
                                  className="rounded-none"
                                  {...field}
                                  onChange={e => {
                                    field.onChange(e)
                                    setTimeout(() => validateCurrentStep(), 100)
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mainContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <RequiredFormLabel>Phone</RequiredFormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(555) 555-5555"
                                  className="rounded-none"
                                  value={field.value ? formatPhoneNumber(field.value) : ''}
                                  onChange={e => {
                                    const digits = e.target.value.replace(/\D/g, '')
                                    field.onChange(digits)
                                    setTimeout(() => validateCurrentStep(), 100)
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-[#9D783C]" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Additional Account Users</h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAdditionalUsers([
                              ...additionalUsers,
                              {
                                firstName: '',
                                lastName: '',
                                email: '',
                                phone: '',
                              },
                            ])
                          }}
                          className="rounded-none border-[#9D783C] text-[#9D783C] hover:bg-[#9D783C] hover:text-white"
                        >
                          Add User
                        </Button>
                      </div>

                      {additionalUsers.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No additional users added. Click "Add User" to add people who can access
                          the ordering system.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {additionalUsers.map((user, index) => (
                            <div key={index} className="border border-border p-4 relative">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newUsers = [...additionalUsers]
                                  newUsers.splice(index, 1)
                                  setAdditionalUsers(newUsers)
                                }}
                                className="absolute right-2 top-2 h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium leading-none mb-2 block">
                                    First Name
                                  </label>
                                  <Input
                                    placeholder="First Name"
                                    className="rounded-none"
                                    value={user.firstName}
                                    onChange={e => {
                                      const newUsers = [...additionalUsers]
                                      newUsers[index].firstName = e.target.value
                                      setAdditionalUsers(newUsers)
                                      setTimeout(() => validateCurrentStep(), 100)
                                    }}
                                  />
                                  {!user.firstName && (
                                    <p className="text-[#9D783C] text-sm mt-1">
                                      First name is required
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="text-sm font-medium leading-none mb-2 block">
                                    Last Name
                                  </label>
                                  <Input
                                    placeholder="Last Name"
                                    className="rounded-none"
                                    value={user.lastName}
                                    onChange={e => {
                                      const newUsers = [...additionalUsers]
                                      newUsers[index].lastName = e.target.value
                                      setAdditionalUsers(newUsers)
                                      setTimeout(() => validateCurrentStep(), 100)
                                    }}
                                  />
                                  {!user.lastName && (
                                    <p className="text-[#9D783C] text-sm mt-1">
                                      Last name is required
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="text-sm font-medium leading-none mb-2 block">
                                    Email
                                  </label>
                                  <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="rounded-none"
                                    value={user.email}
                                    onChange={e => {
                                      const newUsers = [...additionalUsers]
                                      newUsers[index].email = e.target.value
                                      setAdditionalUsers(newUsers)
                                      setTimeout(() => validateCurrentStep(), 100)
                                    }}
                                  />
                                  {!user.email && (
                                    <p className="text-[#9D783C] text-sm mt-1">Email is required</p>
                                  )}
                                </div>

                                <div>
                                  <label className="text-sm font-medium leading-none mb-2 block">
                                    Phone
                                  </label>
                                  <Input
                                    placeholder="(555) 555-5555"
                                    className="rounded-none"
                                    value={formatPhoneNumber(user.phone)}
                                    onChange={e => {
                                      const digits = e.target.value.replace(/\D/g, '')
                                      const newUsers = [...additionalUsers]
                                      newUsers[index].phone = digits
                                      setAdditionalUsers(newUsers)
                                      setTimeout(() => validateCurrentStep(), 100)
                                    }}
                                  />
                                  {(!user.phone || user.phone.length < 10) && (
                                    <p className="text-[#9D783C] text-sm mt-1">
                                      Valid phone number is required
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Summary</h3>
                    <p className="text-muted-foreground mb-4">
                      Please review your information before submitting.
                    </p>

                    <div className="space-y-6">
                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Business Information</h4>
                        <dl className="space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Business Name:</dt>
                            <dd className="col-span-2">
                              {formatSummaryValue(form.getValues('businessName'))}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Business Address:</dt>
                            <dd className="col-span-2">
                              {formatSummaryValue(form.getValues('businessStreetAddress'))}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Business Phone:</dt>
                            <dd className="col-span-2">
                              {formatPhoneNumber(form.getValues('businessPhone'))}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Website URL:</dt>
                            <dd className="col-span-2">
                              {formatSummaryValue(form.getValues('websiteUrl'))}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Business Category</h4>
                        <dl className="space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Retail Category:</dt>
                            <dd className="col-span-2">
                              {getLabelForValue(
                                form.getValues('businessCategory'),
                                businessCategories
                              )}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">
                              {isWholesale
                                ? 'Direct / Retail Type:'
                                : 'Wholesale / Distributor Type:'}
                            </dt>
                            <dd className="col-span-2">
                              {isOtherSubcategory
                                ? form.getValues('otherSubcategory')
                                : getLabelForValue(
                                    form.getValues('subcategory'),
                                    isWholesale ? wholesaleSubcategories : distributorSubcategories
                                  )}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Account Representative:</dt>
                            <dd className="col-span-2">
                              {getLabelForValue(form.getValues('accountRep'), accountReps)}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Business Details</h4>
                        <dl className="space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Number of Locations:</dt>
                            <dd className="col-span-2">
                              {formatSummaryValue(form.getValues('locationCount'))}
                            </dd>
                          </div>
                          {isDistributor && (
                            <div className="grid grid-cols-3 gap-4">
                              <dt className="text-muted-foreground">Outlet Types:</dt>
                              <dd className="col-span-2">
                                {(form.getValues('outletTypes') || [])
                                  .map(type => getLabelForValue(type, outletTypes))
                                  .join(', ')}
                              </dd>
                            </div>
                          )}
                          {isWholesale && (
                            <div className="grid grid-cols-3 gap-4">
                              <dt className="text-muted-foreground">Why Sell EVEN:</dt>
                              <dd className="col-span-2">
                                {formatSummaryValue(form.getValues('whySellEven'))}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Tax Information</h4>
                        <dl className="space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">EIN:</dt>
                            <dd className="col-span-2">
                              {formatSummaryValue(form.getValues('ein'))}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">States:</dt>
                            <dd className="col-span-2">
                              {selectedStates.length > 0
                                ? selectedStates.map(state => state.stateName).join(', ')
                                : 'None selected'}
                            </dd>
                          </div>

                          {selectedStates.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-border/30">
                              <h5 className="text-sm font-medium mb-2">
                                State Reseller Documentation:
                              </h5>
                              {selectedStates.map((state, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                                  <dt className="text-muted-foreground">{state.stateName}:</dt>
                                  <dd className="col-span-2">
                                    <div className="flex flex-col gap-1">
                                      <div>Reseller #: {state.resellerNumber}</div>
                                      <div className="text-xs text-muted-foreground">
                                        File:{' '}
                                        {state.documentFile
                                          ? state.documentFile.name
                                          : 'No file uploaded'}
                                      </div>
                                    </div>
                                  </dd>
                                </div>
                              ))}
                            </div>
                          )}
                        </dl>
                      </div>

                      <div className="border-t border-border pt-4">
                        <h4 className="font-medium mb-3">Account Information</h4>
                        <dl className="space-y-2">
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Main Contact:</dt>
                            <dd className="col-span-2">
                              {form.getValues('mainContactFirstName')}{' '}
                              {form.getValues('mainContactLastName')}
                            </dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Email:</dt>
                            <dd className="col-span-2">{form.getValues('mainContactEmail')}</dd>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <dt className="text-muted-foreground">Phone:</dt>
                            <dd className="col-span-2">
                              {formatPhoneNumber(form.getValues('mainContactPhone'))}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {additionalUsers.length > 0 && (
                        <div className="border-t border-border pt-4">
                          <h4 className="font-medium mb-3">Additional Users</h4>
                          {additionalUsers.map((user, index) => (
                            <div
                              key={index}
                              className="mb-4 pb-3 border-b border-border last:mb-0 last:pb-0 last:border-b-0"
                            >
                              <dl className="space-y-2">
                                <div className="grid grid-cols-3 gap-4">
                                  <dt className="text-muted-foreground">Name:</dt>
                                  <dd className="col-span-2">
                                    {user.firstName} {user.lastName}
                                  </dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <dt className="text-muted-foreground">Email:</dt>
                                  <dd className="col-span-2">{user.email}</dd>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <dt className="text-muted-foreground">Phone:</dt>
                                  <dd className="col-span-2">{formatPhoneNumber(user.phone)}</dd>
                                </div>
                              </dl>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {submissionError && (
                      <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-500">{submissionError}</p>
                      </div>
                    )}

                    <div className="mt-8 flex justify-center">
                      <Button
                        type="button"
                        onClick={e => {
                          e.preventDefault()
                          onSubmit(form.getValues())
                        }}
                        className="rounded-none py-6 px-8 text-lg bg-[#9D783C] hover:bg-[#8A6A35] text-white w-full max-w-md"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Submitting...</span>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </>
                        ) : (
                          <>
                            Submit Application <Check className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          )}
        </CardContent>

        {step < 6 && (
          <CardFooter className="flex justify-between border-t border-border pt-6">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="rounded-none border-[#9D783C] text-[#9D783C] hover:bg-[#9D783C] hover:text-white"
                disabled={isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 6 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
                disabled={!isStepValid || isSubmitting}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={e => {
                  e.preventDefault()
                  onSubmit(form.getValues())
                }}
                className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Submitting...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    Submit Application <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </>
  )
}
