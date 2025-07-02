'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function RLSCheckPage() {
  const [rlsPolicies, setRlsPolicies] = useState<any[]>([])
  const [tableRls, setTableRls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkRLS()
  }, [])

  const checkRLS = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClientComponentClient()

      // Check RLS policies
      const { data: policies, error: policiesError } = await supabase.rpc('execute_sql', {
        query: `
          SELECT 
            schemaname, 
            tablename, 
            policyname, 
            permissive, 
            roles, 
            cmd, 
            qual, 
            with_check
          FROM 
            pg_policies 
          WHERE 
            schemaname = 'public'
        `,
      })

      if (policiesError) throw policiesError

      // Check if RLS is enabled on tables
      const { data: tables, error: tablesError } = await supabase.rpc('execute_sql', {
        query: `
          SELECT 
            n.nspname as schema,
            c.relname as table,
            CASE WHEN c.relrowsecurity THEN 'enabled' ELSE 'disabled' END as rls
          FROM 
            pg_class c
          JOIN 
            pg_namespace n ON n.oid = c.relnamespace
          WHERE 
            c.relkind = 'r' AND n.nspname = 'public'
        `,
      })

      if (tablesError) throw tablesError

      setRlsPolicies(policies || [])
      setTableRls(tables || [])
    } catch (err) {
      console.error('RLS check error:', err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 bg-[rgb(9,9,11)] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Row Level Security (RLS) Check</h1>

      <Button
        onClick={checkRLS}
        disabled={loading}
        className="rounded-none bg-[#9D783C] hover:bg-[#8A6A35] text-white mb-8"
      >
        Refresh RLS Info
      </Button>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="p-4 border border-red-500 bg-red-500/10 rounded-md text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border rounded-md p-4 bg-[#1d1e1e]">
          <h2 className="text-xl font-medium mb-4">RLS Status by Table</h2>
          {tableRls.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Table</th>
                  <th className="text-left py-2">RLS Status</th>
                </tr>
              </thead>
              <tbody>
                {tableRls.map((table, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-2">{table.table}</td>
                    <td
                      className={`py-2 ${table.rls === 'enabled' ? 'text-yellow-500' : 'text-green-500'}`}
                    >
                      {table.rls}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">No table information available</p>
          )}
        </div>

        <div className="border border-border rounded-md p-4 bg-[#1d1e1e]">
          <h2 className="text-xl font-medium mb-4">RLS Policies</h2>
          {rlsPolicies.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Table</th>
                  <th className="text-left py-2">Policy</th>
                  <th className="text-left py-2">Command</th>
                </tr>
              </thead>
              <tbody>
                {rlsPolicies.map((policy, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-2">{policy.tablename}</td>
                    <td className="py-2">{policy.policyname}</td>
                    <td className="py-2">{policy.cmd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted-foreground">No policies found</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 border border-border rounded-md bg-[#1d1e1e]">
        <h2 className="text-xl font-medium mb-4">What This Means</h2>
        <p className="mb-2">
          If RLS is <span className="text-yellow-500 font-medium">enabled</span> on a table but
          there are no policies or you don't have the right permissions, you won't be able to see
          any data.
        </p>
        <p>Solutions:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Disable RLS on the table if you don't need it</li>
          <li>Create an appropriate policy that allows access to the data</li>
          <li>Use the service role key instead of the anon key for admin access</li>
        </ul>
      </div>
    </div>
  )
}
