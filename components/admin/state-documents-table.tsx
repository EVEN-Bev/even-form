'use client'

import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
// Direct links to public documents
import type { BusinessState } from '@/types/business-types'

type StateDocumentsTableProps = {
  states: BusinessState[] | null | undefined
  businessId: string
  className?: string
}

export function StateDocumentsTable({
  states,
  businessId,
  className = '',
}: StateDocumentsTableProps) {
  if (!states || states.length === 0) {
    return (
      <div className={`text-sm text-gray-500 italic ${className}`}>
        No state records found for this business.
      </div>
    )
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2">State Documents</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>State</TableHead>
            <TableHead>Reseller Number</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.map(state => (
            <TableRow key={state.id}>
              <TableCell className="font-medium">
                {state.state_name} ({state.state_code})
              </TableCell>
              <TableCell>{state.reseller_number}</TableCell>
              <TableCell>
                {state.document_url ? (
                  <a 
                    href={`https://qycfyruqxhypaaehyuvv.supabase.co/storage/v1/object/public/business-documents/${state.document_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View {state.state_name} Document
                  </a>
                ) : (
                  <span className="text-gray-500">No document</span>
                )}
              </TableCell>
              <TableCell>{new Date(state.updated_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
