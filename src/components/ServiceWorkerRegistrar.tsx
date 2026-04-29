// ─── ServiceWorkerRegistrar ─────────────────────────────────

'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope);

          // Listen for background sync messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'SYNC_OFFLINE_REPORTS') {
              // Dispatch custom event for the app to handle
              window.dispatchEvent(new CustomEvent('sync-offline-reports'));
            }
          });
        })
        .catch((err) => {
          console.error('[SW] Registration failed:', err);
        });
    }
  }, []);

  return null;
}
