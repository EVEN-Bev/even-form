'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function CheckPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runQuery = async (query: string) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.rpc('execute_sql', { query })

      if (error) throw error

      setResults(data)
    } catch (err) {
      console.error('Query error:', err)
      setError(err instanceof Error ? err.message : String(err))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const checkTables = async () => {
    await runQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
  }

  const checkBusinessRecords = async () => {
    await runQuery('SELECT * FROM business_records LIMIT 5')
  }

  const checkColumns = async () => {
    await runQuery(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'business_records'"
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-[rgb(9,9,11)] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Database Structure Check</h1>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={checkTables}
          disabled={loading}
          className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
        >
          List Tables
        </Button>
        <Button
          onClick={checkBusinessRecords}
          disabled={loading}
          className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
        >
          Check Records
        </Button>
        <Button
          onClick={checkColumns}
          disabled={loading}
          className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white"
        >
          Check Columns
        </Button>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="p-4 border border-red-500 bg-red-500/10 rounded-md text-red-500 mb-4">
          {error}
        </div>
      )}

      {results && (
        <div className="border border-border rounded-md p-4 bg-[#1d1e1e]">
          <h2 className="text-xl font-medium mb-4">Results</h2>
          <pre className="overflow-auto max-h-[500px] p-4 bg-black/50 rounded-md">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
