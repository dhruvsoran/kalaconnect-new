import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: false,

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

  async redirects() {
    return [
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kalaconnect.me' }],
        destination: 'https://www.kalaconnect.me/:path*',
        permanent: true,
      },
    ];
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
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://adservice.google.com https://adservice.google.co.in",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://placehold.co https://picsum.photos https://m.media-amazon.com https://5.imimg.com https://png.pngtree.com https://www.google-analytics.com https://pagead2.googlesyndication.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://pagead2.googlesyndication.com https://*.vercel.app",
            "frame-src 'self' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com",
            "frame-ancestors 'none'",
          ].join('; '),
        },
      ],
    },
  ],
};

export default nextConfig;