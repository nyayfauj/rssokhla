// ─── Desktop Sidebar ────────────────────────────────────────

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertsStore } from '@/stores/alerts.store';
import Badge from '@/components/ui/Badge';

const NAV_LINKS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📡' },
  { path: '/incidents', label: 'Incidents', icon: '📋' },
  { path: '/incidents/report', label: 'New Report', icon: '➕' },
  { path: '/map', label: 'Area Map', icon: '🗺️' },
  { path: '/alerts', label: 'Alerts', icon: '🔔' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAnonymous, role, logout } = useAuthStore();
  const criticalCount = useAlertsStore((s) => s.activeAlerts.filter((a) => a.severity === 'critical').length);

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-zinc-950 border-r border-zinc-800/50">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-zinc-800/50">
        <span className="text-xl">🛡️</span>
        <span className="font-bold text-white text-lg tracking-tight">
          Nyay<span className="text-red-500">Fauj</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.path === '/alerts' && criticalCount > 0 && (
                <Badge variant="danger" size="sm" pulse>{criticalCount}</Badge>
              )}
            </Link>
          );
        })}

        {/* Admin link — only for moderators/admins */}
        {(role === 'admin' || role === 'moderator') && (
          <>
            <div className="h-px bg-zinc-800/50 my-2" />
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/admin'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-lg">🔐</span>
              <span className="flex-1">Admin Panel</span>
            </Link>
          </>
        )}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-sm font-bold text-white">
            {isAnonymous ? '👤' : user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {isAnonymous ? 'Anonymous' : user?.name || 'Monitor'}
            </p>
            <p className="text-[10px] text-zinc-500 truncate">{role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full mt-2 px-3 py-2 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
