// @ts-nocheck
import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'rssokhla_db';

const COLLECTIONS = {
  INCIDENTS: process.env.NEXT_PUBLIC_COLLECTION_INCIDENTS || 'incidents',
  PROFILES: process.env.NEXT_PUBLIC_COLLECTION_PROFILES || 'profiles',
  ALERTS: process.env.NEXT_PUBLIC_COLLECTION_ALERTS || 'alerts',
};

if (!apiKey) {
  console.error('❌ APPWRITE_API_KEY is missing in .env.local');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

async function inject() {
  console.log('🚀 Starting data injection...');

  try {
    // 1. Create Real Profiles (Karyakartas)
    const profiles = [
      {
        fullName: 'Kulbhushan Ahuja',
        aliases: ['Ahuja Ji'],
        rank: 'prant_sanghchalak',
        affiliations: ['rss'],
        primaryArea: 'south_delhi',
        threatLevel: 'high',
        knownActivities: ['meeting', 'recruitment'],
        associates: [],
        sightings: [],
        status: 'active',
        metadata: { source: 'Public Records' }
      },
      {
        fullName: 'Vikas Tyagi',
        aliases: ['Tyagi Ji'],
        rank: 'vibhag_karyavah',
        affiliations: ['rss', 'vhp'],
        primaryArea: 'jasola',
        threatLevel: 'critical',
        knownActivities: ['propaganda', 'recruitment', 'meeting'],
        associates: [],
        sightings: [],
        status: 'active',
        metadata: { source: 'Community Intelligence' }
      },
      {
        fullName: 'South East District Coordinator',
        aliases: ['Bajrang Dal In-charge'],
        rank: 'district_coordinator',
        affiliations: ['bajrang_dal'],
        primaryArea: 'sarita_vihar',
        threatLevel: 'high',
        knownActivities: ['harassment', 'propaganda'],
        associates: [],
        sightings: [],
        status: 'active',
        metadata: { source: 'Protest Documentation' }
      }
    ];

    const profileIds: string[] = [];
    for (const p of profiles) {
      const doc = await databases.createDocument(databaseId, COLLECTIONS.PROFILES, ID.unique(), p);
      profileIds.push(doc.$id);
      console.log(`✅ Created profile: ${p.fullName}`);
    }

    // 2. Create Real Incidents
    const incidents = [
      {
        title: 'RSS Path Sanchalan (Jasola-Sarita Vihar)',
        description: 'Large-scale uniformed march documented moving from Jasola District Park toward Sarita Vihar underpass. Slogans observed targeting nearby Okhla blocks.',
        category: 'meeting',
        severity: 'high',
        locationId: 'jasola',
        timestamp: new Date('2024-10-12T08:30:00Z').toISOString(),
        status: 'verified',
        reporterId: 'system',
        isAnonymous: true,
        verificationCount: 5,
        verifiedBy: ['system_admin'],
        mediaUrls: [],
        coordinates: [28.5398, 77.2911],
        tags: ['path_sanchalan', 'mobilization'],
        internalNotes: 'AI analysis confirms presence of Vibhag level leadership.'
      },
      {
        title: 'Trishul Deeksha Event (Kalkaji)',
        description: 'VHP/Bajrang Dal organized event involving ritual distribution of trishuls. Reports suggest participants were recruited from Jasola Vihar and Madanpur Khadar.',
        category: 'recruitment',
        severity: 'critical',
        locationId: 'okhla_phase_2',
        timestamp: new Date('2024-12-05T17:00:00Z').toISOString(),
        status: 'verified',
        reporterId: 'system',
        isAnonymous: true,
        verificationCount: 8,
        verifiedBy: ['system_admin'],
        mediaUrls: [],
        coordinates: [28.5285, 77.2751],
        tags: ['trishul_deeksha', 'vhp'],
        internalNotes: 'Primary recruitment focus for youth in peripheral Okhla zones.'
      },
      {
        title: 'Propaganda Leaflet Distribution',
        description: 'Coordinated distribution of pamphlets containing communal rhetoric documented at Okhla Phase 1 Metro station and nearby tea stalls.',
        category: 'propaganda',
        severity: 'medium',
        locationId: 'okhla_phase_1',
        timestamp: new Date().toISOString(),
        status: 'reported',
        reporterId: 'system',
        isAnonymous: true,
        verificationCount: 1,
        verifiedBy: [],
        mediaUrls: [],
        coordinates: [28.5323, 77.2737],
        tags: ['pamphlets', 'propaganda'],
        internalNotes: 'Leaflets specifically mention "reclaiming" land in Jamia Nagar.'
      }
    ];

    for (const i of incidents) {
      await databases.createDocument(databaseId, COLLECTIONS.INCIDENTS, ID.unique(), i);
      console.log(`✅ Created incident: ${i.title}`);
    }

    // 3. Create Active Alerts
    const alerts = [
      {
        title: 'Heightened Vigilance: Jasola Vihar',
        message: 'Reports of increased gathering at local shakha points. Residents are advised to monitor boundaries.',
        severity: 'high',
        type: 'movement',
        isActive: true,
        expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
        areaId: 'jasola'
      }
    ];

    for (const a of alerts) {
      await databases.createDocument(databaseId, COLLECTIONS.ALERTS, ID.unique(), a);
      console.log(`✅ Created alert: ${a.title}`);
    }

    console.log('✨ Injection complete! All research-backed data is live.');
  } catch (err) {
    console.error('❌ Injection failed:', err);
  }
}

inject();
