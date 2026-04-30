'use client';

import { useEffect, useState } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useToast } from '@/hooks/useToast';
import type { Incident } from '@/types/incident.types';

import { client } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';

export default function AlertToasts() {
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.INCIDENTS}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          const incident = response.payload as unknown as Incident;
          showToast({
            title: 'NEW INTELLIGENCE NODE',
            message: `${incident.severity.toUpperCase()}: ${incident.title} in ${incident.locationId}`,
            type: incident.severity === 'critical' ? 'error' : 'warning',
          });
        }
      }
    );
    
    return () => unsubscribe();
  }, [showToast]);

  return null;
}
