// ─── Incidents List Page ────────────────────────────────────

'use client';

import { useEffect } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import IncidentCard from '@/components/incidents/IncidentCard';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { IncidentCategory, IncidentSeverity } from '@/types/incident.types';
import { INCIDENT_CATEGORIES } from '@/lib/utils/constants';
import Link from 'next/link';

export default function IncidentsPage() {
  const { incidents, isLoading, error, filters, fetchIncidents, setFilters, clearFilters, hasMore, fetchMore } = useIncidentsStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleCategoryFilter = (cat: IncidentCategory | undefined) => {
    setFilters({ category: cat });
    fetchIncidents({ ...filters, category: cat });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Incidents</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{incidents.length} reports</p>
        </div>
        <Link href="/incidents/report">
          <Button size="sm" icon={<span>➕</span>}>
            Report
          </Button>
        </Link>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => handleCategoryFilter(undefined)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !filters.category ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
          }`}
        >
          All
        </button>
        {(Object.entries(INCIDENT_CATEGORIES) as [IncidentCategory, typeof INCIDENT_CATEGORIES[IncidentCategory]][]).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryFilter(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filters.category === key ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Active filter indicator */}
      {filters.category && (
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">Filtered: {INCIDENT_CATEGORIES[filters.category].label}</Badge>
          <button onClick={() => { clearFilters(); fetchIncidents(); }} className="text-xs text-zinc-500 hover:text-white">
            Clear
          </button>
        </div>
      )}

      {/* Incident list */}
      {isLoading && incidents.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} padding="md">
              <Skeleton lines={3} />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card variant="danger" padding="md">
          <div className="text-center py-4">
            <p className="text-sm text-red-400 mb-3">{error}</p>
            <Button variant="danger" size="sm" onClick={() => fetchIncidents()}>Retry</Button>
          </div>
        </Card>
      ) : incidents.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-8">
            <span className="text-5xl">🕵️</span>
            <h3 className="text-sm font-semibold text-white mt-3">No incidents found</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">Try adjusting your filters or report a new one</p>
            <Link href="/incidents/report">
              <Button size="sm">Report Incident</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <IncidentCard key={incident.$id} incident={incident} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" onClick={() => fetchMore()} isLoading={isLoading}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
