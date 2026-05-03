'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HIDDEN_PATHS = ['/login', '/register', '/anonymous'];

export default function Footer() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }
  return (
    <footer className="border-t border-zinc-800/40 bg-zinc-950/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-bold text-sm text-white">NF</span>
              <span className="font-bold text-white">Nyay<span className="text-red-500">Fauj</span></span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Community-powered safety monitoring for Okhla, New Delhi. Built by and for the community.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Platform</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              <Link href="/" className="block text-sm text-zinc-500 hover:text-white transition-colors">Live Monitor</Link>
              <Link href="/incidents" className="block text-sm text-zinc-500 hover:text-white transition-colors">All Reports</Link>
              <Link href="/map" className="block text-sm text-zinc-500 hover:text-white transition-colors">Map View</Link>
              <Link href="/docs" className="block text-sm text-zinc-500 hover:text-white transition-colors">User Documentation</Link>
              <Link href="/whitepaper" className="block text-sm text-zinc-500 hover:text-white transition-colors">Protocol Whitepaper</Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Legal</h3>
            <nav className="space-y-2" aria-label="Legal links">
              <Link href="/whitepaper" className="block text-sm text-zinc-500 hover:text-white transition-colors">Constitutional Basis</Link>
              <Link href="/privacy" className="block text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/incidents/report" className="block text-sm text-zinc-500 hover:text-white transition-colors">Report Incident</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-zinc-800/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} NyayFauj Network. 
            </p>
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest px-2 py-0.5 border border-zinc-800 rounded bg-zinc-900/50">v1.0.2-SECURE</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>Secured by <span className="font-bold text-zinc-400">Appwrite & Turbopack</span></span>
            <span className="text-zinc-800">|</span>
            <a href="mailto:grievance@rssokhla.site" className="text-zinc-500 hover:text-white transition-colors">grievance@rssokhla.site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
