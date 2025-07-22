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
//   output: 'export',
//   trailingSlash: true,
//   distDir: 'out',
//   // Disable features that don't work with static export
//   experimental: {
//     // Remove this if causing issues
//   },
//   webpack: (config) => {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//       net: false,
//       tls: false,
//       crypto: false,
//       bufferutil: false,
//       'utf-8-validate': false,
//     };
//     return config;
//   },
// }

// module.exports = nextConfig

// -----------------------------------------------------------------------------------------------


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
    // Add font loader configuration to handle Google Fonts better
    fontLoaders: [
      {
        loader: '@next/font/google',
        options: { 
          subsets: ['latin'],
          timeout: 30000 // Increase timeout to 30 seconds
        }
      }
    ]
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    
    // Suppress specific warnings to clean up console output
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Failed to download.*from Google Fonts/,
    ];
    
    // Additional optimization for static export
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig