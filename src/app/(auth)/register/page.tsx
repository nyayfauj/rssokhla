// ─── Register Page ──────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Join NyayFauj to help monitor and report RSS activities in Okhla.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-white">
              Nyay<span className="text-red-500">Fauj</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Join NyayFauj</h1>
          <p className="text-sm text-zinc-400 mt-1">Create your monitoring account</p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Alternative */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Already have an account? <span className="text-red-400 font-medium">Sign In</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
