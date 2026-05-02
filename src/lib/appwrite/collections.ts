// ─── Collection & Database ID Constants ─────────────────────

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '69f1a846000d7192b02e';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID ?? '69f5944300300e80373d';

export const COLLECTIONS = {
  INCIDENTS: process.env.NEXT_PUBLIC_COLLECTION_INCIDENTS ?? 'incidents',
  LOCATIONS: process.env.NEXT_PUBLIC_COLLECTION_LOCATIONS ?? 'locations',
  OPERATIVES: process.env.NEXT_PUBLIC_COLLECTION_USERS     ?? 'operatives',
  REPORTS:    process.env.NEXT_PUBLIC_COLLECTION_REPORTS   ?? 'reports',
  ALERTS:     process.env.NEXT_PUBLIC_COLLECTION_ALERTS    ?? 'alerts',
  PROFILES:   process.env.NEXT_PUBLIC_COLLECTION_PROFILES  ?? 'profiles',
} as const;

export type CollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
