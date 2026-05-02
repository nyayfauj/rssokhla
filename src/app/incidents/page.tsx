'use client';

import { useEffect, useState, useMemo } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import GlassCard from '@/components/ui/GlassCard';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

export default function IncidentsPage() {
  const { incidents, fetchIncidents, isLoading } = useIncidentsStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchIncidents();
    // Subscribe to live updates
    const { subscribeToIncidents } = useIncidentsStore.getState();
    const unsubscribe = subscribeToIncidents();
    return () => unsubscribe();
  }, [fetchIncidents]);

  const filtered = useMemo(() => {
    if (filter === 'all') return incidents;
    return incidents.filter(i => i.severity === filter);
  }, [incidents, filter]);

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic">Intelligence Stream</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Live monitoring of reported incidents across Okhla sectors</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'All Units' },
              { id: 'critical', label: 'Critical' },
              { id: 'high', label: 'High' },
              { id: 'medium', label: 'Medium' },
              { id: 'low', label: 'Low' }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-[0.98] ${
                  filter === f.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'bg-zinc-900/40 text-zinc-600 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-zinc-900/20 border border-zinc-800/40 rounded-3xl animate-pulse flex flex-col p-6 space-y-4">
                 <div className="h-4 w-1/3 bg-zinc-800 rounded" />
                 <div className="h-8 w-full bg-zinc-800 rounded" />
                 <div className="h-20 w-full bg-zinc-800 rounded" />
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map(incident => (
              <div key={incident.$id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600/10 to-transparent blur opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[2rem]" />
                <GlassCard 
                  title={incident.locationId ? OKHLA_AREAS[incident.locationId as OkhlaArea]?.label : 'UNSPECIFIED SECTOR'} 
                  subtitle={incident.timestamp ? formatDistanceToNow(new Date(incident.timestamp)) + ' ago' : ''}
                  icon="📡"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                          incident.severity === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 
                          incident.severity === 'high' ? 'bg-orange-600 text-white' : 
                          incident.severity === 'medium' ? 'bg-yellow-600 text-black' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {incident.severity}
                        </span>
                        {incident.landmark && (
                           <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border border-zinc-800/60 px-2 py-0.5 rounded truncate max-w-[120px]">
                              {incident.landmark}
                           </span>
                        )}
                      </div>
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{incident.category}</span>
                    </div>
                    
                    <h3 className="text-base font-black text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
                      {incident.title}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 font-medium">
                      {incident.description}
                    </p>
                    
                    <div className="pt-5 border-t border-zinc-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5">
                            <span className="text-[14px]">🛡️</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              (incident.trustPoints || 0) >= 10 ? 'text-green-500' : 'text-amber-500'
                            }`}>
                              {Math.min(Math.round(((incident.trustPoints || 0) / 10) * 100), 100)}% Trust
                            </span>
                         </div>
                         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                            {incident.verificationCount || 0} Nodes
                         </span>
                      </div>
                      <Link href={`/incidents/${incident.$id}`} className="text-[10px] font-black text-red-600 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                        Review Case <span className="translate-y-px">→</span>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-6 border border-dashed border-zinc-800/60 rounded-[3rem] bg-zinc-900/10">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl" aria-hidden="true">📭</span>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 text-sm font-black uppercase tracking-widest">No Intelligence Data</p>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Reports for this sector or priority are not yet indexed</p>
              </div>
              <Link href="/incidents/report" className="inline-flex px-8 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all shadow-xl shadow-red-900/20">
                Submit Intel Report
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
