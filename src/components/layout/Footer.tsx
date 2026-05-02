import Link from 'next/link';

export default function Footer() {
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
              <Link href="/about" className="block text-sm text-zinc-500 hover:text-white transition-colors">About Us</Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Legal</h3>
            <nav className="space-y-2" aria-label="Legal links">
              <Link href="/privacy" className="block text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-zinc-500 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/incidents/report" className="block text-sm text-zinc-500 hover:text-white transition-colors">Report Incident</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-zinc-800/40 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} NyayFauj Community. Licensed under GPL-3.0.
          </p>
          <p className="text-xs text-zinc-600">
            Grievance Officer: <a href="mailto:grievance@rssokhla.site" className="text-zinc-500 hover:text-white transition-colors">grievance@rssokhla.site</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
