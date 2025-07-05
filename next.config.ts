import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Simple image configuration
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'i.pravatar.cc',
      'randomuser.me',
    ],
  },
  
  // Basic webpack config
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
