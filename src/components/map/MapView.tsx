// ─── Core MapView Component (Leaflet Migration) ────────────────
// Using Leaflet + OpenStreetMap for API-free, invisible mapping.

'use client';

import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OKHLA_CENTER, OKHLA_ZOOM } from '@/lib/map/config';
import { OKHLA_WARDS } from '@/lib/utils/wards';
import type { Incident } from '@/types/incident.types';

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
}

export default function MapView({ incidents }: Props) {
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

    // Add Ward Boundaries (Simulated Circles for now)
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

    // Clear existing markers (excluding the tile layer and circles)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
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

        L.marker([incident.coordinates[1], incident.coordinates[0]], { icon: customIcon })
          .bindPopup(`
            <div style="background: #09090b; color: white; padding: 8px; border-radius: 8px; border: 1px solid #27272a; font-family: sans-serif;">
              <p style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ef4444; margin: 0 0 4px 0;">${incident.severity.toUpperCase()} // ${incident.category.toUpperCase()}</p>
              <h4 style="font-size: 14px; font-weight: 900; margin: 0 0 8px 0; text-transform: uppercase;">${incident.title}</h4>
              <p style="font-size: 11px; color: #a1a1aa; margin: 0 0 12px 0; line-height: 1.4;">${incident.description.slice(0, 80)}...</p>
              <a href="/incidents/${incident.$id}" style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ef4444; text-decoration: none;">Review Case →</a>
            </div>
          `, { className: 'dark-popup' })
          .addTo(map);
      }
    });
  }, [incidents, isMounted]);

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
