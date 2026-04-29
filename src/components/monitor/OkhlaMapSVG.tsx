// ─── Interactive SVG Mini-Map (Public, No Auth) ─────────────

'use client';

import { useState } from 'react';
import type { MockIncident } from '@/lib/mock-data';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props { incidents: MockIncident[]; }

// Normalized positions (0-100 scale) for each Okhla area on the SVG canvas
const AREA_POS: Record<OkhlaArea, { x: number; y: number }> = {
  shaheen_bagh:       { x: 72, y: 62 },
  batla_house:        { x: 48, y: 32 },
  jamia_nagar:        { x: 50, y: 22 },
  zakir_nagar:        { x: 55, y: 15 },
  abul_fazal_enclave: { x: 62, y: 45 },
  johri_farm:         { x: 68, y: 30 },
  okhla_phase_1:      { x: 30, y: 72 },
  okhla_phase_2:      { x: 38, y: 82 },
  okhla_vihar:        { x: 52, y: 68 },
  jasola:             { x: 18, y: 55 },
};

function getAreaThreat(area: OkhlaArea, incidents: MockIncident[]): { level: string; count: number; color: string } {
  const areaInc = incidents.filter(i => i.area === area);
  const count = areaInc.length;
  const hasCritical = areaInc.some(i => i.severity === 'critical');
  const hasHigh = areaInc.some(i => i.severity === 'high');

  if (hasCritical) return { level: 'CRITICAL', count, color: '#dc2626' };
  if (hasHigh) return { level: 'HIGH', count, color: '#f59e0b' };
  if (count > 0) return { level: 'MODERATE', count, color: '#eab308' };
  return { level: 'CLEAR', count, color: '#22c55e' };
}

export default function OkhlaMapSVG({ incidents }: Props) {
  const [hoveredArea, setHoveredArea] = useState<OkhlaArea | null>(null);
  const [selectedArea, setSelectedArea] = useState<OkhlaArea | null>(null);

  const areas = (Object.entries(AREA_POS) as [OkhlaArea, { x: number; y: number }][]).map(([key, pos]) => ({
    key,
    pos,
    ...getAreaThreat(key, incidents),
    label: OKHLA_AREAS[key]?.label || key,
  }));

  const selected = selectedArea ? areas.find(a => a.key === selectedArea) : null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">🗺️</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Okhla Operations Map</span>
        </div>
        <span className="text-[10px] text-zinc-600">Tap zones for details</span>
      </div>

      {/* SVG Map */}
      <div className="relative p-3">
        <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 280 }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" />
            </pattern>
            {/* Pulse animation */}
            <radialGradient id="pulse-critical">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pulse-high">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Connection lines between nearby areas */}
          {[
            ['batla_house', 'jamia_nagar'],
            ['jamia_nagar', 'zakir_nagar'],
            ['batla_house', 'johri_farm'],
            ['abul_fazal_enclave', 'shaheen_bagh'],
            ['okhla_phase_1', 'okhla_phase_2'],
            ['okhla_phase_1', 'okhla_vihar'],
            ['jasola', 'okhla_phase_1'],
            ['johri_farm', 'abul_fazal_enclave'],
          ].map(([from, to]) => {
            const a = AREA_POS[from as OkhlaArea];
            const b = AREA_POS[to as OkhlaArea];
            return (
              <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" strokeDasharray="1,1" />
            );
          })}

          {/* Area nodes */}
          {areas.map(area => {
            const isHovered = hoveredArea === area.key;
            const isSelected = selectedArea === area.key;
            const radius = area.level === 'CRITICAL' ? 4.5 : area.level === 'HIGH' ? 3.8 : 3;
            const pulseRadius = radius + 3;

            return (
              <g key={area.key}
                onMouseEnter={() => setHoveredArea(area.key)}
                onMouseLeave={() => setHoveredArea(null)}
                onClick={() => setSelectedArea(selectedArea === area.key ? null : area.key)}
                className="cursor-pointer"
              >
                {/* Pulse ring for critical/high */}
                {(area.level === 'CRITICAL' || area.level === 'HIGH') && (
                  <circle cx={area.pos.x} cy={area.pos.y} r={pulseRadius}
                    fill={area.level === 'CRITICAL' ? 'url(#pulse-critical)' : 'url(#pulse-high)'}
                    className="animate-pulse" />
                )}

                {/* Outer glow */}
                <circle cx={area.pos.x} cy={area.pos.y} r={radius + 1.5}
                  fill={area.color} opacity={isHovered || isSelected ? 0.25 : 0.1} />

                {/* Main dot */}
                <circle cx={area.pos.x} cy={area.pos.y} r={radius}
                  fill={area.color}
                  stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.5)'}
                  strokeWidth={isSelected ? 0.5 : 0.3}
                  opacity={0.9}
                />

                {/* Count badge */}
                {area.count > 0 && (
                  <text x={area.pos.x} y={area.pos.y + 0.5}
                    textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize="2.5" fontWeight="bold" className="select-none">
                    {area.count}
                  </text>
                )}

                {/* Label */}
                <text x={area.pos.x} y={area.pos.y + radius + 3}
                  textAnchor="middle" fill={isHovered || isSelected ? '#d4d4d8' : '#52525b'}
                  fontSize="2.2" className="select-none pointer-events-none">
                  {area.label.length > 14 ? area.label.substring(0, 12) + '…' : area.label}
                </text>
              </g>
            );
          })}

          {/* Map border */}
          <rect x="0.5" y="0.5" width="99" height="99" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" rx="2" />
        </svg>

        {/* Selected area detail overlay */}
        {selected && (
          <div className="absolute bottom-3 left-3 right-3 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
                <span className="text-xs font-semibold text-white">{selected.label}</span>
              </div>
              <button onClick={() => setSelectedArea(null)} className="text-zinc-600 hover:text-white text-xs">✕</button>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-zinc-400">{selected.count} incident{selected.count !== 1 ? 's' : ''}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                selected.level === 'CRITICAL' ? 'bg-red-500/15 text-red-400' :
                selected.level === 'HIGH' ? 'bg-amber-500/15 text-amber-400' :
                selected.level === 'MODERATE' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-green-500/10 text-green-400'
              }`}>{selected.level}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 px-3 pb-2.5">
        {[
          { color: 'bg-red-500', label: 'Critical' },
          { color: 'bg-amber-500', label: 'High' },
          { color: 'bg-yellow-500', label: 'Moderate' },
          { color: 'bg-green-500', label: 'Clear' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${l.color}`} />
            <span className="text-[9px] text-zinc-600">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
