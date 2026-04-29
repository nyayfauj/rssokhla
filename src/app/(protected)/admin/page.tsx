// ─── Moderator Review Dashboard ─────────────────────────────
'use client';

import { useState, useMemo } from 'react';
import { MOCK_INCIDENTS, type MockIncident } from '@/lib/mock-data';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS, STATUS_LABELS } from '@/lib/utils/constants';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';
import type { IncidentStatus } from '@/types/incident.types';

type ReviewAction = 'verify' | 'reject' | 'escalate';

export default function AdminPage() {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'reported' | 'verified'>('all');
  const [note, setNote] = useState('');

  const filtered = useMemo(() => {
    if (filter === 'all') return incidents;
    return incidents.filter(i => i.status === filter);
  }, [incidents, filter]);

  const selected = selectedId ? incidents.find(i => i.id === selectedId) : null;

  const stats = useMemo(() => ({
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'reported').length,
    verified: incidents.filter(i => i.status === 'verified').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
  }), [incidents]);

  const handleAction = (action: ReviewAction) => {
    if (!selectedId) return;
    setIncidents(prev => prev.map(i => {
      if (i.id !== selectedId) return i;
      if (action === 'verify') return { ...i, status: 'verified' as const, verificationCount: i.verificationCount + 1 };
      if (action === 'reject') return { ...i, status: 'false_positive' as const };
      return { ...i, severity: 'critical' as const };
    }));
    setSelectedId(null);
    setNote('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><span>🛡️</span> Moderator Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Review, verify, and manage incident reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { v: stats.total, l: 'Total', c: 'text-white' },
          { v: stats.pending, l: 'Pending', c: 'text-amber-400' },
          { v: stats.verified, l: 'Verified', c: 'text-green-400' },
          { v: stats.critical, l: 'Critical', c: 'text-red-400' },
        ].map(s => (
          <div key={s.l} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-2.5 text-center">
            <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
            <p className="text-[9px] text-zinc-500 uppercase">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-zinc-900/60 rounded-xl p-1">
        {(['all', 'reported', 'verified'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500'
            }`}>{f === 'all' ? 'All' : f === 'reported' ? '⏳ Pending' : '✓ Verified'}</button>
        ))}
      </div>

      {/* Incident queue */}
      <div className="space-y-2">
        {filtered.map(inc => {
          const cat = INCIDENT_CATEGORIES[inc.category as keyof typeof INCIDENT_CATEGORIES];
          const sev = SEVERITY_LEVELS[inc.severity as keyof typeof SEVERITY_LEVELS];
          const isActive = selectedId === inc.id;

          return (
            <button key={inc.id} onClick={() => setSelectedId(isActive ? null : inc.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                isActive ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800/40 bg-zinc-900/30 hover:border-zinc-700'
              }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{cat?.icon}</span>
                    <span className="text-xs font-semibold text-white truncate">{inc.title}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{OKHLA_AREAS[inc.area as OkhlaArea]?.label} · {inc.timestamp}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sev?.bg} ${sev?.text}`}>{sev?.label}</span>
                  <span className={`text-[9px] ${inc.status === 'verified' ? 'text-green-400' : inc.status === 'reported' ? 'text-amber-400' : 'text-zinc-500'}`}>
                    {inc.status === 'verified' ? '✓ Verified' : inc.status === 'reported' ? '⏳ Pending' : inc.status}
                  </span>
                </div>
              </div>

              {/* Expanded review panel */}
              {isActive && (
                <div className="mt-3 pt-3 border-t border-zinc-800/40 space-y-3" onClick={e => e.stopPropagation()}>
                  <p className="text-xs text-zinc-400 leading-relaxed">{inc.description}</p>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>📍 {OKHLA_AREAS[inc.area as OkhlaArea]?.label}</span>
                    <span>· ✓{inc.verificationCount} verifications</span>
                    <span>· {inc.isAnonymous ? '🕶️ Anonymous' : '👤 Identified'}</span>
                  </div>

                  {/* Moderator note */}
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add review note..."
                    rows={2} className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none" />

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button onClick={() => handleAction('verify')}
                      className="flex-1 py-2 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold rounded-xl hover:bg-green-500/25 transition-colors active:scale-[0.97]">
                      ✓ Verify
                    </button>
                    <button onClick={() => handleAction('escalate')}
                      className="flex-1 py-2 bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-500/25 transition-colors active:scale-[0.97]">
                      🚨 Escalate
                    </button>
                    <button onClick={() => handleAction('reject')}
                      className="flex-1 py-2 bg-zinc-800 border border-zinc-700 text-zinc-500 text-xs font-semibold rounded-xl hover:bg-zinc-700 transition-colors active:scale-[0.97]">
                      ✕ Reject
                    </button>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl">🎉</span>
          <p className="text-sm text-zinc-400 mt-3">All clear — no {filter === 'reported' ? 'pending' : ''} reports to review</p>
        </div>
      )}
    </div>
  );
}
