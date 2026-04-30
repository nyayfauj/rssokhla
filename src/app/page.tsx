// ─── Command Center (Public Landing) ─────────────────────────

'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAlertsStore } from '@/stores/alerts.store';
import { useAuthStore } from '@/stores/auth.store';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import type { KaryakartaProfile } from '@/types/karyakarta.types';
import GlassCard from '@/components/ui/GlassCard';
import ActivityTicker from '@/components/monitor/ActivityTicker';
import AreaThreatGauges from '@/components/monitor/AreaThreatGauges';
import SectorHeatTicker from '@/components/monitor/SectorHeatTicker';
import DailyIntelBriefing from '@/components/monitor/DailyIntelBriefing';
import ThemeToggle from '@/components/layout/ThemeToggle';

// Dynamic Visuals
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });
const NetworkGraph = dynamic(() => import('@/components/monitor/NetworkGraph'), { ssr: false });
const SeverityDonut = dynamic(() => import('@/components/monitor/SeverityDonut'), { ssr: false });
const ActivityTimeline = dynamic(() => import('@/components/monitor/ActivityTimeline'), { ssr: false });
const CategoryBreakdown = dynamic(() => import('@/components/monitor/CategoryBreakdown'), { ssr: false });
const RecentFeed = dynamic(() => import('@/components/monitor/RecentFeed'), { ssr: false });

export default function CommandCenterPage() {
  const [clock, setClock] = useState('');
  const [profiles, setProfiles] = useState<KaryakartaProfile[]>([]);
  
  const { incidents, fetchIncidents } = useIncidentsStore();
  const { alerts, fetchActiveAlerts } = useAlertsStore();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchIncidents();
    fetchActiveAlerts();
    databases.listDocuments(DATABASE_ID, COLLECTIONS.PROFILES)
      .then(res => setProfiles(res.documents as unknown as KaryakartaProfile[]))
      .catch(() => setProfiles([]));
  }, []);

  const stats = useMemo(() => {
    const critical = incidents.filter(i => i.severity === 'critical').length;
    const high = incidents.filter(i => i.severity === 'high').length;
    return { critical, high, total: incidents.length };
  }, [incidents]);

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100 overflow-x-hidden selection:bg-red-500/30">
      {/* 1. Global Alert Ticker */}
      <div className="no-print">
        <ActivityTicker incidents={incidents} />
      </div>

      {/* 2. Top Navigation / Header */}
      <nav className="sticky top-0 z-50 bg-[#050606]/80 backdrop-blur-xl border-b border-zinc-800/40 no-print">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-sm italic shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]">NF</span>
              <div className="hidden sm:block">
                <h1 className="text-sm font-black tracking-tighter uppercase leading-none">Nyay<span className="text-red-500">Fauj</span></h1>
                <p className="text-[8px] text-zinc-600 font-bold tracking-[0.2em] uppercase">Autonomous Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <NavLink href="/" active>Dashboard</NavLink>
              <NavLink href="/incidents">Intelligence Feed</NavLink>
              <NavLink href="/profiles">Operatives</NavLink>
              <NavLink href="/about">Manifesto</NavLink>
            </div>
            
            <div className="h-6 w-px bg-zinc-800/50 hidden sm:block mx-2" />

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[10px] font-mono text-zinc-500 leading-none mb-1">{clock} IST</span>
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  Live Feed
                </span>
              </div>
              {!isAuthenticated ? (
                <Link href="/login" className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-[#050606] text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] btn-glitch">
                  Access
                </Link>
              ) : (
                <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.charAt(0) || 'O'}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2.1 Sector Heat Ticker */}
      <SectorHeatTicker />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 0. Intelligence Briefing */}
        <DailyIntelBriefing />

        {/* 3. Hero / Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard label="Active Threats" value={stats.critical + stats.high} subValue={`${stats.critical} critical`} color="text-red-500" icon="🚨" />
          <MetricCard label="Intelligence Nodes" value={incidents.length} subValue="Verified reports" color="text-zinc-100" icon="📡" />
          <MetricCard label="Operatives Tracked" value={profiles.length} subValue="Karyakarta profiles" color="text-orange-500" icon="🕵️" />
          <MetricCard label="Operational Zones" value="12" subValue="Monitoring active" color="text-blue-500" icon="📍" />
        </div>

        {/* 4. Primary Intelligence: Map & Local Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <GlassCard title="Global Sector Map" icon="🗺️" subtitle="Real-time Hotspot Visualization">
              <div className="h-[450px] -mx-4 -mb-4">
                <MapView incidents={incidents} />
              </div>
            </GlassCard>

            <GlassCard title="Zone Threat Assessment" icon="📊" subtitle="Okhla Periphery Analysis">
              <AreaThreatGauges incidents={incidents} />
            </GlassCard>
          </div>

          <div className="xl:col-span-4 space-y-8">
            <GlassCard title="Activity Timeline" icon="📈" subtitle="Intelligence Density over time">
              <ActivityTimeline incidents={incidents} />
            </GlassCard>

            <GlassCard title="Operative Network" icon="🕸️" subtitle="Association Graph & Hierarchy">
              <div className="h-[250px] -mx-4 -mb-4">
                <NetworkGraph profiles={profiles} />
              </div>
            </GlassCard>

            <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-2xl p-6 text-white space-y-4 shadow-[0_20px_50px_-20px_rgba(220,38,38,0.5)]">
              <h4 className="text-lg font-black tracking-tight uppercase italic leading-none">Submit Intelligence</h4>
              <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-wider">Help protect Okhla. All submissions are encrypted and processed by autonomous AI.</p>
              <Link href="/report" className="block w-full py-3 bg-black text-white text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-900 transition-colors hover-scan">
                New Report →
              </Link>
            </div>
          </div>
        </div>

        {/* 5. Analytics & Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard title="Severity Weighting" icon="🍩">
            <SeverityDonut incidents={incidents} />
          </GlassCard>

          <GlassCard title="Category Analysis" icon="📋">
            <CategoryBreakdown incidents={incidents} />
          </GlassCard>

          <GlassCard title="System Integrity" icon="🛡️">
            <div className="flex flex-col items-center justify-center text-center h-full py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-xl">✨</div>
              <div>
                <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-1">Operator Independent</h5>
                <p className="text-[10px] text-zinc-500 leading-relaxed">System logic is fully decentralized. No human intervention is required for threat assessment.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 6. Recent Intelligence Feed */}
        <GlassCard title="Recent Intelligence Feed" icon="🗞️" subtitle="Live Stream of Field Activity">
          <RecentFeed incidents={incidents} />
        </GlassCard>
      </div>

      <footer className="border-t border-zinc-900/50 py-12 bg-black/40">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">NF</div>
            <span className="text-xs font-bold tracking-widest uppercase">NyayFauj Platform</span>
          </div>
          <p className="text-[10px] text-zinc-600 max-w-lg mx-auto leading-relaxed uppercase tracking-[0.1em]">
            This platform is an independent community monitoring tool. We operate without an operator. 
            Privacy is our priority. No IP addresses or browser fingerprints are stored in permanent logs.
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="/api" className="hover:text-white transition-colors">Public API</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Engagement Rules</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NavLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
  return (
    <Link href={href} className={`text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-white ${active ? 'text-white' : 'text-zinc-500'}`}>
      {children}
    </Link>
  );
}

function MetricCard({ label, value, subValue, color, icon }: { label: string, value: number | string, subValue: string, color: string, icon: string }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-5 lg:p-6 group hover:bg-zinc-900/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-700">{icon}</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-red-500 transition-colors" />
          <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-red-500 transition-colors delay-75" />
        </div>
      </div>
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className={`text-3xl font-black tracking-tighter ${color}`}>{value}</h4>
        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{subValue}</span>
      </div>
    </div>
  );
}
