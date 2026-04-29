// ─── 2FA Setup Page ────────────────────────────────────────

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { isValidTOTP } from '@/lib/utils/validators';

type SetupStep = 'intro' | 'scanning' | 'verify' | 'recovery' | 'done';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const { isAnonymous } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [step, setStep] = useState<SetupStep>('intro');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [recoveryCodes] = useState<string[]>([
    'ABCD-1234-EFGH', 'IJKL-5678-MNOP', 'QRST-9012-UVWX',
    'YZAB-3456-CDEF', 'GHIJ-7890-KLMN', 'OPQR-1234-STUV',
  ]);

  if (isAnonymous) {
    return (
      <div className="max-w-sm mx-auto text-center py-12">
        <span className="text-5xl">🔒</span>
        <h1 className="text-xl font-bold text-white mt-4">2FA Unavailable</h1>
        <p className="text-sm text-zinc-400 mt-2">Two-factor authentication requires a registered account.</p>
        <Button className="mt-6" onClick={() => router.push('/register')}>Create Account</Button>
      </div>
    );
  }

  const handleVerify = () => {
    if (!isValidTOTP(code)) {
      setError('Enter a valid 6-digit code');
      return;
    }
    // In production, verify against the TOTP secret via auth.service
    setError('');
    setStep('recovery');
    addToast({ type: 'success', message: '2FA code verified!' });
  };

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <h1 className="text-xl font-bold text-white">Two-Factor Authentication</h1>

      {/* Step indicator */}
      <div className="flex gap-1">
        {['intro', 'scanning', 'verify', 'recovery', 'done'].map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
            (['intro', 'scanning', 'verify', 'recovery', 'done'].indexOf(step) >= i) ? 'bg-red-500' : 'bg-zinc-800'
          }`} />
        ))}
      </div>

      {/* Step: Intro */}
      {step === 'intro' && (
        <Card padding="lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <span className="text-3xl">🔐</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Secure Your Account</h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Two-factor authentication adds an extra layer of security. You&apos;ll need an authenticator app like
                Google Authenticator, Authy, or 1Password.
              </p>
            </div>
            <Button fullWidth size="lg" onClick={() => setStep('scanning')}>
              Begin Setup
            </Button>
          </div>
        </Card>
      )}

      {/* Step: QR Scan */}
      {step === 'scanning' && (
        <Card padding="lg">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase">Step 1: Scan QR Code</h2>
            <div className="w-48 h-48 bg-white rounded-2xl mx-auto flex items-center justify-center">
              <div className="w-40 h-40 bg-zinc-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Open your authenticator app and scan this QR code
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 mb-1">Manual entry key:</p>
              <code className="text-xs text-zinc-300 font-mono break-all">JBSWY3DPEHPK3PXP</code>
            </div>
            <Button fullWidth onClick={() => setStep('verify')}>
              I&apos;ve Scanned It
            </Button>
          </div>
        </Card>
      )}

      {/* Step: Verify */}
      {step === 'verify' && (
        <Card padding="lg">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase text-center">Step 2: Verify Code</h2>
            <p className="text-sm text-zinc-400 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
            <Input
              label="Verification Code"
              placeholder="000000"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              error={error}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <Button fullWidth size="lg" onClick={handleVerify} disabled={code.length !== 6}>
              Verify
            </Button>
          </div>
        </Card>
      )}

      {/* Step: Recovery codes */}
      {step === 'recovery' && (
        <Card padding="lg">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase">Step 3: Save Recovery Codes</h2>
              <p className="text-sm text-zinc-400 mt-2">
                Save these codes in a safe place. Each code can only be used once.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 grid grid-cols-2 gap-2">
              {recoveryCodes.map((rc, i) => (
                <code key={i} className="text-xs text-zinc-300 font-mono bg-zinc-800 rounded px-2 py-1.5 text-center">
                  {rc}
                </code>
              ))}
            </div>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                navigator.clipboard.writeText(recoveryCodes.join('\n'));
                addToast({ type: 'success', message: 'Recovery codes copied' });
              }}
            >
              📋 Copy All Codes
            </Button>
            <Button fullWidth size="lg" onClick={() => setStep('done')}>
              I&apos;ve Saved Them
            </Button>
          </div>
        </Card>
      )}

      {/* Step: Done */}
      {step === 'done' && (
        <Card padding="lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-lg font-bold text-white">2FA Enabled!</h2>
            <p className="text-sm text-zinc-400">
              Your account is now protected with two-factor authentication.
            </p>
            <Badge variant="success" size="md">Protection Active</Badge>
            <Button fullWidth onClick={() => router.push('/settings')}>
              Back to Settings
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
