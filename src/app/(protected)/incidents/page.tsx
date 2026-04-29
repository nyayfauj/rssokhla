// ─── Enhanced Incidents Timeline Page ───────────────────────
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import IncidentCard from '@/components/incidents/IncidentCard';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/incident.types';
import { INCIDENT_CATEGORIES, SEVERITY_LEVELS, STATUS_LABELS } from '@/lib/utils/constants';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';
import Link from 'next/link';

type ViewMode = 'list' | 'timeline';
type DateRange = 'all' | '24h' | '7d' | '30d';

export default function IncidentsPage() {
  const { incidents, isLoading, error, filters, fetchIncidents, setFilters, clearFilters, hasMore, fetchMore } = useIncidentsStore();

  const [view, setView] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [catFilter, setCatFilter] = useState<IncidentCategory | undefined>();
  const [sevFilter, setSevFilter] = useState<IncidentSeverity | undefined>();
  const [areaFilter, setAreaFilter] = useState<OkhlaArea | ''>('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  const handleCategoryFilter = (cat: IncidentCategory | undefined) => {
    setCatFilter(cat);
    setFilters({ category: cat });
    fetchIncidents({ ...filters, category: cat });
  };

  const filtered = useMemo(() => {
    let result = [...incidents];
    if (sevFilter) result = result.filter(i => i.severity === sevFilter);
    if (areaFilter) result = result.filter(i => {
      const coords = i.coordinates;
      if (!coords || coords.length < 2) return false;
      const areaCenter = OKHLA_AREAS[areaFilter]?.center;
      if (!areaCenter) return false;
      return Math.hypot(coords[0] - areaCenter[0], coords[1] - areaCenter[1]) < 0.01;
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return result;
  }, [incidents, sevFilter, areaFilter, search]);

  // Group by date for timeline view
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(i => {
      const d = new Date(i.$createdAt || i.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      if (!groups[d]) groups[d] = [];
      groups[d].push(i);
    });
    return Object.entries(groups);
  }, [filtered]);

  const activeFilterCount = [catFilter, sevFilter, areaFilter, search.trim()].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Incidents</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{filtered.length} reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showFilters || activeFilterCount ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}>
            🔍 Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          <Link href="/incidents/report">
            <Button size="sm" icon={<span>➕</span>}>Report</Button>
          </Link>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-zinc-900/60 rounded-xl p-1">
        {(['list', 'timeline'] as ViewMode[]).map(m => (
          <button key={m} onClick={() => setView(m)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              view === m ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}>{m === 'list' ? '📋 List' : '📅 Timeline'}</button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button onClick={() => handleCategoryFilter(undefined)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !catFilter ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
          }`}>All</button>
        {(Object.entries(INCIDENT_CATEGORIES) as [IncidentCategory, typeof INCIDENT_CATEGORIES[IncidentCategory]][]).map(([key, cat]) => (
          <button key={key} onClick={() => handleCategoryFilter(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              catFilter === key ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
            }`}>{cat.icon} {cat.label}</button>
        ))}
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-2xl p-3 space-y-3 animate-fade-in">
          {/* Search */}
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents..."
            className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-500/50" />

          {/* Severity */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Severity</p>
            <div className="flex gap-1.5">
              {(Object.entries(SEVERITY_LEVELS) as [IncidentSeverity, typeof SEVERITY_LEVELS[IncidentSeverity]][]).map(([key, sev]) => (
                <button key={key} onClick={() => setSevFilter(sevFilter === key ? undefined : key)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-colors ${
                    sevFilter === key ? `${sev.bg} ${sev.text} border-current` : 'border-zinc-800 text-zinc-500'
                  }`}>{sev.label}</button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Area</p>
            <select value={areaFilter} onChange={e => setAreaFilter(e.target.value as OkhlaArea)}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none">
              <option value="">All Areas</option>
              {Object.entries(OKHLA_AREAS).map(([key, a]) => (<option key={key} value={key}>{a.label}</option>))}
            </select>
          </div>

          {/* Date range */}
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5">Date Range</p>
            <div className="flex gap-1.5">
              {(['all', '24h', '7d', '30d'] as DateRange[]).map(r => (
                <button key={r} onClick={() => setDateRange(r)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium border transition-colors ${
                    dateRange === r ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'border-zinc-800 text-zinc-500'
                  }`}>{r === 'all' ? 'All' : r}</button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button onClick={() => { setCatFilter(undefined); setSevFilter(undefined); setAreaFilter(''); setDateRange('all'); setSearch(''); clearFilters(); fetchIncidents(); }}
              className="text-xs text-zinc-500 hover:text-white">Clear all filters</button>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading && incidents.length === 0 ? (
        <div className="space-y-3">{[1,2,3,4].map(i => (<Card key={i} padding="md"><Skeleton lines={3} /></Card>))}</div>
      ) : error ? (
        <Card variant="danger" padding="md">
          <div className="text-center py-4">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <Button variant="danger" size="sm" onClick={() => fetchIncidents()}>Retry</Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-8">
            <span className="text-5xl">🕵️</span>
            <h3 className="text-sm font-semibold text-white mt-3">No incidents found</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">Try adjusting your filters or report a new one</p>
            <Link href="/incidents/report"><Button size="sm">Report Incident</Button></Link>
          </div>
        </Card>
      ) : view === 'list' ? (
        <>
          <div className="space-y-3">{filtered.map(incident => (<IncidentCard key={incident.$id} incident={incident} />))}</div>
          {hasMore && (
            <div className="text-center pt-2"><Button variant="ghost" size="sm" onClick={() => fetchMore()} isLoading={isLoading}>Load More</Button></div>
          )}
        </>
      ) : (
        /* Timeline view */
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-zinc-800" />
          {grouped.map(([date, items]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center gap-2 mb-3 relative">
                <div className="absolute left-[-18px] w-3 h-3 bg-red-500 rounded-full border-2 border-[#060808]" />
                <span className="text-xs font-semibold text-zinc-400">{date}</span>
                <span className="text-[10px] text-zinc-600">{items.length} incident{items.length > 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-2">{items.map(incident => (<IncidentCard key={incident.$id} incident={incident} />))}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
