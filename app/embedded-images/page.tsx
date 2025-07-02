'use client'

import { useEffect, useState } from 'react'

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default function EmbeddedImagesPage() {
  const [logoSrc, setLogoSrc] = useState(PLACEHOLDER_IMAGE)
  const [mattSrc, setMattSrc] = useState(PLACEHOLDER_IMAGE)
  const [jamesSrc, setJamesSrc] = useState(PLACEHOLDER_IMAGE)
  const [alanaSrc, setAlanaSrc] = useState(PLACEHOLDER_IMAGE)

  useEffect(() => {
    // Create a simple logo (gold/black EVEN text)
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Background
      ctx.fillStyle = '#1d1e1e'
      ctx.fillRect(0, 0, 200, 200)

      // Text
      ctx.fillStyle = '#9D783C'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('EVEN', 100, 100)

      setLogoSrc(canvas.toDataURL('image/png'))
    }

    // Create simple placeholder images for team members
    function createPersonPlaceholder(name: string, color: string) {
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Background
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 200, 200)

        // Circle for head
        ctx.fillStyle = '#f0f0f0'
        ctx.beginPath()
        ctx.arc(100, 70, 40, 0, Math.PI * 2)
        ctx.fill()

        // Body
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(70, 110, 60, 80)

        // Name
        ctx.fillStyle = '#000'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(name, 100, 180)

        return canvas.toDataURL('image/png')
      }
      return PLACEHOLDER_IMAGE
    }

    setMattSrc(createPersonPlaceholder('Matt', '#a0d8ef'))
    setJamesSrc(createPersonPlaceholder('James', '#bce27f'))
    setAlanaSrc(createPersonPlaceholder('Alana', '#ffc0cb'))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Embedded Images Solution</h1>

      <div className="mb-8">
        <p className="mb-4">
          This page creates images directly in the browser using JavaScript canvas, bypassing the
          need for external image files. You can use these images as replacements for the missing
          files.
        </p>

        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded mb-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="list-decimal pl-6 mt-2">
            <li>Right-click on any image below</li>
            <li>Select "Save Image As..."</li>
            <li>Save with the appropriate filename (shown below each image)</li>
            <li>Upload to your project's public/images directory</li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border p-4 rounded text-center">
          <img
            src={logoSrc || '/placeholder.svg'}
            alt="EVEN Logo"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">EVEN Logo</p>
          <p className="text-sm text-gray-500">Save as: even-logo.png</p>
          <p className="text-sm text-gray-500">Path: /public/even-logo.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src={mattSrc || '/placeholder.svg'}
            alt="Matt"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Matt Vandelec</p>
          <p className="text-sm text-gray-500">Save as: matt-vandelec.png</p>
          <p className="text-sm text-gray-500">Path: /public/images/matt-vandelec.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src={jamesSrc || '/placeholder.svg'}
            alt="James"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">James Ganino</p>
          <p className="text-sm text-gray-500">Save as: james-ganino.png</p>
          <p className="text-sm text-gray-500">Path: /public/images/james-ganino.png</p>
        </div>

        <div className="border p-4 rounded text-center">
          <img
            src={alanaSrc || '/placeholder.svg'}
            alt="Alana"
            className="h-40 w-40 object-contain mx-auto border"
          />
          <p className="mt-2 font-medium">Alana Wigdahl</p>
          <p className="text-sm text-gray-500">Save as: alana-wigdahl.png</p>
          <p className="text-sm text-gray-500">Path: /public/images/alana-wigdahl.png</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Implementation Instructions</h2>
        <div className="p-4 bg-gray-100 rounded">
          <p className="mb-2">To use these images in your application:</p>
          <ol className="list-decimal pl-6">
            <li className="mb-2">Save all images as described above</li>
            <li className="mb-2">Upload them to your project's public/images directory</li>
            <li className="mb-2">Make sure your .gitignore file doesn't exclude PNG files</li>
            <li className="mb-2">Commit and push the changes to your repository</li>
            <li className="mb-2">Redeploy your application</li>
          </ol>

          <p className="mt-4 font-medium">Alternative solution:</p>
          <p>
            If you continue to have issues with static files, consider using data URLs directly in
            your code. You can copy the base64 encoded image data from the page source and use it
            directly in your img tags.
          </p>
        </div>
      </div>
    </div>
  )
}
