// ─── Alert Service ──────────────────────────────────────────

import { databases, ID, Query } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { publicReadPermissions } from '@/lib/appwrite/permissions';
import type { Alert, CreateAlertData } from '@/types/alert.types';

/**
 * Create a new alert (moderator/admin only).
 */
export async function createAlert(
  data: CreateAlertData,
  createdBy: string
): Promise<Alert> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ALERTS,
    ID.unique(),
    {
      ...data,
      createdBy,
      timestamp: new Date().toISOString(),
      isActive: true,
      expiresAt: data.expiresAt || '',
    },
    publicReadPermissions()
  );

  return doc as unknown as Alert;
}

/**
 * Get active alerts for specific areas.
 */
export async function getAlertsForAreas(areas: string[]): Promise<Alert[]> {
  // Note: Appwrite doesn't have a direct array-contains query for string arrays.
  // We fetch all active alerts and filter client-side for area matching.
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ALERTS,
    [
      Query.equal('isActive', true),
      Query.orderDesc('severity'),
      Query.limit(50),
    ]
  );

  const alerts = response.documents as unknown as Alert[];

  if (areas.length === 0) return alerts;

  return alerts.filter((alert) =>
    alert.affectedAreas.some((area) => areas.includes(area))
  );
}

/**
 * Deactivate an alert.
 */
export async function deactivateAlert(alertId: string): Promise<void> {
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.ALERTS,
    alertId,
    { isActive: false }
  );
}

/**
 * Auto-deactivate expired alerts (called periodically).
 */
export async function cleanupExpiredAlerts(): Promise<number> {
  const now = new Date().toISOString();
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ALERTS,
    [
      Query.equal('isActive', true),
      Query.lessThan('expiresAt', now),
      Query.limit(100),
    ]
  );

  let deactivated = 0;
  for (const doc of response.documents) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ALERTS,
        doc.$id,
        { isActive: false }
      );
      deactivated++;
    } catch {
      // Continue with others
    }
  }

  return deactivated;
}
