'use client'

import { useState, useEffect } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { SimpleDataTable } from '@/components/admin/simple-data-table'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { DebugPanel } from '@/components/admin/debug-panel'

export default function TestPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const supabase = getBrowserClient()

        // Direct query to business_records table
        const { data, error } = await supabase.from('business_records').select('*')

        if (error) throw error

        setData(data || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshCount])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Supabase Connection Test</h1>
        <Button
          onClick={() => setRefreshCount(prev => prev + 1)}
          disabled={loading}
          className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 border-4 border-t-[#9D783C] border-r-[#9D783C] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-500 bg-red-500/10 rounded-md text-red-500">
          {error}
        </div>
      ) : (
        <>
          <p className="mb-4">Found {data.length} records in the business_records table.</p>
          <SimpleDataTable records={data} />
        </>
      )}

      <DebugPanel
        data={{
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          recordCount: data.length,
          refreshCount,
          loading,
          error,
        }}
        title="Connection Debug Info"
      />
    </div>
  )
}
