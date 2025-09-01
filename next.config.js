/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  serverExternalPackages: ['@genkit-ai/googleai'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize moment.js to reduce bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
      moment$: 'moment/moment.js',
    };

    // Cache optimization for development
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    // Split chunks for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 20,
            reuseExistingChunk: true,
          },
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@genkit-ai)[\\/]/,
            name: 'firebase',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  // Enhanced experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-icons',
      'framer-motion',
      'react-icons',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select'
    ],
  },
  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Enable compression and minification
  compress: true,
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);