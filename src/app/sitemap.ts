import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { Query } from 'node-appwrite';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://rssokhla.site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/sangathan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${DOMAIN}/incidents`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/profiles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${DOMAIN}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/anonymous`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  try {
    const { databases } = createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.INCIDENTS,
      [
        Query.equal('status', 'verified'),
        Query.orderDesc('$createdAt'),
        Query.limit(500),
      ]
    );

    for (const doc of response.documents) {
      entries.push({
        url: `${DOMAIN}/p/${doc.$id}`,
        lastModified: new Date(doc.$updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    console.warn('[Sitemap] Could not fetch incidents from Appwrite — returning static entries only');
  }

  return entries;
}
