// ─── Map GeoJSON Helpers ────────────────────────────────────

import * as turf from '@turf/turf';
import type { Incident } from '@/types/incident.types';
import { GEOFENCE_ZONES, CATEGORY_MARKERS, SEVERITY_COLORS, type GeoZone } from './config';

/** Convert incidents to GeoJSON FeatureCollection for Mapbox source */
export function incidentsToGeoJSON(incidents: Incident[]) {
  // Generate mock coordinates near area centers for demo
  const AREA_COORDS: Record<string, [number, number]> = {
    shaheen_bagh:       [77.2940, 28.5440],
    batla_house:        [77.2790, 28.5590],
    jamia_nagar:        [77.2800, 28.5620],
    zakir_nagar:        [77.2830, 28.5650],
    abul_fazal_enclave: [77.2850, 28.5530],
    johri_farm:         [77.2900, 28.5560],
    okhla_phase_1:      [77.2710, 28.5310],
    okhla_phase_2:      [77.2750, 28.5270],
    okhla_vihar:        [77.2820, 28.5340],
    jasola:             [77.2600, 28.5400],
  };

  return {
    type: 'FeatureCollection' as const,
    features: incidents.map((inc, i) => {
      // Use real coordinates if available, otherwise fallback to area coordinates
      const areaKey = inc.locationId || 'jamia_nagar';
      const base = (inc.coordinates && inc.coordinates.length >= 2) 
        ? [inc.coordinates[0], inc.coordinates[1]] 
        : (AREA_COORDS[areaKey] || [77.2810, 28.5500]);
        
      // Only apply jitter if we're falling back to the center point
      const hasRealCoords = inc.coordinates && inc.coordinates.length >= 2;
      const jitter = (idx: number, offset: number) => hasRealCoords ? 0 : (((idx * 2654435761 + offset * 1597334677) >>> 0) % 400 - 200) / 100000;
      
      return {
        type: 'Feature' as const,
        properties: {
          id: inc.$id,
          title: inc.title,
          description: inc.description,
          category: inc.category,
          severity: inc.severity,
          status: inc.status,
          area: areaKey,
          timestamp: inc.timestamp || inc.$createdAt,
          verificationCount: inc.verificationCount,
          color: CATEGORY_MARKERS[inc.category]?.color || '#6b7280',
          severityColor: SEVERITY_COLORS[inc.severity] || '#6b7280',
          icon: CATEGORY_MARKERS[inc.category]?.icon || '📋',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [base[0] + jitter(i, 1), base[1] + jitter(i, 2)],
        },
      };
    }),
  };
}

/** Convert geofence zones to circle polygons */
export function geofenceToGeoJSON(zones: GeoZone[] = GEOFENCE_ZONES) {
  return {
    type: 'FeatureCollection' as const,
    features: zones.map(zone => {
      const circle = turf.circle(zone.center, zone.radius / 1000, { steps: 64, units: 'kilometers' });
      return {
        ...circle,
        properties: {
          id: zone.id,
          label: zone.label,
          area: zone.area,
          radius: zone.radius,
          riskLevel: zone.riskLevel,
          type: zone.type,
          color: zone.riskLevel === 'critical' ? '#dc2626' :
                 zone.riskLevel === 'high' ? '#f59e0b' :
                 zone.riskLevel === 'medium' ? '#eab308' : '#22c55e',
          opacity: zone.riskLevel === 'critical' ? 0.25 :
                   zone.riskLevel === 'high' ? 0.18 :
                   zone.riskLevel === 'medium' ? 0.12 : 0.08,
        },
      };
    }),
  };
}

/** Geofence label points (centers) */
export function geofenceLabelsGeoJSON(zones: GeoZone[] = GEOFENCE_ZONES) {
  return {
    type: 'FeatureCollection' as const,
    features: zones.map(zone => ({
      type: 'Feature' as const,
      properties: {
        id: zone.id,
        label: zone.label,
        riskLevel: zone.riskLevel,
        type: zone.type,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: zone.center,
      },
    })),
  };
}

/** Check if a point is inside any geofence zone. Returns matching zones. */
export function checkPointInGeofences(lng: number, lat: number, zones: GeoZone[] = GEOFENCE_ZONES): GeoZone[] {
  const pt = turf.point([lng, lat]);
  return zones.filter(zone => {
    const circle = turf.circle(zone.center, zone.radius / 1000, { units: 'kilometers' });
    return turf.booleanPointInPolygon(pt, circle);
  });
}

/** Generate heatmap-weight GeoJSON from incidents */
export function incidentsToHeatmapGeoJSON(incidents: Incident[]) {
  const geojson = incidentsToGeoJSON(incidents);
  return {
    ...geojson,
    features: geojson.features.map(f => ({
      ...f,
      properties: {
        ...f.properties,
        weight: f.properties.severity === 'critical' ? 1 :
                f.properties.severity === 'high' ? 0.7 :
                f.properties.severity === 'medium' ? 0.4 : 0.2,
      },
    })),
  };
}
