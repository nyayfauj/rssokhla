// ─── Karyakarta Profiles List Page ──────────────────────────

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_PROFILES } from '@/lib/mock-profiles';
import { RANK_LABELS, AFFILIATION_LABELS, THREAT_COLORS, ACTIVITY_LABELS } from '@/types/karyakarta.types';
import type { ThreatLevel, Affiliation, KaryakartaRank } from '@/types/karyakarta.types';

export default function ProfilesPage() {
  const [search, setSearch] = useState('');
  const [threatFilter, setThreatFilter] = useState<ThreatLevel | ''>('');
  const [affFilter, setAffFilter] = useState<Affiliation | ''>('');

  const filtered = useMemo(() => {
    return MOCK_PROFILES.filter(p => {
      const q = search.toLowerCase();
      const matchesSearch = !q || p.fullName.toLowerCase().includes(q) || p.aliases.some(a => a.toLowerCase().includes(q))
        || p.primaryArea.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      const matchesThreat = !threatFilter || p.threatLevel === threatFilter;
      const matchesAff = !affFilter || p.affiliations.includes(affFilter);
      return matchesSearch && matchesThreat && matchesAff;
    });
  }, [search, threatFilter, affFilter]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Karyakarta Profiles</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{MOCK_PROFILES.length} profiles tracked</p>
        </div>
        <Link href="/profiles/new" className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition-colors">
          + Add Profile
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
        <input
          type="text" placeholder="Search by name, alias, area, or tag..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <select value={threatFilter} onChange={e => setThreatFilter(e.target.value as ThreatLevel | '')}
          className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none">
          <option value="">All Threats</option>
          {(['critical','high','medium','low'] as ThreatLevel[]).map(t => (
            <option key={t} value={t}>{THREAT_COLORS[t].label}</option>
          ))}
        </select>
        <select value={affFilter} onChange={e => setAffFilter(e.target.value as Affiliation | '')}
          className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none">
          <option value="">All Orgs</option>
          {(Object.entries(AFFILIATION_LABELS) as [Affiliation, typeof AFFILIATION_LABELS[Affiliation]][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        {(search || threatFilter || affFilter) && (
          <button onClick={() => { setSearch(''); setThreatFilter(''); setAffFilter(''); }}
            className="text-xs text-zinc-500 hover:text-white px-2">Clear</button>
        )}
      </div>

      {/* Profiles Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">🕵️</span>
          <p className="text-sm text-zinc-400 mt-3">No profiles match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(p => {
            const threat = THREAT_COLORS[p.threatLevel];
            const rank = RANK_LABELS[p.rank];
            return (
              <Link key={p.$id} href={`/profiles/${p.$id}`}
                className={`block bg-zinc-900/60 border rounded-2xl p-3.5 hover:bg-zinc-800/40 transition-all active:scale-[0.98] ${
                  p.threatLevel === 'critical' ? 'border-red-800/40' : 'border-zinc-800/50'
                }`}
              >
                {/* Row 1: Avatar + name + threat */}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 ${
                    p.threatLevel === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-800' :
                    p.threatLevel === 'high' ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                    'bg-gradient-to-br from-zinc-600 to-zinc-800'
                  }`}>
                    {p.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{p.fullName}</h3>
                      {!p.isActive && <span className="text-[9px] text-zinc-600 border border-zinc-700 rounded px-1">INACTIVE</span>}
                    </div>
                    {p.aliases.length > 0 && (
                      <p className="text-[10px] text-zinc-500 truncate">aka {p.aliases.join(', ')}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${threat.bg} ${threat.text} ${threat.border}`}>
                        {threat.label.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-zinc-500">{rank.label}</span>
                    </div>
                  </div>
                </div>

                {/* Affiliations */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {p.affiliations.map(aff => {
                    const a = AFFILIATION_LABELS[aff];
                    return (
                      <span key={aff} className={`text-[9px] ${a.color} bg-zinc-800/60 px-1.5 py-0.5 rounded-md`}>
                        {a.icon} {a.label}
                      </span>
                    );
                  })}
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500">
                  {p.phoneNumbers.length > 0 && <span>📞 {p.phoneNumbers.length}</span>}
                  {p.socialMedia.length > 0 && <span>🌐 {p.socialMedia.length}</span>}
                  {p.sightings.length > 0 && <span>👁️ {p.sightings.length}</span>}
                  {p.linkedIncidentIds.length > 0 && <span>🔗 {p.linkedIncidentIds.length}</span>}
                  <span className="ml-auto text-zinc-600">
                    {p.verificationStatus === 'verified' ? '✓ Verified' : p.verificationStatus === 'partially_verified' ? '◐ Partial' : '○ Unverified'}
                  </span>
                </div>

                {/* Activities */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.knownActivities.slice(0, 3).map(act => (
                    <span key={act} className="text-[9px] text-zinc-500 bg-zinc-800/40 px-1.5 py-0.5 rounded">
                      {ACTIVITY_LABELS[act].icon} {ACTIVITY_LABELS[act].label}
                    </span>
                  ))}
                  {p.knownActivities.length > 3 && <span className="text-[9px] text-zinc-600">+{p.knownActivities.length - 3}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
