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
            <span className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl italic">NF</span>
            <span className="text-2xl font-black uppercase tracking-tighter">
              Nyay<span className="text-red-500">Fauj</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Connect to Network</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-bold">Community Defense Node Authorization</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-6 mb-6">
          <LoginForm />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-zinc-800/50" />
          <span className="text-[10px] text-zinc-700 uppercase font-black tracking-widest">Protocol Selection</span>
          <div className="flex-1 h-px bg-zinc-800/50" />
        </div>

        {/* Alternative actions */}
        <div className="grid grid-cols-1 gap-4">
          <Link href="/sangathan" className="group p-4 bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-2xl transition-all">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-100 group-hover:text-red-500 transition-colors flex items-center gap-2">
              🚩 Join the Sangathan
            </h4>
            <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1 leading-relaxed">
              For those who want to be seen, lead, and receive AI-backed legal protection.
            </p>
          </Link>

          <Link href="/anonymous" className="group p-4 bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-2xl transition-all">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-100 group-hover:text-purple-500 transition-colors flex items-center gap-2">
              🕶️ Anonymous Protocol
            </h4>
            <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1 leading-relaxed">
              Browse and report without a trace. Managed via unique Magic Link.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
