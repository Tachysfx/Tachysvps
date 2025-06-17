/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add these if you're hosting in a subdirectory
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || '',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      }
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  // If you're using experimental features, keep them
  // experimental: {
  //   appDir: true,
  // }
}

module.exports = nextConfig 