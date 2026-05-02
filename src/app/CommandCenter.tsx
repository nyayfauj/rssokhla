'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAlertsStore } from '@/stores/alerts.store';
import { useAuthStore } from '@/stores/auth.store';
import type { KaryakartaProfile } from '@/types/karyakarta.types';
import type { Incident } from '@/types/incident.types';
import type { Alert } from '@/types/alert.types';
import GlassCard from '@/components/ui/GlassCard';
import ActivityTicker from '@/components/monitor/ActivityTicker';
import AreaThreatGauges from '@/components/monitor/AreaThreatGauges';
import SectorHeatTicker from '@/components/monitor/SectorHeatTicker';
import DailyIntelBriefing from '@/components/monitor/DailyIntelBriefing';
import ThemeToggle from '@/components/layout/ThemeToggle';

// Dynamic Visuals with Skeletons for 2G optimization
const MapView = dynamic(() => import('@/components/map/MapView'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-900/50 animate-pulse flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-600">Initializing Map Data...</div>
});
const NetworkGraph = dynamic(() => import('@/components/monitor/NetworkGraph'), { ssr: false });
const SeverityDonut = dynamic(() => import('@/components/monitor/SeverityDonut'), { ssr: false });
const ActivityTimeline = dynamic(() => import('@/components/monitor/ActivityTimeline'), { ssr: false });
const CategoryBreakdown = dynamic(() => import('@/components/monitor/CategoryBreakdown'), { ssr: false });
const RecentFeed = dynamic(() => import('@/components/monitor/RecentFeed'), { ssr: false });

interface Props {
  initialIncidents: Incident[];
  initialAlerts: Alert[];
  initialProfiles: KaryakartaProfile[];
  initialOperatives: any[];
}

export default function CommandCenter({ initialIncidents, initialAlerts, initialProfiles, initialOperatives }: Props) {
  const [clock, setClock] = useState('');
  const { incidents, setIncidents } = useIncidentsStore();
  const { alerts, setAlerts } = useAlertsStore();
  const { user, isAuthenticated } = useAuthStore();
  const [profiles] = useState(initialProfiles);
  const [operatives] = useState(initialOperatives);

  // Initialize store with server data
  useEffect(() => {
    if (initialIncidents.length > 0) setIncidents(initialIncidents);
    if (initialAlerts.length > 0) setAlerts(initialAlerts);
  }, [initialIncidents, initialAlerts]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const stats = useMemo(() => {
    const currentIncidents = incidents.length > 0 ? incidents : initialIncidents;
    const critical = currentIncidents.filter(i => i.severity === 'critical').length;
    const high = currentIncidents.filter(i => i.severity === 'high').length;
    return { critical, high, total: currentIncidents.length };
  }, [incidents, initialIncidents]);

  const displayIncidents = incidents.length > 0 ? incidents : initialIncidents;

  return (
    <div className="min-h-screen bg-[#050606] text-zinc-100 overflow-x-hidden selection:bg-red-500/30">
      <ActivityTicker incidents={displayIncidents} />

      <nav className="sticky top-0 z-50 bg-[#050606]/80 backdrop-blur-xl border-b border-zinc-800/40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-xs sm:text-sm italic">NF</span>
              <div>
                <h1 className="text-[11px] sm:text-sm font-black tracking-tighter uppercase leading-none">Nyay<span className="text-red-500">Fauj</span></h1>
                <p className="text-[7px] sm:text-[8px] text-zinc-600 font-bold tracking-[0.2em] uppercase">Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[10px] font-mono text-zinc-500 leading-none mb-1">{clock} IST</span>
              <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Feed
              </span>
            </div>
            {!isAuthenticated ? (
              <Link href="/login" className="px-4 py-1.5 bg-zinc-100 text-[#050606] text-[10px] font-black uppercase tracking-widest rounded-lg">
                Access
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[10px] font-bold">
                {user?.name?.charAt(0) || 'O'}
              </div>
            )}
          </div>
        </div>
      </nav>

      <SectorHeatTicker incidents={displayIncidents} />

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <DailyIntelBriefing />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <MetricCard label="Active Reports" value={stats.critical + stats.high} subValue={`${stats.critical} critical`} color="text-red-500" icon="🚨" />
          <MetricCard label="Total Reports" value={stats.total} subValue="Community reports" color="text-zinc-100" icon="📡" />
          <MetricCard label="Operatives" value={operatives.length} subValue="Field agents" color="text-blue-500" icon="👤" />
          <MetricCard label="Adversaries" value={profiles.length} subValue="Monitored targets" color="text-orange-500" icon="🕵️" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          <div className="xl:col-span-8 space-y-6 sm:space-y-8">
            <GlassCard title="Operational Theater Overview" icon="🗺️">
              <div className="h-[350px] sm:h-[450px] -mx-4 -mb-4">
                <MapView incidents={displayIncidents} />
              </div>
            </GlassCard>
            <GlassCard title="Zone Threat Assessment" icon="📊">
              <AreaThreatGauges incidents={displayIncidents} />
            </GlassCard>
          </div>

          <div className="xl:col-span-4 space-y-6 sm:space-y-8">
            <GlassCard title="Activity Timeline" icon="📈">
              <ActivityTimeline incidents={displayIncidents} />
            </GlassCard>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-red-500/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <span className="text-[8px] font-black uppercase tracking-wider text-red-500 border border-red-500/50 px-2 py-0.5 rounded">Community Verified</span>
              </div>
              <h4 className="text-lg font-black italic leading-none text-white uppercase tracking-tighter">Submit Intel</h4>
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-2">Strengthen the network</p>
              <Link href="/incidents/report" className="mt-6 block w-full py-4 bg-red-600 text-white text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-red-900/20 active:scale-95 transition-all">
                New Report →
              </Link>
            </div>
          </div>
        </div>

        <GlassCard title="Intelligence Stream Log" icon="🗞️">
          <RecentFeed incidents={displayIncidents} />
        </GlassCard>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, color, icon }: any) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-5 group transition-all hover:bg-zinc-900/50">
      <span className="text-xs text-zinc-700">{icon}</span>
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-4 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className={`text-3xl font-black tracking-tighter ${color}`}>{value}</h4>
        <span className="text-[9px] text-zinc-600 font-bold uppercase">{subValue}</span>
      </div>
    </div>
  );
}
