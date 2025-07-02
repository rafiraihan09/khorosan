/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  // Remove output: 'export' to allow dynamic routes without generateStaticParams
  trailingSlash: true,
}

module.exports = nextConfig