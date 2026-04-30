'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100 overflow-x-hidden selection:bg-red-500/30">
      {/* Background HUD Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(239,68,68,0.1),_transparent_40%)]"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>
        <div className="absolute bottom-20 right-0 w-64 h-64 bg-red-900/10 blur-[100px]"></div>
      </div>

      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-[10px] font-black uppercase tracking-[0.4em] text-red-500 animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            Sangathan Doctrine: NYAYFAUJ
          </div>
          
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-gradient-red animate-slide-up leading-[0.9]">
              COMMUNITY<br/><span className="text-white/10 outline-text">DEFENSE</span>
            </h1>
            <p className="text-zinc-600 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] animate-fade-in delay-300">
              Periphery Intelligence Infrastructure // v5.1.0
            </p>
          </div>
          
          <div className="max-w-xl mx-auto space-y-6">
            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed animate-fade-in delay-500">
              NyayFauj is a decentralized Sangathan dedicated to monitoring community threats and practicing the Constitution through collective vigilance. We empower citizens to observe, record, and report in defense of justice.
            </p>
            <div className="flex items-center justify-center gap-4 text-zinc-700">
              <span className="w-8 h-px bg-zinc-800"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">Active nodes: 1,402</span>
              <span className="w-8 h-px bg-zinc-800"></span>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-700">
            <Link href="/" className="group relative px-10 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all shadow-[0_20px_60px_-15px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95">
              Initialize Dashboard
            </Link>
            <Link href="#doctrine" className="px-10 py-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 hover:border-zinc-500 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all group">
              Read Doctrine <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Doctrine Section */}
      <section id="doctrine" className="container mx-auto px-4 py-32 space-y-40">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="w-px h-24 bg-gradient-to-b from-red-600 to-transparent mx-auto"></div>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white">The Doctrine.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-6">
              <p className="text-xl font-bold text-red-500 italic">"The Constitution is not a static document; it is a lived practice of community defense."</p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                NyayFauj operates under the principle that every citizen has the fundamental duty to protect the sovereignty and integrity of their community. We provide the tools for this duty.
              </p>
            </div>
            <div className="space-y-6 pt-6 md:pt-0">
              <p className="text-zinc-400 text-sm leading-relaxed">
                Through decentralized intelligence and AI-backed legal fortification, we create an immutable record of justice. We do not just observe; we document the path to safety.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-600/30"></div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-4 sm:px-0">
          <TacticalCard 
            id="01"
            title="NODE IDENTITY"
            desc="Secure magic link authentication for anonymous operatives. No trace left behind."
          />
          <TacticalCard 
            id="02"
            title="SANGATHAN PROTECTION"
            desc="AI-generated legal papers citing Constitutional rights for verified community leaders."
          />
          <TacticalCard 
            id="03"
            title="IMMUTABLE INTEL"
            desc="Permanent, uneditable intelligence records ensuring accountability and historical truth."
          />
        </div>

        {/* Closing Statement */}
        <div className="relative group p-1 bg-gradient-to-b from-zinc-800/40 to-transparent rounded-[3rem]">
          <div className="bg-[#050606] rounded-[2.9rem] p-16 md:p-24 text-center space-y-10">
            <span className="text-8xl md:text-9xl absolute top-10 right-10 opacity-5 font-black italic">100%</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">We Are The Shield.</h2>
            <p className="text-zinc-500 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed">
              NyayFauj is the immutable layer of community safety. It is the organized practice of the Constitution in the face of threat. 
              Join the Sangathan, defend your sector.
            </p>
            <div className="pt-6">
              <Link href="/sangathan" className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                Join the Sangathan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900/50 py-20 bg-black/40 text-center space-y-6">
        <div className="flex items-center justify-center gap-12">
          <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">Privacy: Encrypted</span>
          <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">Ops: Autonomous</span>
          <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase">Status: Live</span>
        </div>
        <Link href="/" className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 hover:text-red-500 transition-colors">
          Return to Command Center
        </Link>
      </footer>

      <style jsx>{`
        .text-gradient-red {
          background: linear-gradient(to bottom right, #fff 30%, #ef4444 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.15);
        }
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
    </main>
  );
}

function TacticalCard({ id, title, desc }: { id: string, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/40 p-10 space-y-8 hover:bg-zinc-900/40 transition-all group cursor-default">
      <div className="text-4xl font-black text-zinc-800 group-hover:text-red-600 transition-colors duration-500">{id}</div>
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">{title}</h3>
        <p className="text-[11px] text-zinc-600 leading-relaxed group-hover:text-zinc-400 transition-colors">{desc}</p>
      </div>
      <div className="w-6 h-px bg-zinc-800 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
}
