import { DATABASE_ID, COLLECTIONS } from './collections';

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

async function appwriteFetch(collectionId: string) {
  const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents`;
  const res = await fetch(url, {
    headers: {
      'x-appwrite-project': PROJECT_ID!,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 } // ISR for each fetch
  });
  
  if (!res.ok) return { documents: [] };
  return res.json();
}

export async function getServerSideData() {
  try {
    const [incidents, alerts, profiles] = await Promise.all([
      appwriteFetch(COLLECTIONS.INCIDENTS),
      appwriteFetch(COLLECTIONS.ALERTS),
      appwriteFetch(COLLECTIONS.PROFILES),
    ]);

    return {
      incidents: incidents.documents || [],
      alerts: alerts.documents || [],
      profiles: profiles.documents || [],
    };
  } catch (error) {
    console.error('Failed to fetch server-side data:', error);
    return { incidents: [], alerts: [], profiles: [] };
  }
}
