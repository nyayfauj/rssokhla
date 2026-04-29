// ─── Register Form Component ────────────────────────────────

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail, isStrongPassword, isValidUsername } from '@/lib/utils/validators';

export default function RegisterForm() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Username is required';
    else if (!isValidUsername(name)) errors.name = '3-32 chars, letters/numbers/underscore only';
    if (!email) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Invalid email format';
    const pwCheck = isStrongPassword(password);
    if (!pwCheck.valid) errors.password = pwCheck.errors[0];
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await register(email, password, name);
      addToast({ type: 'success', message: 'Account created! Welcome to NyayFauj.' });
      router.push('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        placeholder="your_username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={localErrors.name}
        autoComplete="username"
        icon={<span className="text-sm">👤</span>}
      />

      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={localErrors.email}
        autoComplete="email"
        icon={<span className="text-sm">📧</span>}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min 8 chars, mixed case + number + symbol"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={localErrors.password}
        autoComplete="new-password"
        icon={<span className="text-sm">🔒</span>}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={localErrors.confirmPassword}
        autoComplete="new-password"
        icon={<span className="text-sm">🔒</span>}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Password strength indicator */}
      <div className="space-y-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => {
            const strength = password.length >= 8 ? (isStrongPassword(password).valid ? 4 : 2) : password.length > 0 ? 1 : 0;
            return (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= strength
                    ? strength >= 4 ? 'bg-green-500' : strength >= 2 ? 'bg-amber-500' : 'bg-red-500'
                    : 'bg-zinc-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading} size="lg">
        Create Account
      </Button>
    </form>
  );
}
