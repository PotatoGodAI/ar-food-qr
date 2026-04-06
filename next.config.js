/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-blob.com',
      },
    ],
  },
}

module.exports = nextConfig
