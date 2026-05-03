'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function AnonymousEntryPage() {
  const { loginAnonymous, isAuthenticated, isAnonymous, isLoading } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const router = useRouter();
  const [magicLink, setMagicLink] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAnonymous) {
      const token = localStorage.getItem('nf_magic_token');
      if (token) {
        setMagicLink(`${window.location.origin}/access?t=${token}`);
      }
    }
  }, [isAuthenticated, isAnonymous]);

  const handleEntry = async () => {
    try {
      await loginAnonymous();
      addToast({ type: 'success', message: 'Anonymous Protocol Engaged' });
      // Short delay for the toast
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to engage protocol' });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(magicLink);
    addToast({ type: 'info', message: 'Magic Link copied to clipboard' });
  };

  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100 selection:bg-purple-500/30">
      <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <Link href="/login" className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-black">&larr; Back to Auth Selection</Link>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-purple-500/30 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/10">🕶️</div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">Anonymous Protocol</h1>
            <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em]">Stealth Intelligence Gathering Mode</p>
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">No Trace</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
              Reports are submitted via temporary session keys. Your identity is never stored in our primary databases.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest">Magic Link</h3>
            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold tracking-tight">
              Restore your session from any device using a unique cryptographic token stored only on your machine.
            </p>
          </div>
        </div>

        {/* Action Card */}
        <GlassCard title="Authorization" icon="🔐">
          <div className="space-y-6">
            {!isAuthenticated || !isAnonymous ? (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 text-center px-4 leading-relaxed">
                  Engage the anonymous protocol to begin reporting and monitoring without a registered account.
                </p>
                <button
                  onClick={handleEntry}
                  disabled={isLoading}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-800 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-purple-900/20 hover:shadow-purple-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Engage Stealth Mode →'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-4">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <h4 className="text-xs font-black text-green-400 uppercase tracking-widest">Protocol Active</h4>
                    <p className="text-[10px] text-zinc-500">Your session is secure and anonymous.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Your Magic Recovery Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={magicLink}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-[10px] text-zinc-400 font-mono outline-none"
                    />
                    <button
                      onClick={copyLink}
                      className="px-4 bg-zinc-800 border border-zinc-700 hover:border-purple-500/50 rounded-xl text-xs transition-colors"
                      title="Copy Link"
                    >
                      📋
                    </button>
                  </div>
                  <p className="text-[9px] text-zinc-600 px-1 leading-relaxed">
                    ⚠️ Save this link! It is the ONLY way to recover your reports and reputation points if you clear your browser data.
                  </p>
                </div>

                <Link
                  href="/"
                  className="block w-full py-4 bg-zinc-100 text-[#050606] text-center text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all active:scale-[0.98]"
                >
                  Enter Command Center
                </Link>
              </div>
            )}
          </div>
        </GlassCard>

        <footer className="text-center">
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-black">
            Part of the NyayFauj Constitutional Defense Framework
          </p>
        </footer>
      </div>
    </main>
  );
}
