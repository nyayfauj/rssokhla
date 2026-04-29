// ─── Database Seed Script ───────────────────────────────────
// Run: npx tsx scripts/seed-database.ts

const SAMPLE_LOCATIONS = [
  { name: 'Shaheen Bagh Market', type: 'area', area: 'shaheen_bagh', coordinates: [28.5440, 77.2940], riskLevel: 'high', description: 'Commercial area near river' },
  { name: 'Jamia Millia Islamia Gate', type: 'landmark', area: 'jamia_nagar', coordinates: [28.5620, 77.2800], riskLevel: 'medium', description: 'University main entrance' },
  { name: 'Abul Fazal Enclave Park', type: 'area', area: 'abul_fazal_enclave', coordinates: [28.5530, 77.2850], riskLevel: 'medium', description: 'Residential park area' },
  { name: 'Zakir Nagar Main Road', type: 'street', area: 'zakir_nagar', coordinates: [28.5650, 77.2830], riskLevel: 'low', description: 'Primary commercial street' },
  { name: 'Batla House', type: 'area', area: 'batla_house', coordinates: [28.5590, 77.2790], riskLevel: 'high', description: 'Residential neighborhood' },
  { name: 'Okhla Phase 1 Industrial', type: 'area', area: 'okhla_phase_1', coordinates: [28.5310, 77.2710], riskLevel: 'low', description: 'Industrial zone' },
  { name: 'Johri Farm Masjid', type: 'landmark', area: 'johri_farm', coordinates: [28.5560, 77.2900], riskLevel: 'medium', description: 'Mosque and surrounding area' },
  { name: 'Okhla Vihar Colony', type: 'area', area: 'okhla_vihar', coordinates: [28.5340, 77.2820], riskLevel: 'low', description: 'Residential colony' },
  { name: 'Jasola Apollo Hospital', type: 'building', area: 'jasola', coordinates: [28.5400, 77.2600], riskLevel: 'low', description: 'Hospital and surrounding area' },
  { name: 'Okhla Phase 2 Market', type: 'area', area: 'okhla_phase_2', coordinates: [28.5270, 77.2750], riskLevel: 'medium', description: 'Local market' },
];

const SAMPLE_INCIDENTS = [
  { title: 'Recruitment flyers distributed', category: 'recruitment', severity: 'medium', description: 'Printed materials found near local school promoting youth activities with nationalist themes.', area: 'shaheen_bagh', status: 'reported' },
  { title: 'Unscheduled gathering observed', category: 'meeting', severity: 'high', description: 'Group of 30+ persons assembled at community hall without prior notice.', area: 'batla_house', status: 'verified' },
  { title: 'Suspicious surveillance activity', category: 'surveillance', severity: 'critical', description: 'Unknown individuals seen photographing residential properties and noting addresses.', area: 'jamia_nagar', status: 'reported' },
  { title: 'Propaganda posters on walls', category: 'propaganda', severity: 'low', description: 'Posters with divisive messaging found pasted on compound walls in residential lanes.', area: 'zakir_nagar', status: 'resolved' },
  { title: 'Door-to-door canvassing reported', category: 'recruitment', severity: 'medium', description: 'Teams going door-to-door distributing pamphlets and collecting personal information.', area: 'abul_fazal_enclave', status: 'reported' },
  { title: 'Vehicle with loudspeaker', category: 'propaganda', severity: 'medium', description: 'Vehicle playing recorded messages driving through residential areas during evening.', area: 'okhla_phase_2', status: 'verified' },
  { title: 'Intimidation report at shop', category: 'harassment', severity: 'high', description: 'Local shopkeeper reported being pressured to display specific flags and comply with demands.', area: 'johri_farm', status: 'reported' },
  { title: 'Youth camp announcement', category: 'recruitment', severity: 'medium', description: 'Notices for summer camp targeting teenagers with military-style training activities.', area: 'okhla_vihar', status: 'reported' },
];

const SAMPLE_ALERTS = [
  { title: 'Increased Activity - Shaheen Bagh', message: 'Multiple incidents reported in Shaheen Bagh area. Exercise caution and report any unusual activity.', severity: 'high', affectedAreas: ['shaheen_bagh', 'abul_fazal_enclave'] },
  { title: 'Surveillance Alert', message: 'Reports of unknown individuals conducting surveillance near educational institutions.', severity: 'critical', affectedAreas: ['jamia_nagar', 'batla_house'] },
  { title: 'Community Advisory', message: 'Local authorities have been notified about recent recruitment activities. Stay vigilant.', severity: 'medium', affectedAreas: ['okhla_phase_1', 'okhla_phase_2', 'okhla_vihar'] },
];

console.log('=== RSS Okhla Seed Data ===');
console.log(`Locations: ${SAMPLE_LOCATIONS.length}`);
console.log(`Incidents: ${SAMPLE_INCIDENTS.length}`);
console.log(`Alerts: ${SAMPLE_ALERTS.length}`);
console.log('\nTo seed: Configure Appwrite SDK and run create operations.');
console.log('Sample data is ready for import via Appwrite Console or SDK.');

export { SAMPLE_LOCATIONS, SAMPLE_INCIDENTS, SAMPLE_ALERTS };
