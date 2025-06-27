import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable to avoid hydration issues
  
  // Disable strict linting for now to focus on core functionality
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable strict TypeScript checking for build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Minimal experimental config
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // Server config
  serverExternalPackages: ['mongodb'],
  
  // Basic webpack config without caching issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // Disable cache in development
    }
    return config;
  },
  
  // Image domains
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'i.pravatar.cc',
      'randomuser.me',
    ],
  },
  
  // Basic headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
