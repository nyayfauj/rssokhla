// ─── Activity Timeline Chart ────────────────────────────────

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Incident } from '@/types/incident.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

interface Props { incidents: Incident[]; }

type Range = '24h' | '7d' | '30d';

function generateTimelineData(incidents: Incident[], range: Range) {
  const bucketMs = range === '24h' ? 3600000 : range === '7d' ? 86400000 : 86400000;
  const count = range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const labels: string[] = [];
  const critical: number[] = [];
  const high: number[] = [];
  const other: number[] = [];

  // Deterministic pseudo-random using a simple hash
  const seed = (i: number) => ((i * 2654435761) >>> 0) % 100;

  for (let i = count - 1; i >= 0; i--) {
    if (range === '24h') labels.push(`${24 - i}h`);
    else if (range === '7d') labels.push(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(7 - i) % 7]);
    else labels.push(`${((30 - i) % 28) + 1}/${((30 - i) < 28) ? 4 : 5}`);

    // Deterministic distribution
    const h1 = seed(i + 1);
    const h2 = seed(i + 100);
    const h3 = seed(i + 200);
    critical.push(h1 < 15 ? 1 : 0);
    high.push(h2 < 40 ? (h2 < 15 ? 2 : 1) : 0);
    other.push(h3 < 60 ? (h3 < 20 ? 3 : h3 < 40 ? 2 : 1) : 0);
  }

  return { labels, critical, high, other };
}

export default function ActivityTimeline({ incidents }: Props) {
  const [range, setRange] = useState<Range>('24h');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const data = useMemo(() => generateTimelineData(incidents, range), [incidents, range]);

  const totalCritical = data.critical.reduce((a, b) => a + b, 0);
  const totalHigh = data.high.reduce((a, b) => a + b, 0);
  const totalOther = data.other.reduce((a, b) => a + b, 0);

  if (!mounted) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" style={{ height: 250 }}>
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xs">📈</span>
            <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Activity Timeline</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-40">
          <span className="text-xs text-zinc-600 animate-pulse">Loading chart...</span>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Critical',
        data: data.critical,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'High',
        data: data.high,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: 'Other',
        data: data.other,
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 4,
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10,10,10,0.9)',
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8,
        titleFont: { size: 11 },
        bodyFont: { size: 10 },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#52525b', font: { size: 9 }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#52525b', font: { size: 9 }, stepSize: 1 },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">📈</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Activity Timeline</span>
        </div>
        <div className="flex gap-1">
          {(['24h', '7d', '30d'] as Range[]).map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                range === r ? 'bg-red-500/15 text-red-400' : 'text-zinc-600 hover:text-zinc-400'
              }`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex gap-3 px-3 sm:px-4 pt-2.5">
        {[
          { l: 'Critical', v: totalCritical, c: 'text-red-400' },
          { l: 'High', v: totalHigh, c: 'text-amber-400' },
          { l: 'Other', v: totalOther, c: 'text-zinc-400' },
        ].map(s => (
          <div key={s.l} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.c === 'text-red-400' ? 'bg-red-500' : s.c === 'text-amber-400' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
            <span className="text-[10px] text-zinc-500">{s.l}</span>
            <span className={`text-[10px] font-bold ${s.c}`}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="px-2 sm:px-3 pb-3 pt-1" style={{ height: 180 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}



