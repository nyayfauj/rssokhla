// ─── Mock Data for Public Dashboard ─────────────────────────

import type { OkhlaArea } from '@/types/location.types';

export interface MockIncident {
  id: string;
  title: string;
  description: string;
  category: 'recruitment' | 'propaganda' | 'meeting' | 'surveillance' | 'harassment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'verified' | 'resolved' | 'false_positive';
  area: OkhlaArea;
  timestamp: string;
  verificationCount: number;
  isAnonymous: boolean;
}

export interface MockAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  areas: OkhlaArea[];
  timestamp: string;
}

const now = Date.now();
const h = (hours: number) => new Date(now - hours * 3600000).toISOString();

export const MOCK_INCIDENTS: MockIncident[] = [
  { id: '1', title: 'Recruitment flyers near school', description: 'Printed materials found promoting youth activities with nationalist themes near local school.', category: 'recruitment', severity: 'medium', status: 'reported', area: 'shaheen_bagh', timestamp: h(0.5), verificationCount: 1, isAnonymous: true },
  { id: '2', title: 'Unscheduled gathering at community hall', description: 'Group of 30+ persons assembled without prior notice. Several vehicles with outside plates observed.', category: 'meeting', severity: 'high', status: 'verified', area: 'batla_house', timestamp: h(1.2), verificationCount: 4, isAnonymous: false },
  { id: '3', title: 'Surveillance of residential blocks', description: 'Unknown individuals photographing residential properties and noting addresses in Jamia Nagar sector.', category: 'surveillance', severity: 'critical', status: 'reported', area: 'jamia_nagar', timestamp: h(2), verificationCount: 2, isAnonymous: true },
  { id: '4', title: 'Propaganda posters on walls', description: 'Divisive messaging posters pasted on compound walls in residential lanes overnight.', category: 'propaganda', severity: 'low', status: 'resolved', area: 'zakir_nagar', timestamp: h(5), verificationCount: 3, isAnonymous: false },
  { id: '5', title: 'Door-to-door canvassing teams', description: 'Teams going door-to-door distributing pamphlets and collecting personal information from residents.', category: 'recruitment', severity: 'medium', status: 'reported', area: 'abul_fazal_enclave', timestamp: h(3), verificationCount: 0, isAnonymous: true },
  { id: '6', title: 'Vehicle with loudspeaker', description: 'Vehicle playing recorded messages driving through residential areas during evening hours.', category: 'propaganda', severity: 'medium', status: 'verified', area: 'okhla_phase_2', timestamp: h(7), verificationCount: 5, isAnonymous: false },
  { id: '7', title: 'Shopkeeper intimidation report', description: 'Local shopkeeper reported being pressured to display specific flags and comply with demands.', category: 'harassment', severity: 'high', status: 'reported', area: 'johri_farm', timestamp: h(4), verificationCount: 1, isAnonymous: true },
  { id: '8', title: 'Youth camp announcement', description: 'Notices for summer camp targeting teenagers with military-style training activities distributed.', category: 'recruitment', severity: 'medium', status: 'reported', area: 'okhla_vihar', timestamp: h(8), verificationCount: 0, isAnonymous: false },
  { id: '9', title: 'Unidentified drone activity', description: 'Small drone spotted hovering over residential area near Shaheen Bagh market in early morning.', category: 'surveillance', severity: 'critical', status: 'reported', area: 'shaheen_bagh', timestamp: h(1), verificationCount: 3, isAnonymous: true },
  { id: '10', title: 'Graffiti and symbols on mosque wall', description: 'Provocative symbols and slogans spray-painted on the outer wall of the local mosque.', category: 'harassment', severity: 'high', status: 'verified', area: 'batla_house', timestamp: h(6), verificationCount: 6, isAnonymous: false },
  { id: '11', title: 'Suspicious literature distribution', description: 'Pamphlets with divisive content being handed out at the main market intersection.', category: 'propaganda', severity: 'medium', status: 'reported', area: 'jasola', timestamp: h(9), verificationCount: 1, isAnonymous: true },
  { id: '12', title: 'Coordinated photography of mosques', description: 'Multiple individuals systematically photographing religious buildings from different angles.', category: 'surveillance', severity: 'high', status: 'reported', area: 'jamia_nagar', timestamp: h(3.5), verificationCount: 2, isAnonymous: false },
];

export const MOCK_ALERTS: MockAlert[] = [
  { id: 'a1', title: '⚠ HEIGHTENED ACTIVITY — Shaheen Bagh', message: 'Multiple surveillance and recruitment incidents in 24hrs', severity: 'critical', areas: ['shaheen_bagh', 'abul_fazal_enclave'], timestamp: h(0.3) },
  { id: 'a2', title: 'Surveillance Alert — Jamia Nagar', message: 'Coordinated photography of religious sites reported', severity: 'high', areas: ['jamia_nagar', 'batla_house'], timestamp: h(2) },
  { id: 'a3', title: 'Community Advisory', message: 'Increased recruitment activity across southern sectors', severity: 'medium', areas: ['okhla_phase_1', 'okhla_phase_2', 'okhla_vihar'], timestamp: h(6) },
];
