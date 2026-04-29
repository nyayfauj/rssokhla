// ─── Anonymous Access Component ─────────────────────────────

'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AnonymousAccess() {
  const router = useRouter();
  const { loginAnonymous, isLoading } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const handleAnonymousAccess = async () => {
    try {
      await loginAnonymous();
      addToast({ type: 'info', message: 'Entered as anonymous observer' });
      router.push('/dashboard');
    } catch {
      addToast({ type: 'error', message: 'Could not create anonymous session' });
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto">
          <span className="text-3xl">🕶️</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Anonymous Access</h3>
          <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Browse and report incidents without creating an account.
            Your identity will be protected.
          </p>
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2 text-left">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-green-400">✓</span> View incident feed
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-green-400">✓</span> Submit basic reports
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-green-400">✓</span> View active alerts
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-red-400">✕</span> Cannot verify reports
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-red-400">✕</span> No reputation tracking
          </div>
        </div>

        <Button
          onClick={handleAnonymousAccess}
          variant="secondary"
          fullWidth
          isLoading={isLoading}
          size="lg"
        >
          Enter Anonymously
        </Button>

        <p className="text-[10px] text-zinc-600">
          Device fingerprint used for abuse prevention only
        </p>
      </div>
    </Card>
  );
}
