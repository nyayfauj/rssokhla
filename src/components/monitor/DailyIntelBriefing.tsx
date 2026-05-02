'use client';

import { useMemo } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';

export default function DailyIntelBriefing() {
  const { incidents } = useIncidentsStore();

  const summary = useMemo(() => {
    if (incidents.length === 0) {
      return 'No reports have been submitted yet. Be the first to report activity in your area.';
    }

    const critical = incidents.filter(i => i.severity === 'critical').length;
    const verified = incidents.filter(i => i.status === 'verified').length;
    const recent = incidents.filter(i => {
      const diff = Date.now() - new Date(i.timestamp).getTime();
      return diff < 24 * 60 * 60 * 1000;
    }).length;

    const parts: string[] = [];
    if (critical > 0) parts.push(`${critical} critical report${critical > 1 ? 's' : ''} require attention`);
    parts.push(`${verified} of ${incidents.length} reports verified by the community`);
    if (recent > 0) parts.push(`${recent} new report${recent > 1 ? 's' : ''} in the last 24 hours`);

    return parts.join('. ') + '.';
  }, [incidents]);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-5 relative overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Activity Summary</h3>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          {summary}
        </p>

        <div className="pt-2 flex items-center justify-between text-xs text-zinc-600">
          <span>Community-generated</span>
          <span>Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}
