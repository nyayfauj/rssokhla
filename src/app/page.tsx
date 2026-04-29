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
import { MOCK_INCIDENTS, MOCK_ALERTS } from '@/lib/mock-data';
import { OKHLA_AREAS } from '@/types/location.types';

export default function WarMonitorPage() {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const critical = MOCK_INCIDENTS.filter(i => i.severity === 'critical').length;
  const high = MOCK_INCIDENTS.filter(i => i.severity === 'high').length;
  const threatLevel = critical > 0 ? 'CRITICAL' : high > 2 ? 'ELEVATED' : 'GUARDED';

  return (
    <main className="min-h-screen bg-[#060808] text-white">
      {/* ─── Top Bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#060808]/90 backdrop-blur-xl border-b border-zinc-800/40">
        <div className="flex items-center justify-between px-4 h-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <span className="font-bold text-sm tracking-tight">
              Nyay<span className="text-red-500">Fauj</span>
            </span>
            <span className="hidden sm:inline text-[10px] text-zinc-600 ml-1">OKHLA MONITOR</span>
          </div>
          <div className="flex items-center gap-3">
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

      <div className="max-w-5xl mx-auto px-3 sm:px-4 pb-24 space-y-3 sm:space-y-4">
        {/* ─── Threat Level Banner ───────────────────────── */}
        <ThreatBanner level={threatLevel} critical={critical} high={high} total={MOCK_INCIDENTS.length} />

        {/* ─── Active Alert Strip ────────────────────────── */}
        <ActiveAlertStrip alerts={MOCK_ALERTS} />

        {/* ─── Key Metrics ───────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { v: MOCK_INCIDENTS.length, l: 'Total', icon: '📋', c: 'text-white' },
            { v: critical, l: 'Critical', icon: '🚨', c: 'text-red-400' },
            { v: MOCK_INCIDENTS.filter(i => i.status === 'reported').length, l: 'Unverified', icon: '⏳', c: 'text-amber-400' },
            { v: Object.keys(OKHLA_AREAS).length, l: 'Areas', icon: '📍', c: 'text-blue-400' },
          ].map(s => (
            <div key={s.l} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-2.5 sm:p-3 text-center">
              <span className="text-base sm:text-lg">{s.icon}</span>
              <p className={`text-lg sm:text-2xl font-bold mt-1 ${s.c}`}>{s.v}</p>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>

        {/* ─── Live Ticker ───────────────────────────────── */}
        <LiveTicker incidents={MOCK_INCIDENTS} />

        {/* ─── Two-Column: Area Heatmap + Category ───────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AreaHeatmap incidents={MOCK_INCIDENTS} />
          <CategoryBreakdown incidents={MOCK_INCIDENTS} />
        </div>

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
      </div>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 py-4 text-center">
        <p className="text-[10px] text-zinc-600">🛡️ NyayFauj v1.0 — Community Monitor for Okhla · Encrypted · Open Source</p>
      </footer>
    </main>
  );
}
