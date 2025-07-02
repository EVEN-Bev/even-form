/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      // Increase body size limit to 50MB
      bodySizeLimit: 50 * 1024 * 1024, // 50MB in bytes
    },
  },
}

module.exports = nextConfig
