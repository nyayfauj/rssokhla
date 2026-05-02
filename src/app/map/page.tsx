import type { Metadata } from 'next';
import MapClient from '@/components/map/MapClient';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Safety Map — Okhla Community Monitor',
  description: 'Interactive map of reported safety incidents and community alerts in Okhla, New Delhi. View real-time reports, filter by category, and stay informed.',
  openGraph: {
    title: 'Safety Map — Okhla Community Monitor',
    description: 'Interactive map of reported safety incidents in Okhla.',
  },
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-2">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Home</Link>
          <h1 className="text-2xl font-bold">Safety Map</h1>
          <p className="text-sm text-zinc-400">
            Real-time view of community-reported incidents across Okhla. Click on markers for details.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <MapClient />
          </div>

          <aside className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-300">How to Use</h2>
              <ul className="text-xs text-zinc-500 space-y-2">
                <li>• Click markers to view incident details</li>
                <li>• Use filters to narrow by category</li>
                <li>• Zoom and pan to explore areas</li>
                <li>• Toggle heatmap for density view</li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-300">Legend</h2>
              <div className="space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>High Priority / Urgent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Low Priority / Verified</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-300">Wards</h2>
              <div className="space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: '#3b82f6'}}></span>
                  <span>Ward 187 - Sarita Vihar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: '#ef4444'}}></span>
                  <span>Ward 189 - Zakir Nagar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: '#eab308'}}></span>
                  <span>Ward 188 - Abul Fazal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: '#22c55e'}}></span>
                  <span>Ward 186 - Madanpur Khadar W</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: '#a855f7'}}></span>
                  <span>Ward 185 - Madanpur Khadar E</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-zinc-300">Report Incident</h2>
              <p className="text-xs text-zinc-500">
                See something? Report it anonymously or with your account.
              </p>
              <Link
                href="/incidents/report"
                className="block text-center text-xs font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
              >
                Report Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
