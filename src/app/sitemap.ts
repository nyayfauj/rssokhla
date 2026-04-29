// ─── Dynamic Sitemap for Public Incident URLs ──────────────
// Auto-generates sitemap.xml for Google to discover verified reports

import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/appwrite/server';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { Query } from 'node-appwrite';

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://nyayfauj.org';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
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
      priority: 0.5,
    },
  ];

  // Fetch latest 500 verified incidents for indexing
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
        changeFrequency: 'never',
        priority: 0.8,
      });
    }
  } catch {
    // If Appwrite is not configured, return static entries only
    console.warn('[Sitemap] Could not fetch incidents from Appwrite — returning static entries only');
  }

  return entries;
}
