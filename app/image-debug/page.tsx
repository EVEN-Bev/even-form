'use client'

import { useEffect } from 'react'
import { DebugImage } from '@/components/debug-image'

export default function ImageDebugPage() {
  useEffect(() => {
    // Log environment information
    console.log('[ImageDebug] Environment information:')
    console.log(`[ImageDebug] Window location: ${window.location.href}`)
    console.log(`[ImageDebug] Base URL: ${window.location.origin}`)

    // Check if we can fetch the images directly
    const checkImage = async (path: string) => {
      try {
        const response = await fetch(path)
        console.log(`[ImageDebug] Fetch ${path}: ${response.status} ${response.statusText}`)
        if (!response.ok) {
          console.error(`[ImageDebug] Failed to fetch ${path}`)
        } else {
          console.log(`[ImageDebug] Successfully fetched ${path}`)
          const contentType = response.headers.get('content-type')
          console.log(`[ImageDebug] Content-Type: ${contentType}`)
        }
      } catch (error) {
        console.error(`[ImageDebug] Error fetching ${path}:`, error)
      }
    }

    // Check all images
    checkImage('/even-logo.png')
    checkImage('/images/matt-vandelec.png')
    checkImage('/images/james-ganino.png')
    checkImage('/images/alana-wigdahl.png')
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Debug Page</h1>
      <p className="mb-4">Check the browser console for detailed debugging information.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border p-4 rounded text-center">
          <DebugImage
            src="/even-logo.png"
            alt="EVEN Logo"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">EVEN Logo</p>
          <p className="text-sm text-gray-500">Path: /even-logo.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <DebugImage
            src="/images/matt-vandelec.png"
            alt="Matt Vandelec"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Matt Vandelec</p>
          <p className="text-sm text-gray-500">Path: /images/matt-vandelec.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <DebugImage
            src="/images/james-ganino.png"
            alt="James Ganino"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">James Ganino</p>
          <p className="text-sm text-gray-500">Path: /images/james-ganino.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <DebugImage
            src="/images/alana-wigdahl.png"
            alt="Alana Wigdahl"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Alana Wigdahl</p>
          <p className="text-sm text-gray-500">Path: /images/alana-wigdahl.png</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Direct Image URLs</h2>
        <div className="space-y-2">
          <p>
            <a
              href="/even-logo.png"
              target="_blank"
              className="text-blue-500 hover:underline"
              rel="noreferrer"
            >
              /even-logo.png
            </a>
          </p>
          <p>
            <a
              href="/images/matt-vandelec.png"
              target="_blank"
              className="text-blue-500 hover:underline"
              rel="noreferrer"
            >
              /images/matt-vandelec.png
            </a>
          </p>
          <p>
            <a
              href="/images/james-ganino.png"
              target="_blank"
              className="text-blue-500 hover:underline"
              rel="noreferrer"
            >
              /images/james-ganino.png
            </a>
          </p>
          <p>
            <a
              href="/images/alana-wigdahl.png"
              target="_blank"
              className="text-blue-500 hover:underline"
              rel="noreferrer"
            >
              /images/alana-wigdahl.png
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-semibold">Troubleshooting Steps:</h3>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Check the console for detailed error messages</li>
          <li>Try clicking the direct image links above to see if they load in a new tab</li>
          <li>Verify that the images are in the correct location in your project</li>
          <li>Check your next.config.mjs for proper image configuration</li>
          <li>Ensure your deployment process includes the public directory</li>
        </ol>
      </div>
    </div>
  )
}
