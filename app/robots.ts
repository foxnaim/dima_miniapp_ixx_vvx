import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || 'https://miniapp.local';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

