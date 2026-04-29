// ─── Quick Report FAB (Floating Action Button) ─────────────
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IncidentCategory } from '@/types/incident.types';

const QUICK_OPTS: { key: IncidentCategory; emoji: string; label: string }[] = [
  { key: 'recruitment', emoji: '🎯', label: 'Recruitment' },
  { key: 'propaganda', emoji: '📢', label: 'Propaganda' },
  { key: 'surveillance', emoji: '👁️', label: 'Surveillance' },
  { key: 'harassment', emoji: '⚠️', label: 'Harassment' },
  { key: 'meeting', emoji: '🤝', label: 'Meeting' },
];

export default function QuickReportFAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const go = (cat: IncidentCategory) => {
    setOpen(false);
    router.push(`/incidents/report?category=${cat}&quick=1`);
  };

  return (
    <>
      {/* Backdrop */}
      {open && <div className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* Quick options */}
      {open && (
        <div className="fixed bottom-24 right-4 z-[91] flex flex-col gap-2 animate-fade-in">
          {QUICK_OPTS.map((opt, i) => (
            <button key={opt.key} onClick={() => go(opt.key)}
              className="flex items-center gap-2.5 bg-zinc-900/95 border border-zinc-700 backdrop-blur-xl rounded-full px-4 py-2.5 shadow-2xl transition-all hover:bg-zinc-800 active:scale-[0.95]"
              style={{ animationDelay: `${i * 50}ms` }}>
              <span className="text-base">{opt.emoji}</span>
              <span className="text-xs text-white font-medium whitespace-nowrap">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAB Button */}
      <button onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 z-[92] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-[0.9] ${
          open ? 'bg-zinc-800 rotate-45' : 'bg-red-600 hover:bg-red-500'
        }`}>
        <span className="text-white text-2xl font-light">{open ? '✕' : '+'}</span>
      </button>
    </>
  );
}
