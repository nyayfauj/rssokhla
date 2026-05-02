import type { Metadata } from 'next';
import SangathanJoin from '@/components/auth/SangathanJoin';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Join the Community — NyayFauj Sangathan',
  description: 'Become a verified community member and help keep Okhla safe.',
  openGraph: {
    title: 'Join the Community — NyayFauj Sangathan',
    description: 'Become a verified community member and help keep Okhla safe.',
  },
};

export default function SangathanPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-xl">NF</span>
            <span className="text-2xl font-bold">NyayFauj Sangathan</span>
          </Link>
          <h1 className="text-3xl font-semibold text-red-500">Practice the Constitution</h1>
          <p className="text-xs text-zinc-500 tracking-wide">Community Safety Network Activation</p>
        </div>

        <SangathanJoin />
        
        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
            Joining the Sangathan grants you legal protection resources and a verified community identity. 
            This is for leaders who are ready to support their neighborhood.
          </p>
          <Link href="/anonymous" className="mt-6 inline-block text-xs text-zinc-400 underline">
            I prefer to stay anonymous for now &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
