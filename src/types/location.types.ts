// ─── Location Types ─────────────────────────────────────────

export type LocationType = 'area' | 'landmark' | 'building' | 'street';

export type OkhlaArea =
  | 'okhla_phase_1'
  | 'okhla_phase_2'
  | 'jamia_nagar'
  | 'zakir_nagar'
  | 'abul_fazal_enclave'
  | 'shaheen_bagh'
  | 'johri_farm'
  | 'okhla_vihar'
  | 'jasola'
  | 'batla_house';

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
  okhla_phase_1:      { label: 'Okhla Phase 1',       center: [28.5310, 77.2710] },
  okhla_phase_2:      { label: 'Okhla Phase 2',       center: [28.5270, 77.2750] },
  jamia_nagar:         { label: 'Jamia Nagar',          center: [28.5620, 77.2800] },
  zakir_nagar:         { label: 'Zakir Nagar',          center: [28.5650, 77.2830] },
  abul_fazal_enclave:  { label: 'Abul Fazal Enclave',   center: [28.5530, 77.2850] },
  shaheen_bagh:        { label: 'Shaheen Bagh',         center: [28.5440, 77.2940] },
  johri_farm:          { label: 'Johri Farm',           center: [28.5560, 77.2900] },
  okhla_vihar:         { label: 'Okhla Vihar',          center: [28.5340, 77.2820] },
  jasola:              { label: 'Jasola',               center: [28.5400, 77.2600] },
  batla_house:         { label: 'Batla House',          center: [28.5590, 77.2790] },
};
