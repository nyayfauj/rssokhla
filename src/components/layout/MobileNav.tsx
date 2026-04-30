'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Monitor', icon: '📡', href: '/' },
  { label: 'Sector Map', icon: '🗺️', href: '/map' },
  { label: 'Intel', icon: '🚨', href: '/incidents/report', primary: true },
  { label: 'Nodes', icon: '🕵️', href: '/profiles' },
  { label: 'Protocol', icon: '📋', href: '/about' },
];

export default function MobileNav() {
  const pathname = usePathname();

  // Hide on login/register pages
  if (['/login', '/register', '/anonymous'].includes(pathname)) {
    return null;
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#050606]/90 backdrop-blur-2xl border-t border-zinc-800/50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_20px_-5px_rgba(220,38,38,0.5)] active:scale-90 transition-all border-2 border-[#050606]"
              >
                {item.icon}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors ${
                isActive ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
