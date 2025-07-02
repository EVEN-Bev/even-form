'use client'

import { useEffect, useState } from 'react'

export default function FileCheckPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkFiles() {
      try {
        const response = await fetch('/api/check-files')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResults(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    checkFiles()
  }, [])

  if (loading) {
    return <div className="p-8">Loading file information...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">File System Check</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Working Directory</h2>
        <div className="p-4 bg-gray-100 rounded">{results.cwd}</div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Public Directory Contents</h2>
        {results.publicDirContents.length > 0 ? (
          <ul className="list-disc pl-6">
            {results.publicDirContents.map((file: string) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">No files found in public directory</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Images Directory Contents</h2>
        {results.imagesDirContents.length > 0 ? (
          <ul className="list-disc pl-6">
            {results.imagesDirContents.map((file: string) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">No files found in images directory</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">File Existence Check</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Path</th>
              <th className="border p-2 text-left">Exists</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results.results).map(([path, exists]: [string, boolean]) => (
              <tr key={path} className={exists ? 'bg-green-100' : 'bg-red-100'}>
                <td className="border p-2">{path}</td>
                <td className="border p-2">{exists ? '✅ Yes' : '❌ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manual Image Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Logo Test</h3>
            <img
              src="/even-logo.png"
              alt="Logo"
              className="h-20 w-20 object-contain border"
              onError={e => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.nextSibling?.insertAdjacentHTML(
                  'afterend',
                  '<p class="text-red-500 mt-2">Failed to load image</p>'
                )
              }}
            />
            <p className="mt-2 text-sm text-gray-500">Path: /even-logo.png</p>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-medium mb-2">Favicon Test</h3>
            <img
              src="/favicon.png"
              alt="Favicon"
              className="h-20 w-20 object-contain border"
              onError={e => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.nextSibling?.insertAdjacentHTML(
                  'afterend',
                  '<p class="text-red-500 mt-2">Failed to load image</p>'
                )
              }}
            />
            <p className="mt-2 text-sm text-gray-500">Path: /favicon.png</p>
          </div>
        </div>
      </div>
    </div>
  )
}
