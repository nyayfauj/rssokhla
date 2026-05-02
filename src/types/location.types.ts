// ─── Location Types ─────────────────────────────────────────

export type LocationType = 'area' | 'landmark' | 'building' | 'street';

/** Canonical Wards of Okhla as per MC Delhi */
export type OkhlaArea =
  | 'sarita_vihar'
  | 'zakir_nagar'
  | 'abul_fazal'
  | 'madanpur_khadar_west'
  | 'madanpur_khadar_east'
  | 'shaheen_bagh'
  | 'batla_house'
  | 'jamia_nagar'
  | 'abul_fazal_enclave'
  | 'johri_farm'
  | 'okhla_phase_1'
  | 'okhla_phase_2'
  | 'okhla_vihar'
  | 'jasola';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Location {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  type: LocationType;
  coordinates: number[];
  area: OkhlaArea;
  description: string;
  riskLevel: RiskLevel;
  lastActivity: string;
}

export interface CreateLocationData {
  name: string;
  type: LocationType;
  coordinates: number[];
  area: OkhlaArea;
  description?: string;
  riskLevel: RiskLevel;
}

/** Predefined Okhla area metadata with display names and center coordinates */
export const OKHLA_AREAS: Record<OkhlaArea, { label: string; center: [number, number] }> = {
  sarita_vihar:          { label: 'Sarita Vihar',          center: [28.5292, 77.2874] },
  zakir_nagar:           { label: 'Zakir Nagar',           center: [28.5633, 77.2828] },
  abul_fazal:            { label: 'Abul Fazal Enclave',    center: [28.5516, 77.2917] },
  madanpur_khadar_west:  { label: 'Madanpur Khadar West',  center: [28.5255, 77.3012] },
  madanpur_khadar_east:  { label: 'Madanpur Khadar East',  center: [28.5122, 77.3155] },
  shaheen_bagh:          { label: 'Shaheen Bagh',          center: [28.5394, 77.2974] },
  batla_house:           { label: 'Batla House',           center: [28.5603, 77.2858] },
  jamia_nagar:           { label: 'Jamia Nagar',           center: [28.5583, 77.2828] },
  abul_fazal_enclave:    { label: 'Abul Fazal Enclave',    center: [28.5516, 77.2917] },
  johri_farm:            { label: 'Johri Farm',            center: [28.5555, 77.2917] },
  okhla_phase_1:         { label: 'Okhla Phase 1',         center: [28.5333, 77.2755] },
  okhla_phase_2:         { label: 'Okhla Phase 2',         center: [28.5233, 77.2755] },
  okhla_vihar:           { label: 'Okhla Vihar',           center: [28.5483, 77.2955] },
  jasola:                { label: 'Jasola',                center: [28.5383, 77.2855] },
};
