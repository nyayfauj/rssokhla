// ─── War Monitor Dashboard (Public Landing) ────────────────

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThreatBanner from '@/components/monitor/ThreatBanner';
import LiveTicker from '@/components/monitor/LiveTicker';
import AreaHeatmap from '@/components/monitor/AreaHeatmap';
import CategoryBreakdown from '@/components/monitor/CategoryBreakdown';
import RecentFeed from '@/components/monitor/RecentFeed';
import ActiveAlertStrip from '@/components/monitor/ActiveAlertStrip';
import ProfileStrip from '@/components/monitor/ProfileStrip';
import ActivityTimeline from '@/components/monitor/ActivityTimeline';
import OkhlaMapSVG from '@/components/monitor/OkhlaMapSVG';
import NetworkGraph from '@/components/monitor/NetworkGraph';
import ZoneThreatGauges from '@/components/monitor/ZoneThreatGauges';
import SeverityDonut from '@/components/monitor/SeverityDonut';
import { MOCK_INCIDENTS, MOCK_ALERTS } from '@/lib/mock-data';
import { MOCK_PROFILES } from '@/lib/mock-profiles';
import { OKHLA_AREAS } from '@/types/location.types';

export default function WarMonitorPage() {
  const [clock, setClock] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setLastRefresh(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
  }, []);

  // Pull-to-refresh simulation
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1500);
  };

  const critical = MOCK_INCIDENTS.filter(i => i.severity === 'critical').length;
  const high = MOCK_INCIDENTS.filter(i => i.severity === 'high').length;
  const verified = MOCK_INCIDENTS.filter(i => i.status === 'verified').length;
  const threatLevel = critical > 0 ? 'CRITICAL' : high > 2 ? 'ELEVATED' : 'GUARDED';

  return (
    <main className="min-h-screen bg-[#060808] text-white">
      {/* ─── Top Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060808]/90 backdrop-blur-xl border-b border-zinc-800/40">
        <div className="flex items-center justify-between px-4 h-12 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <span className="font-bold text-sm tracking-tight">
              Nyay<span className="text-red-500">Fauj</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-600 ml-1">OKHLA MONITOR</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Refresh button */}
            <button onClick={handleRefresh}
              className={`text-zinc-600 hover:text-white transition-transform ${refreshing ? 'animate-spin' : ''}`}
              disabled={refreshing}>
              🔄
            </button>
            <span className="text-[11px] font-mono text-zinc-500" suppressHydrationWarning>{clock}</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] text-green-400 font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Refresh indicator ───────────────────────────── */}
      {refreshing && (
        <div className="bg-red-500/10 border-b border-red-500/20 py-1.5 text-center">
          <span className="text-[10px] text-red-400 animate-pulse">Refreshing intel feed...</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-24 space-y-3 sm:space-y-4">
        {/* ─── Threat Level Banner ───────────────────────── */}
        <ThreatBanner level={threatLevel} critical={critical} high={high} total={MOCK_INCIDENTS.length} />

        {/* ─── Active Alert Strip ────────────────────────── */}
        <ActiveAlertStrip alerts={MOCK_ALERTS} />

        {/* ─── Key Metrics (6 stats) ─────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { v: MOCK_INCIDENTS.length, l: 'Incidents', icon: '📋', c: 'text-white' },
            { v: critical, l: 'Critical', icon: '🚨', c: 'text-red-400' },
            { v: verified, l: 'Verified', icon: '✓', c: 'text-green-400' },
            { v: MOCK_PROFILES.length, l: 'Profiled', icon: '🕵️', c: 'text-purple-400' },
            { v: high, l: 'Active Threats', icon: '⚠️', c: 'text-amber-400' },
            { v: Object.keys(OKHLA_AREAS).length, l: 'Zones', icon: '📍', c: 'text-blue-400' },
          ].map(s => (
            <div key={s.l} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-2 sm:p-3 text-center">
              <span className="text-sm sm:text-base">{s.icon}</span>
              <p className={`text-base sm:text-xl font-bold mt-0.5 ${s.c}`}>{s.v}</p>
              <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-wider leading-tight">{s.l}</p>
            </div>
          ))}
        </div>

        {/* ─── Operations Map + Severity ─────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-3">
            <OkhlaMapSVG incidents={MOCK_INCIDENTS} />
          </div>
          <div className="sm:col-span-2 space-y-3">
            <SeverityDonut incidents={MOCK_INCIDENTS} />
            {/* Quick zone alerts */}
            <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs">🔔</span>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Active Hotspots</span>
              </div>
              <div className="space-y-1.5">
                {['shaheen_bagh', 'batla_house', 'jamia_nagar'].map(area => {
                  const areaInc = MOCK_INCIDENTS.filter(i => i.area === area);
                  const areaLabel = OKHLA_AREAS[area as keyof typeof OKHLA_AREAS]?.label || area;
                  const hasCritical = areaInc.some(i => i.severity === 'critical');
                  return (
                    <div key={area} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${
                      hasCritical ? 'border-red-800/30 bg-red-950/20' : 'border-zinc-800/30 bg-zinc-900/30'
                    }`}>
                      <span className="text-[10px] text-zinc-300">{areaLabel}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-zinc-500">{areaInc.length} inc</span>
                        {hasCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Activity Timeline ─────────────────────────── */}
        <ActivityTimeline incidents={MOCK_INCIDENTS} />

        {/* ─── Live Ticker ───────────────────────────────── */}
        <LiveTicker incidents={MOCK_INCIDENTS} />

        {/* ─── Zone Threat Gauges + Category Breakdown ───── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ZoneThreatGauges incidents={MOCK_INCIDENTS} />
          <CategoryBreakdown incidents={MOCK_INCIDENTS} />
        </div>

        {/* ─── Known Operatives + Network Graph ──────────── */}
        <ProfileStrip profiles={MOCK_PROFILES} />
        <NetworkGraph />

        {/* ─── Area Heatmap ──────────────────────────────── */}
        <AreaHeatmap incidents={MOCK_INCIDENTS} />

        {/* ─── Recent Incidents Feed ─────────────────────── */}
        <RecentFeed incidents={MOCK_INCIDENTS} />

        {/* ─── CTA Strip ────────────────────────────────── */}
        <div className="bg-gradient-to-r from-red-950/60 to-zinc-900/60 border border-red-900/30 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-bold text-white">Help Monitor Okhla</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Report incidents, verify sightings, and protect your community</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/login" className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl text-center transition-colors active:scale-[0.97]">
                Sign In
              </Link>
              <Link href="/anonymous" className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl text-center transition-colors active:scale-[0.97] border border-zinc-700">
                Anonymous
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Last Refresh ──────────────────────────────── */}
        <p className="text-center text-[9px] text-zinc-700" suppressHydrationWarning>
          Last refreshed: {lastRefresh} · Data anonymized · Sources protected
        </p>
      </div>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 py-4 text-center">
        <p className="text-[10px] text-zinc-600">🛡️ NyayFauj v2.0 — Community Monitor for Okhla · Encrypted · Open Source</p>
      </footer>
    </main>
  );
}
