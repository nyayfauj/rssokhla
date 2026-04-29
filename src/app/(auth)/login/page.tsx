// ─── Login Page ─────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to NyayFauj to access the community monitoring dashboard.',
};

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-zinc-400 mt-1">Sign in to your monitoring account</p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Alternative actions */}
        <div className="space-y-3 text-center">
          <Link
            href="/register"
            className="block text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Don&apos;t have an account? <span className="text-red-400 font-medium">Register</span>
          </Link>
          <Link
            href="/anonymous"
            className="block text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Continue anonymously →
          </Link>
        </div>
      </div>
    </main>
  );
}
