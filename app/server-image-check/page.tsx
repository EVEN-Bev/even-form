'use client'

import { useState, useEffect } from 'react'

export default function ServerImageCheckPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function checkImages() {
      try {
        const response = await fetch('/api/check-images')
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message || 'Failed to check images on server')
        console.error('Error checking images:', err)
      } finally {
        setLoading(false)
      }
    }

    checkImages()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Server-Side Image Check</h1>

      {loading && (
        <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded mb-4">
          Loading server information...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Server Information</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <strong>Current Working Directory:</strong> {data.serverInfo.cwd}
              </p>
              <p>
                <strong>Node Environment:</strong> {data.serverInfo.nodeEnv}
              </p>
              <p>
                <strong>Public Directory:</strong> {data.serverInfo.publicDir}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Image Files</h2>
            <div className="grid gap-4">
              {data.images.map((image, index) => (
                <div
                  key={index}
                  className={`p-4 rounded border ${image.exists ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}
                >
                  <p>
                    <strong>Path:</strong> {image.path}
                  </p>
                  <p>
                    <strong>Exists on Server:</strong> {image.exists ? 'Yes' : 'No'}
                  </p>

                  {image.exists && image.fileInfo && (
                    <div className="mt-2">
                      <p>
                        <strong>File Size:</strong> {(image.fileInfo.size / 1024).toFixed(2)} KB
                      </p>
                      <p>
                        <strong>Created:</strong>{' '}
                        {new Date(image.fileInfo.created).toLocaleString()}
                      </p>
                      <p>
                        <strong>Last Modified:</strong>{' '}
                        {new Date(image.fileInfo.modified).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {image.error && (
                    <p className="text-red-700 mt-2">
                      <strong>Error:</strong> {image.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 flex space-x-4">
        <a
          href="/image-debug"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Client-Side Debug
        </a>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Check
        </button>
      </div>
    </div>
  )
}
