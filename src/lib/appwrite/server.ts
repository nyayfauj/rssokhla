// ─── Appwrite Server-Side Initialization ────────────────────
// Used in API routes and server components only
// Creates per-request client instances to prevent session leakage

import { Client, Account, Databases, Users, Storage } from 'node-appwrite';
import { cookies } from 'next/headers';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '';
const apiKey = process.env.APPWRITE_API_KEY ?? '';

/**
 * Create an admin client with full API key access.
 * Use for server-side operations that need elevated permissions.
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return {
    get account() { return new Account(client); },
    get databases() { return new Databases(client); },
    get users() { return new Users(client); },
    get storage() { return new Storage(client); },
  };
}

/**
 * Create a session client scoped to the current user's session cookie.
 * Use for operations that should respect the user's permissions.
 */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get('rssokhla-session');

  if (session) {
    client.setSession(session.value);
  }

  return {
    get account() { return new Account(client); },
    get databases() { return new Databases(client); },
    get storage() { return new Storage(client); },
  };
}
