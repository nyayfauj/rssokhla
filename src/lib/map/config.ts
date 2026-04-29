// ─── Mapbox Configuration ───────────────────────────────────

import type { OkhlaArea } from '@/types/location.types';
import { OKHLA_AREAS } from '@/types/location.types';

// ─── Token (from env) ───────────────────────────────────────
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// ─── Okhla Center & Bounds ──────────────────────────────────
export const OKHLA_CENTER: [number, number] = [77.2810, 28.5500]; // [lng, lat]
export const OKHLA_ZOOM = 13.5;
export const OKHLA_BOUNDS: [[number, number], [number, number]] = [
  [77.2500, 28.5200], // SW
  [77.3100, 28.5750], // NE
];

// ─── Geofence Zones (50-100m radius circles) ────────────────
export interface GeoZone {
  id: string;
  area: OkhlaArea;
  label: string;
  center: [number, number]; // [lng, lat]
  radius: number;           // meters
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  type: 'shakha' | 'gathering' | 'recruitment' | 'surveillance' | 'safe_zone' | 'landmark';
}

export const GEOFENCE_ZONES: GeoZone[] = [
  // Shaheen Bagh
  { id: 'gz-1', area: 'shaheen_bagh', label: 'Shaheen Bagh Market', center: [77.2940, 28.5440], radius: 80, riskLevel: 'high', type: 'gathering' },
  { id: 'gz-2', area: 'shaheen_bagh', label: 'Shaheen Bagh Park', center: [77.2950, 28.5435], radius: 60, riskLevel: 'medium', type: 'recruitment' },
  // Batla House
  { id: 'gz-3', area: 'batla_house', label: 'Batla House Junction', center: [77.2790, 28.5590], radius: 100, riskLevel: 'critical', type: 'gathering' },
  { id: 'gz-4', area: 'batla_house', label: 'Batla House Community Hall', center: [77.2785, 28.5585], radius: 50, riskLevel: 'high', type: 'shakha' },
  // Jamia Nagar
  { id: 'gz-5', area: 'jamia_nagar', label: 'Jamia Millia Islamia Gate', center: [77.2800, 28.5620], radius: 100, riskLevel: 'high', type: 'surveillance' },
  { id: 'gz-6', area: 'jamia_nagar', label: 'Noor Nagar Chowk', center: [77.2810, 28.5615], radius: 70, riskLevel: 'medium', type: 'gathering' },
  // Zakir Nagar
  { id: 'gz-7', area: 'zakir_nagar', label: 'Zakir Nagar Market', center: [77.2830, 28.5650], radius: 80, riskLevel: 'medium', type: 'recruitment' },
  // Abul Fazal
  { id: 'gz-8', area: 'abul_fazal_enclave', label: 'Abul Fazal Main Gate', center: [77.2850, 28.5530], radius: 60, riskLevel: 'high', type: 'surveillance' },
  // Johri Farm
  { id: 'gz-9', area: 'johri_farm', label: 'Jogabai Extension Ground', center: [77.2900, 28.5560], radius: 90, riskLevel: 'critical', type: 'shakha' },
  // Okhla Phase 1
  { id: 'gz-10', area: 'okhla_phase_1', label: 'Okhla Phase 1 Community Park', center: [77.2710, 28.5310], radius: 70, riskLevel: 'high', type: 'shakha' },
  // Okhla Phase 2
  { id: 'gz-11', area: 'okhla_phase_2', label: 'Okhla Industrial Area', center: [77.2750, 28.5270], radius: 100, riskLevel: 'low', type: 'landmark' },
  // Jasola
  { id: 'gz-12', area: 'jasola', label: 'Jasola Apollo Hospital Area', center: [77.2600, 28.5400], radius: 80, riskLevel: 'low', type: 'safe_zone' },
  // Okhla Vihar
  { id: 'gz-13', area: 'okhla_vihar', label: 'Okhla Vihar Park', center: [77.2820, 28.5340], radius: 60, riskLevel: 'medium', type: 'recruitment' },
];

// ─── Incident Marker Config ─────────────────────────────────
export const CATEGORY_MARKERS: Record<string, { color: string; icon: string; label: string }> = {
  recruitment:  { color: '#ef4444', icon: '🎯', label: 'Recruitment' },
  propaganda:   { color: '#f97316', icon: '📢', label: 'Propaganda' },
  meeting:      { color: '#eab308', icon: '🤝', label: 'Meetings' },
  surveillance: { color: '#a855f7', icon: '👁️', label: 'Surveillance' },
  harassment:   { color: '#ec4899', icon: '⚠️', label: 'Harassment' },
  other:        { color: '#6b7280', icon: '📋', label: 'Other' },
};

export const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#22c55e',
};

// ─── Map Layer IDs ──────────────────────────────────────────
export const LAYER_IDS = {
  INCIDENT_CLUSTERS: 'incident-clusters',
  INCIDENT_COUNT: 'incident-cluster-count',
  INCIDENT_UNCLUSTERED: 'incident-unclustered',
  HEATMAP: 'incident-heatmap',
  GEOFENCE_FILL: 'geofence-fill',
  GEOFENCE_BORDER: 'geofence-border',
  GEOFENCE_LABELS: 'geofence-labels',
  AREA_BOUNDARIES: 'area-boundaries',
  AREA_LABELS: 'area-labels',
} as const;

// ─── Dark Map Style ─────────────────────────────────────────
export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

// ─── Area GeoJSON Features ──────────────────────────────────
export function getAreaCenterFeatures() {
  return {
    type: 'FeatureCollection' as const,
    features: (Object.entries(OKHLA_AREAS) as [OkhlaArea, typeof OKHLA_AREAS[OkhlaArea]][]).map(([key, area]) => ({
      type: 'Feature' as const,
      properties: { id: key, label: area.label },
      geometry: { type: 'Point' as const, coordinates: [area.center[1], area.center[0]] }, // Mapbox uses [lng, lat]
    })),
  };
}
