import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
export async function GET() {
  const results: Record<string, boolean> = {}

  // Define paths to check
  const pathsToCheck = [
    '/public/even-logo.png',
    '/public/images/matt-vandelec.png',
    '/public/images/james-ganino.png',
    '/public/images/alana-wigdahl.png',
    '/public/favicon.png',
    // Also check without the /public prefix as Next.js serves from public directly
    '/even-logo.png',
    '/images/matt-vandelec.png',
    '/images/james-ganino.png',
    '/images/alana-wigdahl.png',
    '/favicon.png',
  ]

  // Check each path
  for (const filePath of pathsToCheck) {
    try {
      // For paths starting with /public, check the actual file system
      const actualPath = filePath.startsWith('/public')
        ? path.join(process.cwd(), filePath)
        : path.join(process.cwd(), 'public', filePath)

      results[filePath] = fs.existsSync(actualPath)
    } catch (error) {
      console.error(`Error checking ${filePath}:`, error)
      results[filePath] = false
    }
  }

  // Also return the current working directory and list of files in the public directory
  let publicDirContents: string[] = []
  let imagesDirContents: string[] = []

  try {
    const publicDir = path.join(process.cwd(), 'public')
    if (fs.existsSync(publicDir)) {
      publicDirContents = fs.readdirSync(publicDir)

      const imagesDir = path.join(publicDir, 'images')
      if (fs.existsSync(imagesDir)) {
        imagesDirContents = fs.readdirSync(imagesDir)
      }
    }
  } catch (error) {
    console.error('Error reading directory contents:', error)
  }

  return NextResponse.json({
    results,
    cwd: process.cwd(),
    publicDirContents,
    imagesDirContents,
  })
}
