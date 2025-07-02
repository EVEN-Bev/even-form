'use client'

import type React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface MaskedEinInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (value: string) => void
}

export function MaskedEinInput({ className, onChange, ...props }: MaskedEinInputProps) {
  // Don't use useFormField here - it should only be used within FormField context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove all non-digits
    const digits = input.replace(/\D/g, '')

    // Format as XX-XXXXXXX for display
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2, 9)}` : digits

    // Update the input value
    e.currentTarget.value = formatted

    // Call the onChange handler with just the digits
    if (onChange) {
      onChange(digits)
    }
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      placeholder="XX-XXXXXXX"
      maxLength={10}
      className={cn('rounded-none', className)}
      onChange={handleChange}
      {...props}
    />
  )
}
