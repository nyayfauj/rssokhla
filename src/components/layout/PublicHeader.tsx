'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicHeader() {
  const pathname = usePathname();

  // Do not show on dashboard (page.tsx has its own header) or protected routes
  const isDashboard = pathname === '/';
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/incidents') || pathname.startsWith('/profiles') || pathname.startsWith('/map');
  
  if (isDashboard || isProtected) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🛡️</span>
          <span className="font-bold text-lg tracking-tight text-white">
            Nyay<span className="text-red-500">Fauj</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Live Monitor
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            About Us
          </Link>
          <Link 
            href="/anonymous" 
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            Report Anonymously
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="hidden sm:inline-flex px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            Sign In
          </Link>
          {/* Mobile Menu Button - simple link to menu or just report for now */}
          <Link 
            href="/anonymous" 
            className="sm:hidden px-3 py-1.5 bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg"
          >
            Report
          </Link>
        </div>
      </div>
    </header>
  );
}
