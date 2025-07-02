'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { X } from 'lucide-react'
import { StateDocumentsTable } from './state-documents-table'
import type { BusinessRecord } from '@/types/business-types'

interface BusinessRecordDetailProps {
  record: BusinessRecord
  onClose: () => void
}

export function BusinessRecordDetail({ record, onClose }: BusinessRecordDetailProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="relative w-full max-w-6xl mx-auto p-4">
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-xl font-bold">{record.business_name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">State Documents</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoCard label="Business Type" value={record.business_category} />
                  <InfoCard label="EIN" value={record.ein} />
                  <InfoCard label="Created" value={formatDate(record.created_at)} />
                  <InfoCard label="Address" value={record.business_street_address} />
                  <InfoCard label="Phone" value={record.business_phone} />
                  <InfoCard label="Website" value={record.website_url || 'N/A'} />
                  <InfoCard label="Account Rep" value={record.account_rep} />
                  <InfoCard label="Subcategory" value={record.subcategory} />
                  {record.other_subcategory && (
                    <InfoCard label="Other Subcategory" value={record.other_subcategory} />
                  )}
                </div>

                {record.why_sell_even && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Why Sell EVEN</h3>
                    <div className="bg-card/50 p-4 rounded-md border border-border">
                      <p>{record.why_sell_even}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents">
                <StateDocumentsTable
                  states={record.states}
                  businessId={record.id}
                  className="mt-4"
                />
              </TabsContent>

              <TabsContent value="contacts">
                <div className="text-sm italic text-gray-500">
                  Contact information will be displayed here in a future update.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface InfoCardProps {
  label: string
  value: string | number | null
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="bg-card/50 p-4 rounded-md border border-border">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="font-medium">{value === null ? 'N/A' : value}</div>
    </div>
  )
}
