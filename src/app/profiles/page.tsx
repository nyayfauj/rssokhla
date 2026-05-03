'use client';

import { useEffect, useState } from 'react';
import { useKaryakartaStore } from '@/stores/karyakarta.store';
import GlassCard from '@/components/ui/GlassCard';
import { RANK_LABELS, THREAT_COLORS } from '@/types/karyakarta.types';
import Link from 'next/link';

export default function ProfilesPage() {
  const { profiles, fetchProfiles, isLoading } = useKaryakartaStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filtered = profiles.filter(p => 
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (p.primaryArea && p.primaryArea.toLowerCase().includes(search.toLowerCase())) ||
    (p.shakhaLocation && p.shakhaLocation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">RSS Operative Monitor</h1>
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Tracking monitored RSS personnel & potential threats in Okhla</p>
            </div>

          <div className="w-full md:w-64 relative group">
            <div className="absolute inset-0 bg-red-600/5 blur-xl group-hover:bg-red-600/10 transition-all" />
            <input 
              type="text" 
              placeholder="TARGET SCAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-zinc-900/80 border border-zinc-800/50 rounded-2xl px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase text-zinc-100 placeholder-zinc-700 focus:border-red-600 outline-none transition-all shadow-xl"
            />
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />)
          ) : filtered.length > 0 ? (
            filtered.map(profile => (
              <GlassCard 
                key={profile.$id} 
                title={profile.shakhaLocation || profile.primaryArea} 
                icon="🕵️"
              >
                <div className="space-y-4 text-center py-2">
                  <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-black text-white ${
                    profile.threatLevel === 'critical' ? 'bg-red-700' : 
                    profile.threatLevel === 'high' ? 'bg-orange-700' : 'bg-zinc-700'
                  }`}>
                    {profile.fullName.charAt(0)}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-black text-zinc-100 uppercase tracking-tight">{profile.fullName}</h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                      {RANK_LABELS[profile.rank].label}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${THREAT_COLORS[profile.threatLevel].bg} ${THREAT_COLORS[profile.threatLevel].text}`}>
                      Threat: {profile.threatLevel}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/40">
                    <Link href={`/profiles/${profile.$id}`} className="block w-full py-2 bg-zinc-800/50 hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">
                      View Profile
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-6 border border-zinc-800 bg-zinc-950 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-900/20" />
              <div className="absolute top-0 right-0 p-3 opacity-30">
                <span className="text-[8px] font-mono text-zinc-500">SYS_ID: OP_SCAN_FAIL</span>
              </div>
              <div className="w-16 h-16 border border-zinc-800 bg-zinc-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="w-2 h-2 bg-zinc-600 animate-pulse rounded-full" />
              </div>
              <div className="space-y-2">
                <p className="text-zinc-400 text-sm font-black uppercase tracking-[0.3em]">NO TARGETS MATCHING QUERY</p>
                <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest max-w-sm mx-auto">
                  Database scan complete. Zero profiles correspond to current search parameters. Modify query parameters to expand search radius.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
