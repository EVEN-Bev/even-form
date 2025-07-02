'use client'

import type React from 'react'

import { useState, useEffect } from 'react'

interface DebugImageProps {
  src: string
  alt: string
  className?: string
}

export function DebugImage({ src, alt, className = '' }: DebugImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [loadTime, setLoadTime] = useState(0)

  useEffect(() => {
    // Log the image path when the component mounts
    console.log(`[DebugImage] Attempting to load image: ${src}`)
    setStartTime(performance.now())
  }, [src])

  const handleLoad = () => {
    const endTime = performance.now()
    const timeToLoad = endTime - startTime
    setLoadTime(timeToLoad)
    setLoaded(true)
    console.log(`[DebugImage] Successfully loaded: ${src}`)
    console.log(`[DebugImage] Load time: ${timeToLoad.toFixed(2)}ms`)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true)
    console.error(`[DebugImage] Failed to load image: ${src}`)
    console.error(`[DebugImage] Error details:`, e)

    // Try to get more information about the image
    const img = new Image()
    img.onload = () => {
      console.log(`[DebugImage] Image exists when loaded directly: ${src}`)
      console.log(`[DebugImage] Image dimensions: ${img.width}x${img.height}`)
    }
    img.onerror = () => {
      console.error(`[DebugImage] Image does not exist when loaded directly: ${src}`)
    }
    img.src = src
  }

  return (
    <div className="relative">
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 border border-red-500 text-red-700 text-xs p-1">
          Failed to load image
        </div>
      )}
    </div>
  )
}
