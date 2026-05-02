'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Incident } from '@/types/incident.types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

interface Props { incidents: Incident[]; }

type Range = '24h' | '7d' | '30d';

function generateTimelineData(incidents: Incident[], range: Range) {
  const count = range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const labels: string[] = [];
  const critical: number[] = new Array(count).fill(0);
  const high: number[] = new Array(count).fill(0);
  const other: number[] = new Array(count).fill(0);

  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    if (range === '24h') {
      const d = new Date(now.getTime() - i * 3600000);
      labels.push(`${String(d.getHours()).padStart(2, '0')}:00`);
    } else if (range === '7d') {
      const d = new Date(now.getTime() - i * 86400000);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    } else {
      const d = new Date(now.getTime() - i * 86400000);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    }
  }

  if (incidents && Array.isArray(incidents)) {
    incidents.forEach(inc => {
      const incDate = new Date(inc.timestamp);
      if (isNaN(incDate.getTime())) return;
      const diffMs = now.getTime() - incDate.getTime();
      
      let index = -1;
      if (range === '24h') {
        index = count - 1 - Math.floor(diffMs / 3600000);
      } else {
        index = count - 1 - Math.floor(diffMs / 86400000);
      }

      if (index >= 0 && index < count) {
        if (inc.severity === 'critical') critical[index]++;
        else if (inc.severity === 'high') high[index]++;
        else other[index]++;
      }
    });
  }

  return { labels, critical, high, other };
}

const chartOptions = {
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
      ticks: { color: '#52525b', font: { size: 10 }, maxRotation: 0 },
      border: { display: false },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.03)' },
      ticks: { color: '#52525b', font: { size: 10 }, stepSize: 1 },
      border: { display: false },
      beginAtZero: true,
    },
  },
};

export default function ActivityTimeline({ incidents }: Props) {
  const [range, setRange] = useState<Range>('24h');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const data = useMemo(() => generateTimelineData(incidents, range), [incidents, range]);

  const chartData = useMemo(() => ({
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
  }), [data]);

  const handleRangeChange = useCallback((r: Range) => setRange(r), []);

  const totalCritical = useMemo(() => data.critical.reduce((a, b) => a + b, 0), [data.critical]);
  const totalHigh = useMemo(() => data.high.reduce((a, b) => a + b, 0), [data.high]);
  const totalOther = useMemo(() => data.other.reduce((a, b) => a + b, 0), [data.other]);

  if (!mounted) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" style={{ height: 250 }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="text-sm" aria-hidden="true">📈</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Activity Timeline</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-40">
          <span className="text-xs text-zinc-600 animate-pulse">Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" role="img" aria-label="Activity timeline chart">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden="true">📈</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Activity Timeline</span>
        </div>
        <div className="flex gap-1" role="group" aria-label="Time range selector">
          {(['24h', '7d', '30d'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                range === r ? 'bg-red-500/15 text-red-400' : 'text-zinc-600 hover:text-zinc-400'
              }`}
              aria-pressed={range === r}
            >{r}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 px-4 pt-3">
        {[
          { l: 'Critical', v: totalCritical, c: 'text-red-400' },
          { l: 'High', v: totalHigh, c: 'text-amber-400' },
          { l: 'Other', v: totalOther, c: 'text-zinc-400' },
        ].map(s => (
          <div key={s.l} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${s.c === 'text-red-400' ? 'bg-red-500' : s.c === 'text-amber-400' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
            <span className="text-xs text-zinc-500">{s.l}</span>
            <span className={`text-xs font-bold ${s.c}`}>{s.v}</span>
          </div>
        ))}
      </div>

      <div className="px-2 pb-3 pt-1" style={{ height: 180 }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
