'use client';

import { useEffect, useState } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import GlassCard from '@/components/ui/GlassCard';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function IncidentsPage() {
  const { incidents, fetchIncidents, isLoading } = useIncidentsStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filtered = incidents.filter(i => {
    if (filter === 'all') return true;
    return i.severity === filter;
  });

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="block w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="absolute inset-0 w-3 h-3 rounded-full bg-red-600 animate-ping opacity-50" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Intelligence Stream</h1>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Periphery activity log // Immutable records</p>
        </header>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'all', label: 'All Intel' },
            { id: 'critical', label: 'Priority Red' },
            { id: 'high', label: 'Sector High' },
            { id: 'medium', label: 'Standard' },
            { id: 'low', label: 'Observation' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-[0.95] ${
                filter === f.id ? 'bg-red-600 text-white shadow-[0_10px_30px_-5px_rgba(220,38,38,0.5)] border-transparent' : 'bg-zinc-900/50 text-zinc-600 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />)
          ) : filtered.length > 0 ? (
            filtered.map(incident => (
              <GlassCard 
                key={incident.$id} 
                title={incident.locationId} 
                subtitle={formatDistanceToNow(new Date(incident.timestamp)) + ' ago'}
                icon="📡"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                      incident.severity === 'critical' ? 'bg-red-600 text-white' : 
                      incident.severity === 'high' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {incident.severity}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">{incident.$id.substring(0, 8)}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-zinc-200 line-clamp-2">{incident.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3">{incident.description}</p>
                  
                  <div className="pt-4 border-t border-zinc-800/40 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {incident.category || 'General'}
                    </span>
                    <Link href={`/incidents/${incident.$id}`} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">
                      Details →
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <span className="text-4xl opacity-20">📭</span>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No intelligence found for this filter</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
