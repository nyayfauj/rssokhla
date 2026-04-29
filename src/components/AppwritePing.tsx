// ─── Appwrite Connection Ping ───────────────────────────────
// Auto-verifies Appwrite backend connectivity on app load

'use client';

import { useEffect } from 'react';
import { client } from '@/lib/appwrite/client';

export default function AppwritePing() {
  useEffect(() => {
    // account.get() is a valid way to check connectivity. 
    // It will return 401 if not logged in, but the promise will still settle.
    account.get()
      .then(() => {
        console.log('✅ [Appwrite] Session active.');
      })
      .catch((err: any) => {
        if (err.code === 401) {
          console.log('✅ [Appwrite] Backend reachable (Guest session).');
        } else {
          console.error('❌ [Appwrite] Connection failed:', err);
        }
      });
  }, []);

  return null;
}
