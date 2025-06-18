/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Set the output to export for static export
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during the build process
  },
  images: { 
    unoptimized: true, // Disable image optimization for static exports
  },
  experimental: {
    // Disable or enable experimental features if needed
  },
  // Add custom Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve error handling in development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
          },
        },
      };
    }

    // Custom Webpack configuration for handling specific issues with WebSockets and bufferutil
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // For Supabase WebSocket dependencies
      path: false, 
      bufferutil: false, // Add the `bufferutil` fallback to avoid related errors
      'utf-8-validate': false, // Add the `utf-8-validate` fallback to avoid related errors
    };

    return config;
  },
};

module.exports = nextConfig;
