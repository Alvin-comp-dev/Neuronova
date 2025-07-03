import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Production optimizations
  poweredByHeader: false,
  generateEtags: false,
  
  // Compiler optimizations - disabled temporarily to fix errors
  // compiler: {
  //   // Remove console logs in production
  //   removeConsole: process.env.NODE_ENV === 'production' ? {
  //     exclude: ['error', 'warn']
  //   } : false,
  // },
  
  // Experimental features for performance - simplified
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react'
    ],
    // Disable problematic optimizations temporarily
    // bundlePagesRouterDependencies: true,
    // optimizeCss: true,
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
  
  // Webpack optimizations - simplified
  webpack: (config, { dev, isServer }) => {
    // Development optimizations
    if (dev) {
      config.cache = false; // Disable cache in development to avoid issues
    } else {
      // Production optimizations - simplified
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
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
  
  // Compress output
  compress: true,
  
  // Enable trailing slash for better SEO
  trailingSlash: false,
  
  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
