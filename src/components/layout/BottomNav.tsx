// ─── Bottom Navigation ──────────────────────────────────────
// Mobile bottom tab bar for primary navigation

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { useAlertsStore } from '@/stores/alerts.store';

const NAV_ITEMS = [
  { key: 'feed', label: 'Feed', icon: '📡', path: '/dashboard', isAction: false },
  { key: 'profiles', label: 'Intel', icon: '🕵️', path: '/profiles', isAction: false },
  { key: 'report', label: 'Report', icon: '➕', path: '/incidents/report', isAction: true },
  { key: 'alerts', label: 'Alerts', icon: '🔔', path: '/alerts', isAction: false },
  { key: 'more', label: 'More', icon: '☰', path: '/settings', isAction: false },
] as const;

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const activeAlerts = useAlertsStore((s) => s.activeAlerts);

  const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/50 safe-area-pb md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.path);

          if (item.isAction) {
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab('report');
                  router.push(item.path);
                }}
                className="relative -mt-5 flex flex-col items-center"
                aria-label="Report incident"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30 active:scale-95 transition-transform">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <span className="text-[10px] mt-1 text-zinc-400 font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as 'feed' | 'map' | 'alerts' | 'profiles' | 'more');
                router.push(item.path);
              }}
              className={`
                flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-colors
                ${isActive ? 'text-red-400' : 'text-zinc-500'}
              `}
              aria-label={item.label}
            >
              <span className="text-xl relative">
                {item.icon}
                {item.key === 'alerts' && criticalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-600 text-white text-[9px] font-bold rounded-full px-1">
                    {criticalCount}
                  </span>
                )}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-red-400' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
