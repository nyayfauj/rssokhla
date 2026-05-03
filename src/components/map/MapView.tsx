// ─── Core MapView Component (Leaflet Migration) ────────────────
// Using Leaflet + OpenStreetMap for API-free, invisible mapping.

'use client';

import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { OKHLA_CENTER, OKHLA_ZOOM } from '@/lib/map/config';
import { OKHLA_WARDS } from '@/lib/utils/wards';
import type { Incident } from '@/types/incident.types';
import type { KaryakartaProfile } from '@/types/karyakarta.types';
import { RANK_LABELS } from '@/types/karyakarta.types';

// Ward colors for visual distinction
const WARD_COLORS: Record<string, string> = {
  '187': '#3b82f6', // Sarita Vihar - Blue
  '189': '#ef4444', // Zakir Nagar - Red
  '188': '#eab308', // Abul Fazal - Yellow
  '186': '#22c55e', // Madanpur Khadar West - Green
  '185': '#a855f7', // Madanpur Khadar East - Purple
};

export interface ActiveLayers {
  incidents: boolean;
  heatmap: boolean;
  geofences: boolean;
  labels: boolean;
}

// Standard Leaflet Icon fix for Next.js
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

interface Props {
  incidents: Incident[];
  profiles?: KaryakartaProfile[];
}

export default function MapView({ incidents, profiles = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcons();
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current || mapRef.current) return;

    // Initialize Map
    const map = L.map(containerRef.current, {
      center: [OKHLA_CENTER[1], OKHLA_CENTER[0]], // Leaflet uses [lat, lng]
      zoom: OKHLA_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter Tiles (No API key required)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add Ward Boundaries from GeoJSON
    fetch('/data/okhla-wards.geojson')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: (feature) => {
            const wardId = feature?.properties?.WARD_ID;
            const color = WARD_COLORS[wardId] || '#dc2626';
            return {
              color: color,
              fillColor: color,
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '5, 5',
              opacity: 0.7,
            };
          },
          onEachFeature: (feature, layer) => {
            const name = feature?.properties?.WARD_NAME || 'Unknown Ward';
            const id = feature?.properties?.WARD_ID || '';
            layer.bindTooltip(
              `<div style="background:#09090b;color:white;padding:6px 10px;border-radius:6px;border:1px solid #27272a;font-family:sans-serif;">
                <p style="font-size:9px;font-weight:800;text-transform:uppercase;color:#ef4444;margin:0 0 2px 0;">Ward ${id}</p>
                <p style="font-size:11px;font-weight:900;margin:0;text-transform:uppercase;">${name}</p>
              </div>`,
              { permanent: false, direction: 'center', className: 'ward-tooltip' }
            );
          }
        }).addTo(map);
      })
      .catch(err => {
        console.warn('Failed to load ward boundaries, falling back to circles:', err);
        // Fallback to circles if GeoJSON fails to load
        OKHLA_WARDS.forEach(ward => {
          L.circle([ward.center[0], ward.center[1]], {
            color: '#dc2626',
            fillColor: '#dc2626',
            fillOpacity: 0.05,
            radius: 800,
            weight: 1,
            dashArray: '5, 5'
          })
          .bindTooltip(ward.name, { permanent: false, direction: 'center', className: 'ward-tooltip' })
          .addTo(map);
        });
      });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMounted]);

  // Update Markers when incidents change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing marker clusters if any
    map.eachLayer((layer) => {
      // @ts-ignore
      if (layer instanceof L.MarkerClusterGroup || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // @ts-ignore
    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="background-color: #ef4444; width: 30px; height: 30px; border: 2px solid #050606; border-radius: 50%; box-shadow: 0 0 15px #ef444466; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 12px;">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [30, 30]
        });
      }
    });

    // Add Incident Markers
    incidents.forEach(incident => {
      if (incident.coordinates && incident.coordinates.length === 2) {
        const color = 
          incident.severity === 'critical' ? '#ef4444' : 
          incident.severity === 'high' ? '#f97316' : 
          incident.severity === 'medium' ? '#eab308' : '#3f3f46';

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid #050606; border-radius: 50%; box-shadow: 0 0 10px ${color}66;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const marker = L.marker([incident.coordinates[1], incident.coordinates[0]], { icon: customIcon })
          .bindPopup(`
            <div style="background: #09090b; color: white; padding: 8px; border-radius: 8px; border: 1px solid #27272a; font-family: sans-serif;">
              <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin: 0 0 4px 0;">${incident.severity.toUpperCase()} // ${incident.category.toUpperCase()}</p>
              <h4 style="font-size: 14px; font-weight: 900; margin: 0 0 8px 0; text-transform: uppercase;">${incident.title}</h4>
              <p style="font-size: 11px; color: #a1a1aa; margin: 0 0 12px 0; line-height: 1.4;">${incident.description.slice(0, 80)}...</p>
              <a href="/incidents/${incident.$id}" style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ef4444; text-decoration: none;">Review Case →</a>
            </div>
          `, { className: 'dark-popup' });
          
        clusterGroup.addLayer(marker);
      }
    });

    // Add Target Profiles
    profiles.forEach(profile => {
      const location = profile.addresses?.[0]?.coordinates || [OKHLA_CENTER[0] + (Math.random() - 0.5) * 0.02, OKHLA_CENTER[1] + (Math.random() - 0.5) * 0.02];
      
      if (location && location.length === 2) {
        const color = profile.threatLevel === 'critical' ? '#ef4444' : '#f97316';
        
        const targetIcon = L.divIcon({
          className: 'target-div-icon',
          html: `<div style="background-color: transparent; width: 20px; height: 20px; border: 2px solid ${color}; border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}44;">
                  <div style="background-color: ${color}; width: 6px; height: 6px; border-radius: 50%;"></div>
                 </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([location[0], location[1]], { icon: targetIcon })
          .bindPopup(`
            <div style="background: #09090b; color: white; padding: 10px; border-radius: 12px; border: 1px solid ${color}44; font-family: sans-serif; min-width: 160px;">
              <p style="font-size: 8px; font-weight: 800; text-transform: uppercase; color: ${color}; margin: 0 0 4px 0;">RSS TARGET // ${RANK_LABELS[profile.rank].label.toUpperCase()}</p>
              <h4 style="font-size: 14px; font-weight: 900; margin: 0 0 8px 0; text-transform: uppercase; color: white;">${profile.fullName}</h4>
              <p style="font-size: 10px; color: #a1a1aa; margin: 0 0 12px 0; line-height: 1.4; border-left: 2px solid ${color}66; padding-left: 8px;">Zone: ${profile.primaryArea || 'Unknown'}</p>
              <a href="/profiles/${profile.$id}" style="display: block; text-align: center; background: ${color}22; padding: 6px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${color}; text-decoration: none; border: 1px solid ${color}44;">Review Dossier →</a>
            </div>
          `, { className: 'dark-popup' });
          
        clusterGroup.addLayer(marker);
      }
    });
    
    map.addLayer(clusterGroup);
  }, [incidents, profiles, isMounted]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden bg-[#09090b]" />
      
      {/* Map Overlay HUD */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-[#050606]/80 backdrop-blur-md border border-zinc-800/50 p-3 rounded-xl space-y-1">
          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Active Theater</p>
          <h4 className="text-[10px] font-black text-white uppercase tracking-tighter italic">Sector: Okhla Monitor</h4>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #050606 !important;
        }
        .dark-popup .leaflet-popup-content-wrapper {
          background: #09090b;
          color: white;
          border: 1px solid #27272a;
          border-radius: 12px;
          padding: 0;
        }
        .dark-popup .leaflet-popup-tip {
          background: #09090b;
          border: 1px solid #27272a;
        }
        .ward-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: rgba(255,255,255,0.2) !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
        }
      `}</style>
    </div>
  );
}
