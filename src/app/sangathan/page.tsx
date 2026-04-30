import SangathanJoin from '@/components/auth/SangathanJoin';
import Link from 'next/link';

export default function SangathanPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl italic">NF</span>
            <span className="text-2xl font-black uppercase tracking-tighter">NyayFauj Sangathan</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-red-500">Practice the Constitution</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-bold">Community Defense Node Activation</p>
        </div>

        <SangathanJoin />
        
        <div className="mt-12 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold max-w-lg mx-auto leading-relaxed">
            Joining the Sangathan grants you legal protection papers and a verified community identity. 
            This is for leaders who are ready to be seen and defend their society.
          </p>
          <Link href="/anonymous" className="mt-6 inline-block text-[10px] text-zinc-400 underline uppercase tracking-widest">
            I prefer to stay anonymous for now →
          </Link>
        </div>
      </div>
    </main>
  );
}
