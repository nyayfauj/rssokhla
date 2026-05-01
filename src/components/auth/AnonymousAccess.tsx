'use client';
 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AnonymousAccess() {
  const router = useRouter();
  const { loginAnonymous, isLoading } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [magicLink, setMagicLink] = useState('');

  const handleAnonymousAccess = async () => {
    try {
      await loginAnonymous();
      const token = localStorage.getItem('nf_magic_token');
      const url = `${window.location.origin}/access?t=${token}`;
      setMagicLink(url);
      addToast({ type: 'info', message: 'Identity Created' });
    } catch {
      addToast({ type: 'error', message: 'Could not create session' });
    }
  };

  if (magicLink) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto text-green-500">
            <span className="text-3xl">🔒</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Identity Secured</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Your unique access link is ready.</p>
          </div>
          
          <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl space-y-4">
            <p className="text-[9px] text-zinc-400 leading-relaxed uppercase">
              Save this link. If you lose it, you lose access to this identity forever. 
              Add this app to your Home Screen to stay logged in.
            </p>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={magicLink} 
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] font-mono text-zinc-500"
              />
              <Button size="sm" onClick={() => { navigator.clipboard.writeText(magicLink); addToast({ type: 'info', message: 'Link Copied' }); }}>Copy</Button>
            </div>
          </div>

          <Button onClick={() => router.push('/')} variant="primary" fullWidth>Proceed to Dashboard →</Button>
          
          <div className="space-y-1">
            <p className="text-[9px] text-red-500 font-bold uppercase">⚠️ WARNING</p>
            <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">Nobody can delete your posts. Not even you.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center space-y-4">
        {/* ... existing card content ... */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto">
          <span className="text-3xl">🕶️</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Anonymous Protocol</h3>
          <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed uppercase tracking-widest">
            Enter the network without a trace. Managed via a secure unique link.
          </p>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-3 space-y-2 text-left border border-zinc-800/40">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest">
            <span className="text-green-500">✓</span> Full Feature Access
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest">
            <span className="text-green-500">✓</span> Perpetual Persistence
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest">
            <span className="text-red-500">✕</span> Immutable Records
          </div>
        </div>

        <Button
          onClick={handleAnonymousAccess}
          variant="secondary"
          fullWidth
          isLoading={isLoading}
          size="lg"
        >
          Activate Protocol
        </Button>

        <p className="text-[9px] text-zinc-700 uppercase font-bold">
          Zero logs. Zero footprints.
        </p>
      </div>
    </Card>
  );
}
