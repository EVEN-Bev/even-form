import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
export async function GET() {
  const imageResults = []
  const imagePaths = [
    '/even-logo.png',
    '/images/matt-vandelec.png',
    '/images/james-ganino.png',
    '/images/alana-wigdahl.png',
  ]

  for (const imagePath of imagePaths) {
    try {
      // Check if the file exists in the public directory
      const fullPath = path.join(process.cwd(), 'public', imagePath)
      const exists = fs.existsSync(fullPath)

      let fileInfo = null
      if (exists) {
        const stats = fs.statSync(fullPath)
        fileInfo = {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        }
      }

      imageResults.push({
        path: imagePath,
        exists,
        fileInfo,
      })
    } catch (error) {
      imageResults.push({
        path: imagePath,
        exists: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return NextResponse.json({
    serverInfo: {
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
      publicDir: path.join(process.cwd(), 'public'),
    },
    images: imageResults,
  })
}
