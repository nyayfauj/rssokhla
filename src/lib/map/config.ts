// ─── Map Configuration ───────────────────────────────────

import type { OkhlaArea } from '@/types/location.types';
import { OKHLA_AREAS } from '@/types/location.types';

// ─── Token (Removed for Anonymity) ───────────────────────────────────────
export const MAPBOX_TOKEN = ''; 

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
  // Zakir Nagar
  { id: 'gz-1', area: 'zakir_nagar', label: 'Zakir Nagar Market', center: [77.2830, 28.5650], radius: 80, riskLevel: 'high', type: 'gathering' },
  { id: 'gz-2', area: 'zakir_nagar', label: 'Batla House Junction', center: [77.2790, 28.5590], radius: 100, riskLevel: 'critical', type: 'gathering' },
  // Abul Fazal
  { id: 'gz-3', area: 'abul_fazal', label: 'Shaheen Bagh Market', center: [77.2940, 28.5440], radius: 80, riskLevel: 'high', type: 'gathering' },
  { id: 'gz-4', area: 'abul_fazal', label: 'Abul Fazal Main Gate', center: [77.2850, 28.5530], radius: 60, riskLevel: 'high', type: 'surveillance' },
  // Sarita Vihar
  { id: 'gz-5', area: 'sarita_vihar', label: 'Jasola Vihar Station', center: [77.2874, 28.5292], radius: 70, riskLevel: 'low', type: 'landmark' },
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

// ─── Map Layer IDs (Kept for compatibility) ──────────────────────────────────────────
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

export const MAP_STYLE = '';

// ─── Area GeoJSON Features ──────────────────────────────────
export function getAreaCenterFeatures() {
  return {
    type: 'FeatureCollection' as const,
    features: (Object.entries(OKHLA_AREAS) as [OkhlaArea, typeof OKHLA_AREAS[OkhlaArea]][]).map(([key, area]) => ({
      type: 'Feature' as const,
      properties: { id: key, label: area.label },
      geometry: { type: 'Point' as const, coordinates: [area.center[1], area.center[0]] }, 
    })),
  };
}
