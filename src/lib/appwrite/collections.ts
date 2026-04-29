// ─── Collection & Database ID Constants ─────────────────────

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? '69f1a846000d7192b02e';

export const COLLECTIONS = {
  INCIDENTS: process.env.NEXT_PUBLIC_COLLECTION_INCIDENTS ?? 'incidents',
  LOCATIONS: process.env.NEXT_PUBLIC_COLLECTION_LOCATIONS ?? 'locations',
  USERS:     process.env.NEXT_PUBLIC_COLLECTION_USERS     ?? 'users',
  REPORTS:   process.env.NEXT_PUBLIC_COLLECTION_REPORTS   ?? 'reports',
  ALERTS:    process.env.NEXT_PUBLIC_COLLECTION_ALERTS    ?? 'alerts',
  PROFILES:  process.env.NEXT_PUBLIC_COLLECTION_PROFILES  ?? 'profiles',
} as const;

export type CollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
