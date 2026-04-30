'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  subtitle?: string;
}

export default function GlassCard({ children, className = '', title, icon, subtitle }: Props) {
  return (
    <div className={`relative group ${className}`}>
      {/* Outer Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/0 to-orange-500/0 rounded-2xl blur opacity-0 group-hover:opacity-10 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition duration-1000"></div>
      
      <div className="relative h-full bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/40 rounded-2xl overflow-hidden flex flex-col">
        {/* Scanning Line Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-[1px] bg-red-500 shadow-[0_0_15px_#ef4444] animate-scan-y absolute top-0"></div>
        </div>

        {(title || icon) && (
          <div className="px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && <span className="text-sm">{icon}</span>}
              <div>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</h3>
                {subtitle && <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">{subtitle}</p>}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
