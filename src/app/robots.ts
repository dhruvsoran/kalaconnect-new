import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/cart', '/checkout', '/api/', '/auth/', '/verify-email/'],
      },
    ],
    sitemap: 'https://www.kalaconnect.me/sitemap.xml',
  };
}
