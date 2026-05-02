import CommandCenter from './CommandCenter';
import { getServerSideData } from '@/lib/appwrite/server';
import type { Incident } from '@/types/incident.types';
import type { Alert } from '@/types/alert.types';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

export const revalidate = 60; // Revalidate every minute (ISR)

export default async function Page() {
  const data = await getServerSideData();

  return (
    <CommandCenter 
      initialIncidents={data.incidents as unknown as Incident[]} 
      initialAlerts={data.alerts as unknown as Alert[]}
      initialProfiles={data.profiles as unknown as KaryakartaProfile[]}
      initialOperatives={data.operatives as any[]}
    />
  );
}
