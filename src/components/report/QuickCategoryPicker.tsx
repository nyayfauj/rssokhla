// ─── Quick Category Picker (Thumb-friendly) ────────────────
'use client';

import type { IncidentCategory } from '@/types/incident.types';
import { INCIDENT_CATEGORIES } from '@/lib/utils/constants';

interface Props {
  selected: IncidentCategory;
  onSelect: (cat: IncidentCategory) => void;
}

const QUICK_CATEGORIES: { key: IncidentCategory; emoji: string; label: string; desc: string }[] = [
  { key: 'recruitment', emoji: '🎯', label: 'Recruitment', desc: 'Drives, camps, canvassing' },
  { key: 'propaganda', emoji: '📢', label: 'Propaganda', desc: 'Flyers, posters, loudspeakers' },
  { key: 'surveillance', emoji: '👁️', label: 'Surveillance', desc: 'Photography, stalking, drones' },
  { key: 'meeting', emoji: '🤝', label: 'Meeting', desc: 'Shakha, gatherings, rallies' },
  { key: 'harassment', emoji: '⚠️', label: 'Harassment', desc: 'Threats, intimidation' },
  { key: 'adversary_profile', emoji: '👤', label: 'Operative Profile', desc: 'Report RSS operative details' },
  { key: 'other', emoji: '📋', label: 'Other', desc: 'Any other activity' },
];

export default function QuickCategoryPicker({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {QUICK_CATEGORIES.map(cat => (
        <button key={cat.key} type="button" onClick={() => onSelect(cat.key)}
          className={`relative p-4 rounded-2xl border text-left transition-all active:scale-[0.97] ${
            selected === cat.key
              ? 'border-red-500 bg-red-500/10 ring-1 ring-red-500/30'
              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
          }`}>
          <span className="text-2xl block">{cat.emoji}</span>
          <p className={`text-sm font-semibold mt-1.5 ${selected === cat.key ? 'text-white' : 'text-zinc-300'}`}>{cat.label}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{cat.desc}</p>
          {selected === cat.key && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
