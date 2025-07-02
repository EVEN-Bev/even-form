'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BusinessRecordsTable } from './business-records-table'
import { SimpleDataTable } from './simple-data-table'
import { exportToCSV } from '@/lib/export-utils'
import type { BusinessRecord } from '@/types/business-types'

interface AdminDashboardProps {
  initialData?: BusinessRecord[]
  initialError?: string | null
}

export function AdminDashboard({ initialData = [], initialError = null }: AdminDashboardProps) {
  const [records] = useState<BusinessRecord[]>(initialData || [])
  const [error] = useState<string | null>(initialError)
  const [view, setView] = useState<'table' | 'simple'>('simple')
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])

  const handleExportAll = () => {
    if (records.length === 0) {
      alert('No data to export')
      return
    }
    exportToCSV(records, 'business-records')
  }

  const handleExportSelected = () => {
    if (selectedRecords.length === 0) {
      alert('No records selected')
      return
    }
    const selectedData = records.filter(record => selectedRecords.includes(record.id))
    exportToCSV(selectedData, 'selected-business-records')
  }

  const toggleRecordSelection = (id: string) => {
    setSelectedRecords(prev =>
      prev.includes(id) ? prev.filter(recordId => recordId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRecords(records.map(record => record.id))
    } else {
      setSelectedRecords([])
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Business Records</h1>
          <p className="text-gray-400 mb-4">{records.length} total records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button onClick={handleExportAll} className="w-full sm:w-auto">
            Export All Records to CSV
          </Button>
          {selectedRecords.length > 0 && (
            <Button onClick={handleExportSelected} className="w-full sm:w-auto">
              Export Selected Records ({selectedRecords.length})
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error loading data</p>
          <p>{error}</p>
        </div>
      )}

      {records.length === 0 && !error ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No business records found</h2>
          <p className="text-gray-400">There are no business records in the database yet.</p>
        </div>
      ) : view === 'table' ? (
        <BusinessRecordsTable
          records={records}
          loading={false}
          error={error}
          selectedRecords={selectedRecords}
          toggleRecordSelection={toggleRecordSelection}
          toggleSelectAll={toggleSelectAll}
          onView={record => console.log('View', record)}
          onEdit={record => console.log('Edit', record)}
        />
      ) : (
        <SimpleDataTable records={records} />
      )}
    </div>
  )
}
