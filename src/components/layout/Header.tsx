// ─── Header Component ───────────────────────────────────────

'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Badge from '@/components/ui/Badge';

export default function Header() {
  const { isAuthenticated, isAnonymous, user } = useAuthStore();
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
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <Badge variant="default" size="sm">
                  👤 Anonymous
                </Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-xs font-bold text-white">
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
