// ─── Core MapView Component ─────────────────────────────────

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MAPBOX_TOKEN, OKHLA_CENTER, OKHLA_ZOOM, OKHLA_BOUNDS,
  MAP_STYLE, LAYER_IDS, CATEGORY_MARKERS,
} from '@/lib/map/config';
import {
  incidentsToGeoJSON, geofenceToGeoJSON, geofenceLabelsGeoJSON,
  incidentsToHeatmapGeoJSON,
} from '@/lib/map/geojson';
import type { Incident } from '@/types/incident.types';
import MapControls from './MapControls';
import IncidentPopup from './IncidentPopup';
import LocationSearch from './LocationSearch';

if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN;

export interface ActiveLayers {
  incidents: boolean;
  heatmap: boolean;
  geofences: boolean;
  labels: boolean;
}

interface Props {
  incidents: Incident[];
}

export default function MapView({ incidents }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Record<string, unknown> | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [compassActive, setCompassActive] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeLayers, setActiveLayers] = useState<ActiveLayers>({
    incidents: true, heatmap: false, geofences: true, labels: true,
  });

  // ─── Initialize Map ─────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !MAPBOX_TOKEN) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: OKHLA_CENTER,
      zoom: OKHLA_ZOOM,
      maxBounds: OKHLA_BOUNDS,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      logoPosition: 'bottom-right',
      touchZoomRotate: true,
      dragRotate: true,
      maxZoom: 18,
      minZoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 100 }), 'bottom-left');
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    }), 'top-right');

    map.on('load', () => {
      // ─── Sources ──────────────────────────────────
      map.addSource('incidents', {
        type: 'geojson',
        data: incidentsToGeoJSON(incidents),
        cluster: true,
        clusterMaxZoom: 15,
        clusterRadius: 50,
      });

      map.addSource('heatmap-data', {
        type: 'geojson',
        data: incidentsToHeatmapGeoJSON(incidents),
      });

      map.addSource('geofences', {
        type: 'geojson',
        data: geofenceToGeoJSON(),
      });

      map.addSource('geofence-labels', {
        type: 'geojson',
        data: geofenceLabelsGeoJSON(),
      });

      // ─── Geofence Fill Layer ──────────────────────
      map.addLayer({
        id: LAYER_IDS.GEOFENCE_FILL,
        type: 'fill',
        source: 'geofences',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': ['get', 'opacity'],
        },
      });

      map.addLayer({
        id: LAYER_IDS.GEOFENCE_BORDER,
        type: 'line',
        source: 'geofences',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': 0.5,
          'line-dasharray': [2, 2],
        },
      });

      map.addLayer({
        id: LAYER_IDS.GEOFENCE_LABELS,
        type: 'symbol',
        source: 'geofence-labels',
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 10,
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-offset': [0, 0],
          'text-anchor': 'center',
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': '#a1a1aa',
          'text-halo-color': '#0a0a0a',
          'text-halo-width': 1.5,
        },
      });

      // ─── Heatmap Layer ────────────────────────────
      map.addLayer({
        id: LAYER_IDS.HEATMAP,
        type: 'heatmap',
        source: 'heatmap-data',
        layout: { visibility: 'none' },
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 1, 18, 3],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 18, 40],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgba(103,0,13,0.4)',
            0.4, 'rgba(203,24,29,0.5)',
            0.6, 'rgba(239,69,51,0.6)',
            0.8, 'rgba(251,106,74,0.7)',
            1, 'rgba(252,187,161,0.9)',
          ],
          'heatmap-opacity': 0.8,
        },
      });

      // ─── Cluster Layer ────────────────────────────
      map.addLayer({
        id: LAYER_IDS.INCIDENT_CLUSTERS,
        type: 'circle',
        source: 'incidents',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step', ['get', 'point_count'],
            '#f59e0b', 3,
            '#ef4444', 7,
            '#dc2626',
          ],
          'circle-radius': [
            'step', ['get', 'point_count'],
            18, 3, 24, 7, 30,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(0,0,0,0.3)',
          'circle-opacity': 0.85,
        },
      });

      map.addLayer({
        id: LAYER_IDS.INCIDENT_COUNT,
        type: 'symbol',
        source: 'incidents',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: { 'text-color': '#ffffff' },
      });

      // ─── Unclustered Incident Points ──────────────
      map.addLayer({
        id: LAYER_IDS.INCIDENT_UNCLUSTERED,
        type: 'circle',
        source: 'incidents',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            11, 5, 15, 8, 18, 12,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0a0a0a',
          'circle-opacity': 0.9,
        },
      });

      setMapLoaded(true);
    });

    // ─── Click Handlers ─────────────────────────────
    map.on('click', LAYER_IDS.INCIDENT_UNCLUSTERED, (e) => {
      if (e.features && e.features[0]) {
        const props = e.features[0].properties || {};
        setSelectedIncident(props);
        setPopupPos({ x: e.point.x, y: e.point.y });
      }
    });

    map.on('click', LAYER_IDS.INCIDENT_CLUSTERS, (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_IDS.INCIDENT_CLUSTERS] });
      if (features[0]) {
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource('incidents') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !zoom) return;
          const geom = features[0].geometry;
          if (geom.type === 'Point') {
            map.easeTo({ center: geom.coordinates as [number, number], zoom });
          }
        });
      }
    });

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_IDS.INCIDENT_UNCLUSTERED, LAYER_IDS.INCIDENT_CLUSTERS],
      });
      if (features.length === 0) {
        setSelectedIncident(null);
        setPopupPos(null);
      }
    });

    // Cursors
    map.on('mouseenter', LAYER_IDS.INCIDENT_UNCLUSTERED, () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', LAYER_IDS.INCIDENT_UNCLUSTERED, () => { map.getCanvas().style.cursor = ''; });
    map.on('mouseenter', LAYER_IDS.INCIDENT_CLUSTERS, () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', LAYER_IDS.INCIDENT_CLUSTERS, () => { map.getCanvas().style.cursor = ''; });

    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Update Data Sources on Incidents Change ────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const incidentsSource = map.getSource('incidents') as mapboxgl.GeoJSONSource;
    if (incidentsSource) {
      incidentsSource.setData(incidentsToGeoJSON(incidents) as any);
    }

    const heatmapSource = map.getSource('heatmap-data') as mapboxgl.GeoJSONSource;
    if (heatmapSource) {
      heatmapSource.setData(incidentsToHeatmapGeoJSON(incidents) as any);
    }
  }, [incidents, mapLoaded]);

  // ─── Layer Visibility Toggle ────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const setVis = (id: string, visible: boolean) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
    };

    setVis(LAYER_IDS.INCIDENT_CLUSTERS, activeLayers.incidents);
    setVis(LAYER_IDS.INCIDENT_COUNT, activeLayers.incidents);
    setVis(LAYER_IDS.INCIDENT_UNCLUSTERED, activeLayers.incidents);
    setVis(LAYER_IDS.HEATMAP, activeLayers.heatmap);
    setVis(LAYER_IDS.GEOFENCE_FILL, activeLayers.geofences);
    setVis(LAYER_IDS.GEOFENCE_BORDER, activeLayers.geofences);
    setVis(LAYER_IDS.GEOFENCE_LABELS, activeLayers.labels);
  }, [activeLayers, mapLoaded]);

  // ─── Compass Mode ───────────────────────────────────────
  useEffect(() => {
    if (!compassActive) return;
    const handler = (e: DeviceOrientationEvent) => {
      const heading = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? e.alpha;
      if (heading !== null && heading !== undefined) {
        setCompassHeading(heading);
        mapRef.current?.setBearing(-heading);
      }
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, [compassActive]);

  // ─── Fly To Location ───────────────────────────────────
  const flyTo = useCallback((lng: number, lat: number, zoom = 15) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 1200 });
  }, []);

  // ─── Share Location ────────────────────────────────────
  const shareLocation = useCallback(async (lng: number, lat: number, title?: string) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    const text = title ? `${title} — ${url}` : url;
    if (navigator.share) {
      try { await navigator.share({ title: title || 'Location', text, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Location link copied to clipboard');
    }
  }, []);

  // ─── No Token Fallback ─────────────────────────────────
  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-900 rounded-2xl p-6 text-center">
        <div>
          <span className="text-5xl">🗺️</span>
          <h3 className="text-lg font-bold text-white mt-3">Map Token Required</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            Add <code className="text-red-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your <code className="text-zinc-300">.env.local</code> file to enable the interactive map.
          </p>
          <a href="https://mapbox.com" target="_blank" rel="noopener" className="inline-block mt-3 text-xs text-red-400 hover:text-red-300 underline">
            Get a free Mapbox token →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />

      {/* Search Bar */}
      <div className="absolute top-3 left-3 right-14 z-10">
        <LocationSearch onSelect={(lng, lat) => flyTo(lng, lat, 16)} />
      </div>

      {/* Layer Controls */}
      <div className="absolute bottom-3 left-3 z-10">
        <MapControls
          activeLayers={activeLayers}
          onToggleLayer={(layer) => setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
          compassActive={compassActive}
          onToggleCompass={() => setCompassActive(!compassActive)}
          compassHeading={compassHeading}
        />
      </div>

      {/* Selected Incident Popup */}
      {selectedIncident && popupPos && (
        <IncidentPopup
          incident={selectedIncident}
          position={popupPos}
          onClose={() => { setSelectedIncident(null); setPopupPos(null); }}
          onShare={() => {
            const coords = mapRef.current?.getCenter();
            if (coords) shareLocation(coords.lng, coords.lat, selectedIncident.title as string);
          }}
        />
      )}

      {/* Compass Indicator */}
      {compassActive && compassHeading !== null && (
        <div className="absolute top-3 right-3 z-10 bg-zinc-900/80 backdrop-blur rounded-xl px-2.5 py-1.5 border border-zinc-800/50">
          <p className="text-[10px] text-zinc-400 text-center">Compass</p>
          <p className="text-sm font-bold text-white text-center font-mono">{Math.round(compassHeading)}°</p>
        </div>
      )}
    </div>
  );
}
