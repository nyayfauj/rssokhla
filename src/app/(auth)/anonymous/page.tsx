// ─── Anonymous Access Page ──────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import AnonymousAccess from '@/components/auth/AnonymousAccess';

export const metadata: Metadata = {
  title: 'Anonymous Access',
  description: 'Access NyayFauj anonymously to browse and report incidents without creating an account.',
};

export default function AnonymousPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-white">
              Nyay<span className="text-red-500">Fauj</span>
            </span>
          </Link>
        </div>

        <AnonymousAccess />

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Want full features? <span className="text-red-400 font-medium">Sign In</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
