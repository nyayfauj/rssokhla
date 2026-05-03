// ─── Map GeoJSON Helpers ────────────────────────────────────

import * as turf from '@turf/turf';
import type { Incident } from '@/types/incident.types';
import { GEOFENCE_ZONES, CATEGORY_MARKERS, SEVERITY_COLORS, type GeoZone } from './config';

export function incidentsToGeoJSON(incidents: Incident[]) {
  // Filter out incidents without actual coordinates to remove mock/fallback positions
  const validIncidents = incidents.filter(
    (inc) => inc.coordinates && inc.coordinates.length >= 2
  );

  return {
    type: 'FeatureCollection' as const,
    features: validIncidents.map((inc) => {
      const base = [inc.coordinates[0], inc.coordinates[1]];
      
      return {
        type: 'Feature' as const,
        properties: {
          id: inc.$id,
          title: inc.title,
          description: inc.description,
          category: inc.category,
          severity: inc.severity,
          status: inc.status,
          area: inc.locationId || 'unknown',
          timestamp: inc.timestamp || inc.$createdAt,
          verificationCount: inc.verificationCount,
          color: CATEGORY_MARKERS[inc.category]?.color || '#6b7280',
          severityColor: SEVERITY_COLORS[inc.severity] || '#6b7280',
          icon: CATEGORY_MARKERS[inc.category]?.icon || '📋',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: base,
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
