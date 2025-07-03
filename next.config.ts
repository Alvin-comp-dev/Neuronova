import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Production optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Experimental features for performance
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'framer-motion',
      'react-chartjs-2',
      'chart.js'
    ],
    // Enable modern bundling
    bundlePagesRouterDependencies: true,
    // Optimize CSS
    optimizeCss: true,
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // TypeScript and ESLint config for production
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Server optimizations
  serverExternalPackages: [
    'mongodb',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'nodemailer',
    'sharp'
  ],
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable webpack caching for faster builds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
            },
          },
        },
      };
    } else {
      // Development optimizations
      config.cache = false; // Disable cache in development to avoid issues
    }
    
    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      // Optimize three.js imports
      'three': 'three/build/three.module.js',
    };
    
    return config;
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'i.pravatar.cc',
      'randomuser.me',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  
  // Security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          // Cache API responses
          { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=60' },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirect optimizations
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/api-docs',
        permanent: true,
      },
      {
        source: '/settings',
        destination: '/profile',
        permanent: false,
      },
    ];
  },
  
  // Enable standalone output for Docker
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Compress output
  compress: true,
  
  // Enable trailing slash for better SEO
  trailingSlash: false,
  
  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
