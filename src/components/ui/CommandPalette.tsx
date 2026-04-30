'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useKaryakartaStore } from '@/stores/karyakarta.store';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; title: string; type: string; url: string }[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { incidents } = useIncidentsStore();
  const { profiles } = useKaryakartaStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const incidentResults = incidents
      .filter(i => i.title.toLowerCase().includes(q) || i.locationId.toLowerCase().includes(q))
      .slice(0, 3)
      .map(i => ({ id: i.$id, title: i.title, type: 'INCIDENT', url: `/incidents/${i.$id}` }));

    const profileResults = profiles
      .filter(p => p.fullName.toLowerCase().includes(q) || (p.primaryArea && p.primaryArea.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(p => ({ id: p.$id, title: p.fullName, type: 'OPERATIVE', url: `/profiles/${p.$id}` }));

    setResults([...incidentResults, ...profileResults]);
  }, [query, incidents, profiles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      
      <div className="relative w-full max-w-xl bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
          <span className="text-zinc-500">🔍</span>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search Intelligence... (Incidents, Operatives, Locations)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-zinc-600"
          />
          <div className="px-1.5 py-0.5 rounded border border-zinc-800 text-[10px] text-zinc-500 font-mono">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((res) => (
              <button
                key={res.id}
                onClick={() => { router.push(res.url); setIsOpen(false); }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-100">{res.title}</p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{res.type}</p>
                </div>
                <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors">↵</span>
              </button>
            ))
          ) : query ? (
            <div className="py-12 text-center text-zinc-600">
              <p className="text-xs font-bold uppercase tracking-widest">No intelligence found</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2">
                <QuickLink label="Incidents Feed" url="/incidents" icon="📡" onClick={() => setIsOpen(false)} />
                <QuickLink label="Operative DB" url="/profiles" icon="🕵️" onClick={() => setIsOpen(false)} />
                <QuickLink label="Live Map" url="/map" icon="📍" onClick={() => setIsOpen(false)} />
                <QuickLink label="About System" url="/about" icon="ℹ️" onClick={() => setIsOpen(false)} />
              </div>
              
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-4">System Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <ActionLink label="Submit Intelligence" onClick={() => { router.push('/report'); setIsOpen(false); }} icon="📝" />
                <ActionLink label="Stealth Mode" onClick={() => { 
                  const isStealth = document.documentElement.classList.toggle('stealth-mode');
                  localStorage.setItem('nf-theme', isStealth ? 'stealth' : 'intelligence');
                  setIsOpen(false);
                }} icon="🌑" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionLink({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors text-left"
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{label}</span>
    </button>
  );
}

function QuickLink({ label, url, icon, onClick }: { label: string; url: string; icon: string; onClick: () => void }) {
  const router = useRouter();
  return (
    <button 
      onClick={() => { router.push(url); onClick(); }}
      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-800/40 hover:bg-zinc-800 transition-colors text-left"
    >
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">{label}</span>
    </button>
  );
}
