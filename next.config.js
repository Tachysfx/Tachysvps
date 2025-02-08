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
      },
      {
        protocol: "https",
        hostname: "https://h8bf1sydn7xduft2.public.blob.vercel-storage.com",
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
  output: 'standalone'
}

module.exports = nextConfig 