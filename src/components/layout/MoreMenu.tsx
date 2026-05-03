'use client';

import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MENU_GROUPS = [
  {
    title: 'Protocol Access',
    items: [
      { label: 'Anonymous Entry', icon: '🕶️', href: '/anonymous', sub: 'Stealth monitoring mode' },
      { label: 'User Guide', icon: '📖', href: '/docs', sub: 'Operational instructions' },
      { label: 'Whitepaper', icon: '📄', href: '/whitepaper', sub: 'Technical architecture' },
    ]
  },
  {
    title: 'Legal & Constitutional',
    items: [
      { label: 'Constitutional Basis', icon: '⚖️', href: '/whitepaper#constitution', sub: 'Legal fortress framework' },
      { label: 'Privacy Policy', icon: '🔒', href: '/privacy', sub: 'Data sovereignty rules' },
      { label: 'Terms of Service', icon: '📜', href: '/terms', sub: 'Engagement protocols' },
      { label: 'Sangathan Network', icon: '🤝', href: '/community', sub: 'Verified community nodes' },
    ]
  },
  {
    title: 'Account Control',
    items: [
      { label: 'System Settings', icon: '⚙️', href: '/settings', sub: 'Interface & security' },
      { label: 'Operative Profile', icon: '👤', href: '/settings/profile', sub: 'Manage identity' },
    ]
  }
];

export default function MoreMenu() {
  const { isMoreMenuOpen, setMoreMenuOpen } = useUIStore();
  const { logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isMoreMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050606]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setMoreMenuOpen(false)}
      />

      {/* Menu Content */}
      <div className="relative w-full max-w-lg bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Advanced Options</h2>
            <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">Operational support systems</p>
          </div>
          <button 
            onClick={() => setMoreMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {MENU_GROUPS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] pl-1">{group.title}</h3>
              <div className="grid grid-cols-1 gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-red-500/30 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-500 transition-colors">{item.label}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{item.sub}</p>
                    </div>
                    <span className="ml-auto text-zinc-600 group-hover:text-red-500 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setMoreMenuOpen(false);
                router.push('/login');
              }}
              className="w-full mt-4 p-4 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-600/20 transition-all"
            >
              Terminate Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
