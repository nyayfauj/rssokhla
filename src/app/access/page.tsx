'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import GlassCard from '@/components/ui/GlassCard';

function AccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginAnonymous } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('t');
    if (!token) {
      setStatus('error');
      return;
    }

    // Recovery logic: Restore token to localStorage and login
    try {
      localStorage.setItem('nf_magic_token', token);
      loginAnonymous().then(() => {
        setStatus('success');
        addToast({ type: 'success', message: 'Identity Restored via Magic Link' });
        setTimeout(() => router.push('/'), 2000);
      }).catch(() => setStatus('error'));
    } catch {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#050606] flex items-center justify-center p-4">
      <GlassCard title="Identity Recovery" icon="🛡️">
        <div className="text-center space-y-6 py-8">
          {status === 'verifying' && (
            <>
              <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Decrypting Access Token...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-4xl">✅</div>
              <p className="text-sm font-bold text-white uppercase tracking-widest">Access Granted</p>
              <p className="text-[10px] text-zinc-500">Redirecting to Intelligence Dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-4xl">⚠️</div>
              <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Invalid or Expired Link</p>
              <p className="text-[10px] text-zinc-500 max-w-[200px] mx-auto">This recovery link is either broken or the session has been terminated by the secure node.</p>
              <button onClick={() => router.push('/login')} className="text-[10px] text-zinc-400 underline uppercase tracking-widest">Return to Base</button>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense fallback={<div>Loading Access Protocol...</div>}>
      <AccessHandler />
    </Suspense>
  );
}
