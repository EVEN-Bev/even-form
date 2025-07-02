'use client'

import type * as React from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// List of US states
const states = [
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

// Accepted file formats
const ACCEPTED_FILE_FORMATS = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff']

// This type must be compatible with BusinessStateWithFile in business-types.ts
export type StateWithReseller = {
  stateCode: string
  stateName: string
  resellerNumber: string
  documentFile?: File | null
  fileError?: string
  fileData?: string
  fileName?: string
  fileType?: string
  fileSize?: number

  // These fields will be used for server-side database insertion
  state_code?: string
  state_name?: string
  reseller_number?: string
}

interface StatesSelectorProps {
  selectedStates: StateWithReseller[]
  setSelectedStates: React.Dispatch<React.SetStateAction<StateWithReseller[]>>
  error?: string
}

export function StatesSelector({ selectedStates, setSelectedStates, error }: StatesSelectorProps) {
  // Filter out already selected states
  const availableStates = states.filter(
    state => !selectedStates.some(s => s.stateCode === state.value)
  )

  const handleAddState = (stateCode: string) => {
    if (!stateCode) return

    const selectedState = states.find(s => s.value === stateCode)
    if (selectedState) {
      setSelectedStates(prev => [
        ...prev,
        {
          stateCode: selectedState.value,
          stateName: selectedState.label,
          resellerNumber: '',
          documentFile: null,
        },
      ])
    }
  }

  const handleRemoveState = (stateCode: string) => {
    setSelectedStates(prev => prev.filter(s => s.stateCode !== stateCode))
  }

  const handleResellerChange = (stateCode: string, value: string) => {
    setSelectedStates(prev =>
      prev.map(s => (s.stateCode === stateCode ? { ...s, resellerNumber: value } : s))
    )
  }

  const handleFileChange = (stateCode: string, file: File | null) => {
    // If no file was selected, just clear the current file
    if (!file) {
      setSelectedStates(prev =>
        prev.map(s =>
          s.stateCode === stateCode ? { ...s, documentFile: null, fileError: undefined } : s
        )
      )
      return
    }

    // Check if the file format is accepted
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
    const isValidFormat = ACCEPTED_FILE_FORMATS.includes(fileExtension)

    if (!isValidFormat) {
      setSelectedStates(prev =>
        prev.map(s =>
          s.stateCode === stateCode
            ? {
                ...s,
                documentFile: null,
                fileError: `Unsupported file format. Please upload a ${ACCEPTED_FILE_FORMATS.join(', ')} file.`,
              }
            : s
        )
      )
    } else {
      setSelectedStates(prev =>
        prev.map(s =>
          s.stateCode === stateCode ? { ...s, documentFile: file, fileError: undefined } : s
        )
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          {selectedStates.length > 0 ? 'Add another state' : 'Add States'}
        </label>

        <div className="flex gap-2">
          <Select onValueChange={handleAddState} disabled={availableStates.length === 0}>
            <SelectTrigger className="w-full rounded-none">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {availableStates.map(state => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-[#9D783C] text-sm">{error}</p>}
      </div>

      {selectedStates.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none">Selected States</label>
          <div className="space-y-3">
            {selectedStates.map(state => (
              <div
                key={state.stateCode}
                className="flex flex-col space-y-2 p-3 border border-border"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{state.stateName}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveState(state.stateCode)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Reseller Number</label>
                    <Input
                      placeholder={`${state.stateCode} Reseller #`}
                      value={state.resellerNumber}
                      onChange={e => handleResellerChange(state.stateCode, e.target.value)}
                      className="rounded-none"
                    />
                    {!state.resellerNumber && (
                      <p className="text-[#9D783C] text-sm">Reseller number is required</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Documentation</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={e => {
                          const file = e.target.files?.[0] || null
                          handleFileChange(state.stateCode, file)
                        }}
                        className="rounded-none"
                        id={`file-${state.stateCode}`}
                        style={{ display: 'none' }}
                        accept={ACCEPTED_FILE_FORMATS.join(',')}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-none border-[#9D783C] text-[#9D783C] hover:bg-[#9D783C] hover:text-white w-full"
                        onClick={() => document.getElementById(`file-${state.stateCode}`)?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {state.documentFile ? 'Change File' : 'Upload Documentation'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, JPG, JPEG, PNG, TIFF
                    </p>
                    {state.documentFile && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {state.documentFile.name}
                      </p>
                    )}
                    {state.fileError ? (
                      <div className="flex items-center gap-1 text-[#9D783C] text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{state.fileError}</span>
                      </div>
                    ) : (
                      !state.documentFile && (
                        <p className="text-[#9D783C] text-sm">Documentation is required</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
