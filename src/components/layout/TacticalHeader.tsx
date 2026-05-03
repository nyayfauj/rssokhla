'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import ThemeToggle from './ThemeToggle';

export default function TacticalHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, role } = useAuthStore();
  const setMoreMenuOpen = useUIStore((s) => s.setMoreMenuOpen);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#050606]/80 backdrop-blur-xl border-b border-zinc-800/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-sm italic shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">NF</span>
            <div className="hidden xs:block">
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase leading-none text-white">Nyay<span className="text-red-500">Fauj</span></h1>
              <p className="text-[8px] text-zinc-600 font-bold tracking-[0.3em] uppercase mt-0.5">Tactical Intel Command</p>
            </div>
          </Link>
          
          {/* Main Nav Links (Desktop & Tablet) */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-6 ml-2 md:ml-4">
            <Link 
              href="/" 
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === '/' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Monitor
            </Link>
            <Link 
              href="/incidents" 
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === '/incidents' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Intel
            </Link>
            <Link 
              href="/map" 
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === '/map' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Theater
            </Link>
            <Link 
              href="/community" 
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${pathname === '/community' ? 'text-red-500' : 'text-zinc-500 hover:text-white'}`}
            >
              Network
            </Link>
          </nav>
        </div>

        {/* Right: Telemetry & Auth */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          {/* Status Indicator (Mobile/Small) */}
          <div className="flex lg:hidden items-center px-2 py-1 rounded-full bg-zinc-900/50 border border-zinc-800/50">
            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse mr-2" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">LIVE</span>
          </div>

          {/* Telemetry (Desktop) */}
          <div className="hidden lg:flex flex-col items-end mr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-zinc-400 leading-none">{clock}</span>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">IST</span>
            </div>
            <span className="text-[8px] text-green-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              Satellite Link Active
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            {!isAuthenticated ? (
              <Link href="/login" className="px-4 sm:px-5 py-2 bg-zinc-100 text-[#050606] text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                Login
              </Link>
            ) : (
              <Link href="/settings" className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-red-500/30 transition-all group">
                <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-[10px] font-black text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-900/20">
                  {user?.name?.charAt(0) || 'O'}
                </div>
                <div className="flex flex-col items-start hidden xs:flex">
                  <span className="text-[7px] font-black text-zinc-600 leading-none mb-0.5 uppercase tracking-tighter">Authorized</span>
                  <span className="text-[9px] font-bold text-zinc-300 uppercase leading-none truncate max-w-[60px] sm:max-w-[100px]">{role || 'OPERATIVE'}</span>
                </div>
              </Link>
            )}

            {/* Menu Trigger (Desktop) */}
            <button
              onClick={() => setMoreMenuOpen(true)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/30 transition-all active:scale-95"
              aria-label="More options"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
