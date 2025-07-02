'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, Edit2, ChevronUp, ChevronDown } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BusinessRecord } from '@/types/business-types'

interface BusinessRecordsTableProps {
  records: BusinessRecord[]
  loading: boolean
  error: string | null
  selectedRecords: string[]
  toggleRecordSelection: (id: string) => void
  toggleSelectAll: (isSelected: boolean) => void
  onView: (record: BusinessRecord) => void
  onEdit: (record: BusinessRecord) => void
}

type SortField = 'business_name' | 'business_category' | 'created_at' | 'account_rep'
type SortDirection = 'asc' | 'desc'

export function BusinessRecordsTable({
  records,
  loading,
  error,
  selectedRecords,
  toggleRecordSelection,
  toggleSelectAll,
  onView,
  onEdit,
}: BusinessRecordsTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort records
  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue === null) return sortDirection === 'asc' ? 1 : -1
    if (bValue === null) return sortDirection === 'asc' ? -1 : 1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1
  })

  // Check if all records are selected
  const allSelected = records.length > 0 && selectedRecords.length === records.length

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 border border-border rounded-md">
        <div className="h-8 w-8 border-4 border-t-[#9D783C] border-r-[#9D783C] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading business records...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 border border-border rounded-md">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-muted-foreground">Check the console for more details.</p>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 border border-border rounded-md">
        <p className="text-muted-foreground mb-2">No business records found</p>
        <p className="text-sm text-muted-foreground">
          There might be no records in the database, or there could be an issue with the connection.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-none overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
                className="border-[#9D783C] data-[state=checked]:bg-[#9D783C] data-[state=checked]:text-white"
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('business_name')}>
              <div className="flex items-center">
                Business Name
                {renderSortIndicator('business_name')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('business_category')}>
              <div className="flex items-center">
                Category
                {renderSortIndicator('business_category')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('account_rep')}>
              <div className="flex items-center">
                Account Rep
                {renderSortIndicator('account_rep')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
              <div className="flex items-center">
                Submission Date
                {renderSortIndicator('created_at')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.map(record => (
            <TableRow key={record.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRecords.includes(record.id)}
                  onCheckedChange={() => toggleRecordSelection(record.id)}
                  className="border-[#9D783C] data-[state=checked]:bg-[#9D783C] data-[state=checked]:text-white"
                />
              </TableCell>
              <TableCell className="font-medium">{record.business_name}</TableCell>
              <TableCell>
                {record.business_category === 'direct-retail'
                  ? 'Direct / Retail'
                  : 'Wholesale / Distributor'}
              </TableCell>
              <TableCell>{record.account_rep}</TableCell>
              <TableCell>{formatDate(record.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(record)}
                    className="h-8 rounded-none border-[#9D783C] text-[#9D783C] hover:bg-[#9D783C] hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
