// ─── Incident Service ───────────────────────────────────────

import { databases, ID, Query } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { ownerPermissions, anonymousSubmissionPermissions } from '@/lib/appwrite/permissions';
import type { Incident, CreateIncidentData } from '@/types/incident.types';

/**
 * Create a new incident report with proper permissions.
 */
export async function createIncident(
  data: CreateIncidentData,
  userId: string,
  isAnonymous: boolean
): Promise<Incident> {
  const permissions = isAnonymous
    ? anonymousSubmissionPermissions()
    : ownerPermissions(userId);

  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.INCIDENTS,
    ID.unique(),
    {
      ...data,
      reporterId: userId,
      timestamp: new Date().toISOString(),
      status: 'reported',
      isAnonymous,
      verifiedBy: [],
      verificationCount: 0,
      mediaUrls: data.mediaUrls || [],
      coordinates: data.coordinates || [],
      tags: data.tags || [],
    },
    permissions
  );

  // Increment reporter's submission count
  try {
    const userDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, userId);
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, userId, {
      reportsSubmitted: ((userDoc as Record<string, unknown>).reportsSubmitted as number || 0) + 1,
    });
  } catch {
    // Non-critical
  }

  return doc as unknown as Incident;
}

/**
 * Get incidents near a specific coordinate (within radius).
 */
export async function getIncidentsNearLocation(
  lat: number,
  lng: number,
  radiusDeg: number = 0.01 // ~1.1km at equator
): Promise<Incident[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.INCIDENTS,
    [
      Query.greaterThan('coordinates', [lat - radiusDeg, lng - radiusDeg]),
      Query.lessThan('coordinates', [lat + radiusDeg, lng + radiusDeg]),
      Query.orderDesc('timestamp'),
      Query.limit(50),
    ]
  );

  return response.documents as unknown as Incident[];
}

/**
 * Get incident statistics for a specific area.
 */
export async function getAreaStats(area: string): Promise<{
  total: number;
  critical: number;
  unverified: number;
}> {
  const [total, critical, unverified] = await Promise.all([
    databases.listDocuments(DATABASE_ID, COLLECTIONS.INCIDENTS, [
      Query.limit(1),
    ]),
    databases.listDocuments(DATABASE_ID, COLLECTIONS.INCIDENTS, [
      Query.equal('severity', 'critical'),
      Query.limit(1),
    ]),
    databases.listDocuments(DATABASE_ID, COLLECTIONS.INCIDENTS, [
      Query.equal('status', 'reported'),
      Query.limit(1),
    ]),
  ]);

  return {
    total: total.total,
    critical: critical.total,
    unverified: unverified.total,
  };
}
