// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true
//   },
//   // Remove output: 'export' to allow dynamic routes without generateStaticParams
//   trailingSlash: true,
// }

// module.exports = nextConfig

// ------------------------------------------------------------------

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
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Disable features that don't work with static export
  experimental: {
    // Remove this if causing issues
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    return config;
  },
}

module.exports = nextConfig