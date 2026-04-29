// ─── Appwrite Client-Side Initialization ────────────────────
// Used in 'use client' components and browser-side operations

import { Client, Account, Databases, Storage, Functions } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://sgp.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '69f1097f000ad36f6b04';

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  console.info('[Appwrite] Using hardcoded fallback for Project ID.');
}

export const client = new Client();

client.setEndpoint(endpoint).setProject(projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { ID, Query, Permission, Role } from 'appwrite';
