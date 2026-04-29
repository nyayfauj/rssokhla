// ─── Appwrite Connection Ping ───────────────────────────────
// Auto-verifies Appwrite backend connectivity on app load

'use client';

import { useEffect } from 'react';
import { client } from '@/lib/appwrite/client';

export default function AppwritePing() {
  useEffect(() => {
    client.ping()
      .then(() => {
        console.log('✅ [Appwrite] Connection verified — backend is reachable');
      })
      .catch((err: unknown) => {
        console.error('❌ [Appwrite] Connection failed:', err);
      });
  }, []);

  return null;
}
