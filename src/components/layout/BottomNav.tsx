'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAlertsStore } from '@/stores/alerts.store';
import { useUIStore } from '@/stores/ui.store';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Monitor', icon: '📡', href: '/', activePath: '/' },
  { label: 'Map', icon: '🗺️', href: '/map', activePath: '/map' },
  { label: 'Report', icon: '➕', href: '/incidents/report', activePath: '/incidents/report', primary: true },
  { label: 'Community', icon: '👤', href: '/community', activePath: '/community' },
  { label: 'More', icon: '☰', href: '/about', activePath: '/about' },
];

const HIDDEN_PATHS = ['/login', '/register', '/anonymous'];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const activeAlerts = useAlertsStore((s) => s.activeAlerts);
  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  if (HIDDEN_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050606]/95 backdrop-blur-2xl border-t border-zinc-800/50"
      role="navigation"
      aria-label="Main navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.activePath || pathname.startsWith(item.activePath + '/');

          if (item.primary) {
            return (
              <button
                key={item.href}
                onClick={() => {
                  setActiveTab('report');
                  router.push(item.href);
                }}
                className="relative -top-4 flex flex-col items-center justify-center"
                aria-label="Report a new incident"
              >
                <span className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-red-900/40 active:scale-95 transition-transform border-2 border-[#050606]">
                  <span aria-hidden="true">{item.icon}</span>
                </span>
                <span className="text-xs mt-1 text-zinc-400 font-medium">Report</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
                isActive ? 'text-red-500' : 'text-zinc-500'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-lg relative">
                <span aria-hidden="true">{item.icon}</span>
                {item.href === '/alerts' && criticalCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full px-1">
                    {criticalCount}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
