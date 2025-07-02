'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { ViewBusinessModal } from './view-business-modal'
import { Eye, ChevronUp, ChevronDown, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BusinessRecord } from '@/types/business-types'

interface SimpleDataTableProps {
  records: BusinessRecord[]
}

// Add the contact fields to the SortField type
type SortField =
  | 'business_name'
  | 'contact_name'
  | 'contact_email'
  | 'business_phone'
  | 'created_at'
  | 'business_category'
type SortDirection = 'asc' | 'desc'

export function SimpleDataTable({ records }: SimpleDataTableProps) {
  const [viewRecord, setViewRecord] = useState<BusinessRecord | null>(null)
  // Edit functionality removed
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredRecords, setFilteredRecords] = useState<BusinessRecord[]>(records)

  // Edit functionality removed

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4 text-[#9D783C]" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 text-[#9D783C]" />
    )
  }

  // Filter and sort records when dependencies change
  useEffect(() => {
    // First filter by search term
    let result = [...records]
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        record =>
          (record.business_name && record.business_name.toLowerCase().includes(lowerSearchTerm)) ||
          (record.contact_name && record.contact_name.toLowerCase().includes(lowerSearchTerm)) ||
          (record.contact_email && record.contact_email.toLowerCase().includes(lowerSearchTerm)) ||
          (record.business_phone && record.business_phone.includes(searchTerm))
      )
    }

    // Then sort by the selected field
    result.sort((a, b) => {
      // Handle custom fields that might not be directly in the BusinessRecord type
      const getFieldValue = (record: any, field: string) => {
        return record[field] === undefined ? null : record[field]
      }

      const aValue = getFieldValue(a, sortField)
      const bValue = getFieldValue(b, sortField)

      // Handle null values
      if (aValue === null) return sortDirection === 'asc' ? 1 : -1
      if (bValue === null) return sortDirection === 'asc' ? -1 : 1

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Fallback comparison
      return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
    })

    setFilteredRecords(result)
  }, [records, searchTerm, sortField, sortDirection])

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 bg-[#1d1e1e] border-gray-700"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 hover:bg-gray-800">
              <TableHead
                className="text-gray-300 cursor-pointer"
                onClick={() => handleSort('business_name')}
              >
                <div className="flex items-center">
                  Business Name
                  {renderSortIndicator('business_name')}
                </div>
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer"
                onClick={() => handleSort('contact_name')}
              >
                <div className="flex items-center">
                  Contact Name
                  {renderSortIndicator('contact_name')}
                </div>
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer"
                onClick={() => handleSort('contact_email')}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIndicator('contact_email')}
                </div>
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer"
                onClick={() => handleSort('business_phone')}
              >
                <div className="flex items-center">
                  Phone
                  {renderSortIndicator('business_phone')}
                </div>
              </TableHead>
              <TableHead
                className="text-gray-300 cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  Submission Date
                  {renderSortIndicator('created_at')}
                </div>
              </TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record: any) => (
                <TableRow key={record.id} className="hover:bg-gray-800/50">
                  <TableCell>{record.business_name || 'N/A'}</TableCell>
                  <TableCell>{record.contact_name || 'N/A'}</TableCell>
                  <TableCell>{record.contact_email || 'N/A'}</TableCell>
                  <TableCell>{record.business_phone || 'N/A'}</TableCell>
                  <TableCell>{formatDate(record.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setViewRecord(record)}
                        className="rounded-full p-1 text-[#9D783C] hover:bg-[#9D783C]/20 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewRecord && <ViewBusinessModal record={viewRecord} onClose={() => setViewRecord(null)} />}
    </>
  )
}
