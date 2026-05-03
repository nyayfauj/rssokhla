import type { Metadata } from 'next';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import IncidentClient from './IncidentClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const incident = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.INCIDENTS,
      id
    );

    return {
      title: `${incident.title} — Incident Report`,
      description: incident.description?.slice(0, 150) + '...',
      openGraph: {
        title: incident.title,
        description: incident.description?.slice(0, 150) + '...',
        images: incident.mediaUrls && incident.mediaUrls.length > 0 ? [incident.mediaUrls[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Incident Report — NyayFauj',
    };
  }
}

export default function IncidentPage() {
  return <IncidentClient />;
}
