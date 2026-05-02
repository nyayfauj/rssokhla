'use client';

import { useEffect, useState, useMemo } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import GlassCard from '@/components/ui/GlassCard';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function IncidentsPage() {
  const { incidents, fetchIncidents, isLoading } = useIncidentsStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const filtered = useMemo(() => {
    if (filter === 'all') return incidents;
    return incidents.filter(i => i.severity === filter);
  }, [incidents, filter]);

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Community Reports</h1>
          <p className="text-sm text-zinc-500">Browse all reported incidents across Okhla</p>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide" role="group" aria-label="Filter reports by severity">
          {[
            { id: 'all', label: 'All' },
            { id: 'critical', label: 'Critical' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap active:scale-[0.98] ${
                filter === f.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 bg-zinc-900/50 rounded-2xl animate-pulse" />)
          ) : filtered.length > 0 ? (
            filtered.map(incident => (
              <GlassCard 
                key={incident.$id} 
                title={incident.locationId?.replace(/_/g, ' ') || 'Unknown'} 
                subtitle={incident.timestamp ? formatDistanceToNow(new Date(incident.timestamp)) + ' ago' : ''}
                icon="&#x1F4E1;"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg uppercase ${
                      incident.severity === 'critical' ? 'bg-red-600 text-white' : 
                      incident.severity === 'high' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {incident.severity || 'low'}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-zinc-200 line-clamp-2">{incident.title || 'Untitled'}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">{incident.description || ''}</p>
                  
                  <div className="pt-4 border-t border-zinc-800/40 flex items-center justify-between">
                    <span className="text-xs text-zinc-600 font-medium capitalize">
                      {incident.category || 'General'}
                    </span>
                    <Link href={`/incidents/${incident.$id}`} className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-4">
              <span className="text-4xl" aria-hidden="true">&#x1F4ED;</span>
              <p className="text-zinc-500 text-sm font-medium">No reports found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
