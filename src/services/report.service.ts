// ─── Report Service ─────────────────────────────────────────

import { databases, ID } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { sensitiveReportPermissions } from '@/lib/appwrite/permissions';
import type { Report, CreateReportData } from '@/types/report.types';

/**
 * Submit a new report for an incident.
 */
export async function createReport(
  data: CreateReportData,
  reporterId: string
): Promise<Report> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.REPORTS,
    ID.unique(),
    {
      ...data,
      reporterId,
      timestamp: new Date().toISOString(),
      isVerified: false,
      verificationNotes: '',
      mediaUrl: data.mediaUrl || '',
      location: data.location || [],
    },
    sensitiveReportPermissions(reporterId)
  );

  return doc as unknown as Report;
}

/**
 * Verify a report (moderator action).
 */
export async function verifyReport(
  reportId: string,
  notes: string
): Promise<void> {
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.REPORTS,
    reportId,
    {
      isVerified: true,
      verificationNotes: notes,
    }
  );
}
