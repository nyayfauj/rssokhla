'use client';

const SECTORS = [
  { name: 'SHAHEEN BAGH', heat: 'HIGH', trend: 'UP' },
  { name: 'JAMIA NAGAR', heat: 'STABLE', trend: 'NEUTRAL' },
  { name: 'OKHLA PH III', heat: 'LOW', trend: 'DOWN' },
  { name: 'BATLA HOUSE', heat: 'MODERATE', trend: 'UP' },
  { name: 'ABUL FAZAL', heat: 'STABLE', trend: 'NEUTRAL' },
  { name: 'ZAKIR NAGAR', heat: 'LOW', trend: 'DOWN' },
];

export default function SectorHeatTicker() {
  return (
    <div className="bg-zinc-950 border-y border-zinc-800/40 py-1.5 overflow-hidden flex whitespace-nowrap no-print">
      <div className="flex animate-marquee items-center">
        {[...SECTORS, ...SECTORS].map((s, i) => (
          <div key={i} className="flex items-center gap-4 mx-8 group cursor-default">
            <span className="text-[9px] font-black text-zinc-500 tracking-widest">{s.name}</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black ${
                s.heat === 'HIGH' ? 'text-red-500' : s.heat === 'MODERATE' ? 'text-orange-500' : 'text-green-500'
              }`}>
                {s.heat}
              </span>
              <span className={`text-[8px] ${s.trend === 'UP' ? 'text-red-500' : s.trend === 'DOWN' ? 'text-green-500' : 'text-zinc-600'}`}>
                {s.trend === 'UP' ? '▲' : s.trend === 'DOWN' ? '▼' : '▬'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
