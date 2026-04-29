import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rssokhla.site';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/p/*'],
      disallow: ['/admin/', '/dashboard/', '/api/', '/incidents/', '/profiles/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
