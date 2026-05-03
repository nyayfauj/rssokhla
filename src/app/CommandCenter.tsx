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
  const { incidents, setIncidents } = useIncidentsStore();
  const { alerts, setAlerts } = useAlertsStore();
  const { user, isAuthenticated, role } = useAuthStore();
  const [profiles] = useState(initialProfiles);
  const [operatives] = useState(initialOperatives);

  // Initialize store with server data
  useEffect(() => {
    if (initialIncidents.length > 0) setIncidents(initialIncidents);
    if (initialAlerts.length > 0) setAlerts(initialAlerts);
  }, [initialIncidents, initialAlerts]);


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


      <SectorHeatTicker incidents={displayIncidents} />

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <DailyIntelBriefing />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard 
            label="Active Reports" 
            value={stats.critical + stats.high} 
            subValue={`${stats.critical} critical threats`} 
            color="text-red-500" 
            icon="🚨" 
            glow="bg-red-500/5"
          />
          <MetricCard 
            label="Total Reports" 
            value={stats.total} 
            subValue="Verified stream documents" 
            color="text-zinc-100" 
            icon="📡" 
            glow="bg-zinc-100/5"
          />
          <MetricCard 
            label="Field Strength" 
            value={operatives.length || 'DEPLOYED'} 
            subValue="Verified Sangathan nodes" 
            color="text-blue-500" 
            icon="🛡️" 
            glow="bg-blue-500/5"
          />
          <MetricCard 
            label="RSS Targets" 
            value={profiles.length || 'SCANNING'} 
            subValue="Monitored personnel" 
            color="text-orange-500" 
            icon="🕵️" 
            glow="bg-orange-500/5"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          <div className="xl:col-span-8 space-y-6 sm:space-y-8">
            <GlassCard title="Operational Theater Overview" icon="🗺️">
              <div className="h-[350px] sm:h-[450px] -mx-4 -mb-4">
                <MapView incidents={displayIncidents} profiles={profiles} />
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
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-red-500/10 rounded-2xl p-6 relative overflow-hidden group hover-scan">
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <span className="text-[8px] font-black uppercase tracking-wider text-red-500 border border-red-500/50 px-2 py-0.5 rounded">Community Verified</span>
              </div>
              <h4 className="text-lg font-black italic leading-none text-white uppercase tracking-tighter">Submit Intel</h4>
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-2">Deploy Field Intelligence</p>
              <Link href="/incidents/report" className="mt-6 block w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-center text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-red-900/40 hover:shadow-red-600/20 active:scale-95 transition-all">
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

function MetricCard({ label, value, subValue, color, icon, glow }: any) {
  return (
    <div className={`relative overflow-hidden bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-5 sm:p-6 group transition-all hover:bg-zinc-900/50 hover:border-zinc-700/60`}>
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] pointer-events-none ${glow}`} />
      <span className="text-xs text-zinc-700 group-hover:scale-110 transition-transform inline-block">{icon}</span>
      <p className="text-[9px] sm:text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-5 mb-1.5">{label}</p>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
        <h4 className={`text-3xl sm:text-4xl font-black tracking-tighter tabular-nums ${color}`}>{value}</h4>
        <span className="text-[8px] sm:text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{subValue}</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
