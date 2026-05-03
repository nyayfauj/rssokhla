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
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Connect to Network</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 font-bold">Community Defense Node Authorization</p>
          </div>
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
          <Link href="/sangathan" className="group hover-scan p-4 bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-2xl transition-all relative overflow-hidden">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-100 group-hover:text-red-500 transition-colors flex items-center gap-2">
              🚩 Join the Sangathan
            </h4>
            <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1 leading-relaxed">
              For those who want to be seen, lead, and receive AI-backed legal protection.
            </p>
          </Link>

          <Link href="/anonymous" className="group hover-scan p-4 bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-2xl transition-all relative overflow-hidden">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-100 group-hover:text-purple-500 transition-colors flex items-center gap-2">
              🕶️ Anonymous Protocol
            </h4>
            <p className="text-[9px] text-zinc-500 uppercase tracking-tighter mt-1 leading-relaxed">
              Execute zero-footprint surveillance and reporting. Managed via unique Magic Link.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
