// ─── Incident Severity Donut Chart ──────────────────────────

'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { MockIncident } from '@/lib/mock-data';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { incidents: MockIncident[]; }

export default function SeverityDonut({ incidents }: Props) {
  const counts = {
    critical: incidents.filter(i => i.severity === 'critical').length,
    high: incidents.filter(i => i.severity === 'high').length,
    medium: incidents.filter(i => i.severity === 'medium').length,
    low: incidents.filter(i => i.severity === 'low').length,
  };

  const verified = incidents.filter(i => i.status === 'verified').length;
  const pctVerified = Math.round((verified / incidents.length) * 100);

  const data = {
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
  };

  const options = {
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

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">🎯</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Severity</span>
        </div>
        <span className="text-[10px] text-zinc-600">{incidents.length} total</span>
      </div>

      <div className="p-3 flex items-center gap-4">
        {/* Donut */}
        <div className="relative" style={{ width: 110, height: 110 }}>
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">{pctVerified}%</span>
            <span className="text-[8px] text-zinc-500 uppercase">Verified</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5">
          {([
            { key: 'critical', label: 'Critical', color: 'bg-red-500', count: counts.critical },
            { key: 'high', label: 'High', color: 'bg-amber-500', count: counts.high },
            { key: 'medium', label: 'Medium', color: 'bg-yellow-500', count: counts.medium },
            { key: 'low', label: 'Low', color: 'bg-green-500', count: counts.low },
          ]).map(s => (
            <div key={s.key} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-[10px] text-zinc-400">{s.label}</span>
              </div>
              <span className="text-xs font-bold text-zinc-300">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
