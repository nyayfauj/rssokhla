// ─── Zone Threat Gauges ─────────────────────────────────────

'use client';

import type { MockIncident } from '@/lib/mock-data';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props { incidents: MockIncident[]; }

function getThreatScore(area: OkhlaArea, incidents: MockIncident[]): number {
  const areaInc = incidents.filter(i => i.area === area);
  let score = 0;
  areaInc.forEach(i => {
    if (i.severity === 'critical') score += 40;
    else if (i.severity === 'high') score += 25;
    else if (i.severity === 'medium') score += 10;
    else score += 5;
  });
  return Math.min(100, score);
}

function scoreColor(score: number): string {
  if (score >= 70) return '#dc2626';
  if (score >= 45) return '#f59e0b';
  if (score >= 20) return '#eab308';
  return '#22c55e';
}

function scoreLabel(score: number): string {
  if (score >= 70) return 'CRITICAL';
  if (score >= 45) return 'HIGH';
  if (score >= 20) return 'MODERATE';
  return 'CLEAR';
}

export default function ZoneThreatGauges({ incidents }: Props) {
  const zones = (Object.entries(OKHLA_AREAS) as [OkhlaArea, typeof OKHLA_AREAS[OkhlaArea]][])
    .map(([key, area]) => {
      const score = getThreatScore(key, incidents);
      return { key, label: area.label, score, color: scoreColor(score), level: scoreLabel(score) };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎯</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Zone Threat Levels</span>
        </div>
        <span className="text-[10px] text-zinc-600">{zones.length} zones</span>
      </div>
      <div className="p-3 space-y-2">
        {zones.map(z => (
          <div key={z.key}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] sm:text-xs text-zinc-300 font-medium">{z.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold" style={{ color: z.color }}>{z.level}</span>
                <span className="text-[9px] text-zinc-600 font-mono">{z.score}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${z.score}%`,
                backgroundColor: z.color,
                boxShadow: z.score >= 70 ? `0 0 8px ${z.color}40` : 'none',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
