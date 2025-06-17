/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // Disable some experimental features that might cause issues
  },
  // Add webpack configuration to handle potential issues
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
    return config;
  },
};

module.exports = nextConfig;