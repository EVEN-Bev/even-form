'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X, Upload } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

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

export type StateWithReseller = {
  stateCode: string
  stateName: string
  resellerNumber: string
  documentFile?: File | null
}

interface StateAutocompleteProps {
  selectedStates: StateWithReseller[]
  setSelectedStates: React.Dispatch<React.SetStateAction<StateWithReseller[]>>
  error?: string
}

export function StateAutocomplete({
  selectedStates,
  setSelectedStates,
  error,
}: StateAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  // Filter out already selected states
  const availableStates = states.filter(
    state => !selectedStates.some(s => s.stateCode === state.value)
  )

  const handleSelectState = (stateCode: string) => {
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
      setOpen(false)
      setInputValue('')
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
    setSelectedStates(prev =>
      prev.map(s => (s.stateCode === stateCode ? { ...s, documentFile: file } : s))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {selectedStates.length > 0 ? 'Add another state' : 'Add States'}
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between rounded-none"
              type="button" // Explicitly set type to button to prevent form submission
            >
              {inputValue || 'Select a state...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput
                placeholder="Search states..."
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  {availableStates.map(state => (
                    <CommandItem
                      key={state.value}
                      value={state.value}
                      onSelect={value => {
                        handleSelectState(value)
                        return false // Prevent default behavior
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', 'opacity-0')} />
                      {state.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-[#9D783C] text-sm">{error}</p>}
      </div>

      {selectedStates.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Selected States
          </label>
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
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Reseller Number
                    </label>
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
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Documentation
                    </label>
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
                    {state.documentFile && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {state.documentFile.name}
                      </p>
                    )}
                    {!state.documentFile && (
                      <p className="text-[#9D783C] text-sm">Documentation is required</p>
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
