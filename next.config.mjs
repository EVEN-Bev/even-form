/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['v0.blob.com'],
  },
  // Ensure static assets are properly handled
  output: 'standalone',
  // Add any other configuration options here
}

export default nextConfig
