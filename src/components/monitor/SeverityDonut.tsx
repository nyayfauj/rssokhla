'use client';

import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Incident } from '@/types/incident.types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { incidents: Incident[]; }

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,10,10,0.9)',
      titleColor: '#fff',
      bodyColor: '#a1a1aa',
      padding: 8,
      cornerRadius: 8,
      titleFont: { size: 11 },
      bodyFont: { size: 10 },
    },
  },
};

export default function SeverityDonut({ incidents }: Props) {
  const { counts, verified, pctVerified, total } = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    let verified = 0;
    for (const i of incidents) {
      if (i.severity === 'critical') counts.critical++;
      else if (i.severity === 'high') counts.high++;
      else if (i.severity === 'medium') counts.medium++;
      else counts.low++;
      if (i.status === 'verified') verified++;
    }
    return { counts, verified, pctVerified: incidents.length > 0 ? Math.round((verified / incidents.length) * 100) : 0, total: incidents.length };
  }, [incidents]);

  const chartData = useMemo(() => ({
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [{
      data: [counts.critical, counts.high, counts.medium, counts.low],
      backgroundColor: [
        'rgba(220, 38, 38, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(34, 197, 94, 0.6)',
      ],
      borderColor: [
        'rgba(220, 38, 38, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      borderWidth: 1,
      hoverOffset: 4,
    }],
  }), [counts]);

  if (total === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" role="img" aria-label="Severity distribution chart: No data available">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="text-sm" aria-hidden="true">&#x1F3AF;</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Severity</span>
          </div>
          <span className="text-xs text-zinc-600">0 total</span>
        </div>
        <div className="p-6 flex items-center justify-center">
          <p className="text-sm text-zinc-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" role="img" aria-label={`Severity distribution: ${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low. ${pctVerified}% verified.`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden="true">&#x1F3AF;</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Severity</span>
        </div>
        <span className="text-xs text-zinc-600">{total} total</span>
      </div>

      <div className="p-3 flex items-center gap-4">
        <div className="relative" style={{ width: 110, height: 110 }}>
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">{pctVerified}%</span>
            <span className="text-xs text-zinc-500 uppercase">Verified</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { key: 'critical', label: 'Critical', color: 'bg-red-500', count: counts.critical },
            { key: 'high', label: 'High', color: 'bg-amber-500', count: counts.high },
            { key: 'medium', label: 'Medium', color: 'bg-yellow-500', count: counts.medium },
            { key: 'low', label: 'Low', color: 'bg-green-500', count: counts.low },
          ].map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-xs text-zinc-400">{s.label}</span>
              </div>
              <span className="text-sm font-bold text-zinc-300">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
