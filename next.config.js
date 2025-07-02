// // // /** @type {import('next').NextConfig} */
// // // const nextConfig = {
// // //   output: 'export', // Set the output to export for static export
// // //   eslint: {
// // //     ignoreDuringBuilds: true, // Ignore ESLint errors during the build process
// // //   },
// // //   images: { 
// // //     unoptimized: true, // Disable image optimization for static exports
// // //   },
// // //   experimental: {
// // //     // Disable or enable experimental features if needed
// // //   },
// // //   // Add custom Webpack configuration
// // //   webpack: (config, { dev, isServer }) => {
// // //     if (dev && !isServer) {
// // //       // Improve error handling in development
// // //       config.optimization = {
// // //         ...config.optimization,
// // //         splitChunks: {
// // //           ...config.optimization.splitChunks,
// // //           cacheGroups: {
// // //             ...config.optimization.splitChunks?.cacheGroups,
// // //             default: false,
// // //             vendors: false,
// // //           },
// // //         },
// // //       };
// // //     }

// // //     // Custom Webpack configuration for handling specific issues with WebSockets and bufferutil
// // //     config.resolve.fallback = {
// // //       ...config.resolve.fallback,
// // //       fs: false, // For Supabase WebSocket dependencies
// // //       path: false, 
// // //       bufferutil: false, // Add the `bufferutil` fallback to avoid related errors
// // //       'utf-8-validate': false, // Add the `utf-8-validate` fallback to avoid related errors
// // //     };

// // //     return config;
// // //   },
// // // };

// // // module.exports = nextConfig;






// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   // Remove or comment out the static export
// //   // output: 'export',
  
// //   images: {
// //     unoptimized: true,
// //     domains: ['images.pexels.com', 'localhost'],
// //   },
// // }

// // module.exports = nextConfig

// // ----------------------------------------------------------------------------------------

// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   // Remove static export for dynamic functionality
// //   // output: 'export', // ← Comment out or remove this line
  
// //   // Keep image optimization disabled for development
// //   images: {
// //     unoptimized: true,
// //     domains: ['images.pexels.com', 'localhost'], // Add domains you'll use for images
// //   },
  
// //   // Enable experimental features if needed
// //   experimental: {
// //     // Add any experimental features you need
// //   },
  
// //   // Environment variables (optional)
// //   env: {
// //     CUSTOM_KEY: 'my-value',
// //   },
// // }

// // module.exports = nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     unoptimized: true
//   },
//   output: 'export',
//   trailingSlash: true,
// }

// module.exports = nextConfig

// --------------------------------------------------------------------------



/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid quote escaping errors
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization for static export
    unoptimized: true
  },
  // Enable static export for Netlify
  output: 'export',
  // Add trailing slash for better compatibility
  trailingSlash: true,
  // Disable server-side features that don't work with static export
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig