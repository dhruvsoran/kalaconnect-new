import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      allowedOrigins: [
        '*.app.github.dev',
        '*.github.dev',
        'localhost:3000',
        '127.0.0.1:3000',
        'kalaconnect.me',
        'www.kalaconnect.me',
        '*.vercel.app',
      ],
    },
  },

  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency/,
    ];
    return config;
  },



  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '5.imimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,
  poweredByHeader: false,

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    },
  ],
};

export default nextConfig;