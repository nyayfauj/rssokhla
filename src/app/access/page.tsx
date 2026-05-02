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

    try {
      localStorage.setItem('nf_magic_token', token);
      loginAnonymous().then(() => {
        setStatus('success');
        addToast({ type: 'success', message: 'Identity restored via magic link' });
        setTimeout(() => router.push('/'), 2000);
      }).catch(() => setStatus('error'));
    } catch {
      setStatus('error');
    }
  }, [searchParams, loginAnonymous, addToast, router]);

  return (
    <div className="min-h-screen bg-[#050606] flex items-center justify-center p-4">
      <GlassCard title="Identity Recovery" icon="&#x1F6E1;&#xFE0F;">
        <div className="text-center space-y-6 py-8">
          {status === 'verifying' && (
            <>
              <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-zinc-400">Verifying your link...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-4xl" aria-hidden="true">&#x2705;</div>
              <p className="text-sm font-semibold text-white">Access Granted</p>
              <p className="text-xs text-zinc-500">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-4xl" aria-hidden="true">&#x26A0;&#xFE0F;</div>
              <p className="text-sm font-semibold text-red-500">Invalid or Expired Link</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">This link may have expired or is no longer valid.</p>
              <button onClick={() => router.push('/login')} className="text-sm text-zinc-400 underline hover:text-zinc-200 transition-colors">Return to login</button>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050606] flex items-center justify-center text-zinc-400">Loading...</div>}>
      <AccessHandler />
    </Suspense>
  );
}
