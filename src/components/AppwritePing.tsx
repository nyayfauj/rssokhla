// ─── Appwrite Connection Ping ───────────────────────────────
// Auto-verifies Appwrite backend connectivity on app load

'use client';

import { useEffect } from 'react';
import { client, account } from '@/lib/appwrite/client';
import { useAuthStore } from '@/stores/auth.store';

export default function AppwritePing() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state (checks for active session)
    initialize().then(() => {
      console.log('✅ [Auth] Initialization complete.');
    });
  }, [initialize]);

  return null;
}
