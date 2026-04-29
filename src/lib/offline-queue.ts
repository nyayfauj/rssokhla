// ─── Offline Queue for Incident Reports ─────────────────────
import type { PendingIncident } from '@/types/incident.types';

const DB_NAME = 'nyayfauj_offline';
const STORE_NAME = 'pending_reports';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(STORE_NAME, { keyPath: 'offlineId' }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePendingReport(report: PendingIncident): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(report);
  return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
}

export async function getPendingReports(): Promise<PendingIncident[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const req = tx.objectStore(STORE_NAME).getAll();
  return new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
}

export async function removePendingReport(offlineId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(offlineId);
  return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
}

export async function getPendingCount(): Promise<number> {
  const reports = await getPendingReports();
  return reports.length;
}

/** Attempt to sync all pending reports. Returns count of successfully synced. */
export async function syncPendingReports(
  submitFn: (report: PendingIncident) => Promise<boolean>
): Promise<number> {
  const pending = await getPendingReports();
  let synced = 0;
  for (const report of pending) {
    try {
      const success = await submitFn({ ...report, syncStatus: 'syncing' });
      if (success) { await removePendingReport(report.offlineId); synced++; }
    } catch { /* keep for retry */ }
  }
  return synced;
}
