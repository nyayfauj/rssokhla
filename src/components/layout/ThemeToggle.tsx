'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isStealth, setIsStealth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nf-theme');
    if (saved === 'stealth') {
      setIsStealth(true);
      document.documentElement.classList.add('stealth-mode');
    }
  }, []);

  const toggle = () => {
    const next = !isStealth;
    setIsStealth(next);
    if (next) {
      document.documentElement.classList.add('stealth-mode');
      localStorage.setItem('nf-theme', 'stealth');
    } else {
      document.documentElement.classList.remove('stealth-mode');
      localStorage.setItem('nf-theme', 'default');
    }
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors group"
      aria-label={isStealth ? 'Switch to default theme' : 'Switch to stealth theme'}
      aria-pressed={isStealth}
    >
      <div className={`w-9 h-5 rounded-full relative transition-colors ${isStealth ? 'bg-red-900/50' : 'bg-zinc-800'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${isStealth ? 'left-4 bg-red-500' : 'left-0.5 bg-zinc-500'} shadow-[0_0_8px_rgba(239,68,68,0.5)]`}></div>
      </div>
      <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400">
        {isStealth ? 'Stealth' : 'Default'}
      </span>
    </button>
  );
}
