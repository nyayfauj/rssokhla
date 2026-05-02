// ─── Header Component ───────────────────────────────────────

'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Badge from '@/components/ui/Badge';

export default function Header() {
  const { isAuthenticated, isAnonymous, user, role } = useAuthStore();
  const { isOnline } = useUIStore();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-white text-lg tracking-tight">
            Nyay<span className="text-red-500">Fauj</span>
          </span>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="warning" size="sm" pulse>
              Offline
            </Badge>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {isAnonymous ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">OBSERVER</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em] leading-none mb-0.5">
                      {role.toUpperCase()}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-600 leading-none">
                      NODE: {user?.$id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-black">
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
