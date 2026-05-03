import { Client, Account, Databases, Users, Storage } from 'node-appwrite';
import { DATABASE_ID, COLLECTIONS } from './collections';

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

async function appwriteFetch(collectionId: string, queries: string[] = []) {
  const baseUrl = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}/documents`;
  
  // Construct query string
  const url = new URL(baseUrl);
  queries.forEach(q => url.searchParams.append('queries[]', q));

  const res = await fetch(url.toString(), {
    headers: {
      'x-appwrite-project': PROJECT_ID!,
      'Content-Type': 'application/json',
      // If we had a server API key we'd pass 'x-appwrite-key' here, but this is hitting the public read endpoint
    },
    next: { revalidate: 60 } // ISR for each fetch
  });
  
  if (!res.ok) {
    console.error(`[Appwrite] Failed to fetch collection ${collectionId}: ${res.statusText}`);
    return { documents: [] };
  }
  return res.json();
}

export async function getServerSideData() {
  try {
    const [incidents, alerts, profiles, operatives] = await Promise.all([
      // Only fetch the latest 100 incidents ordered by creation
      appwriteFetch(COLLECTIONS.INCIDENTS, ['limit(100)', 'orderDesc("$createdAt")']),
      // Fetch active alerts
      appwriteFetch(COLLECTIONS.ALERTS, ['limit(50)', 'orderDesc("$createdAt")']),
      // Profiles and operatives usually don't need all records at once on server load, just recent ones
      appwriteFetch(COLLECTIONS.PROFILES, ['limit(100)', 'orderDesc("$createdAt")']),
      appwriteFetch(COLLECTIONS.OPERATIVES, ['limit(100)', 'orderDesc("reputation")']),
    ]);

    return {
      incidents: incidents.documents || [],
      alerts: alerts.documents || [],
      profiles: profiles.documents || [],
      operatives: operatives.documents || [],
    };
  } catch (error) {
    console.error('Failed to fetch server-side data:', error);
    return { incidents: [], alerts: [], profiles: [], operatives: [] };
  }
}
