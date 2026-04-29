'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100 overflow-x-hidden selection:bg-red-500/30">
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-black to-black"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-fade-in">
            Protocol: NyayFauj
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-gradient-red animate-slide-up">
            Digital<br/>Vigilance
          </h1>
          
          <p className="text-zinc-500 text-sm md:text-base font-medium tracking-wide max-w-2xl mx-auto leading-relaxed animate-fade-in delay-300">
            NyayFauj is an autonomous intelligence infrastructure built to monitor, track, and analyze community threats in real-time. We operate at the intersection of social justice and advanced technology.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-500">
            <Link href="/" className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)]">
              Enter Dashboard
            </Link>
            <Link href="#mission" className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all">
              Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="container mx-auto px-4 py-24 space-y-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tight uppercase italic">The Problem</h2>
            <p className="text-zinc-500 leading-relaxed text-sm">
              In the rapidly changing landscape of the Okhla periphery, traditional monitoring fails to capture the nuance of underground activity. Radicalization and targeted surveillance require a counter-intelligence framework that is decentralized and autonomous.
            </p>
            <p className="text-zinc-500 leading-relaxed text-sm">
              NyayFauj provides the tools for communities to reclaim their digital and physical spaces from hostile operatives.
            </p>
          </div>
          <div className="aspect-square bg-zinc-900/50 border border-zinc-800/40 rounded-[3rem] p-12 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-8xl opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700">🕵️</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black tracking-tight uppercase italic">Core Technology</h2>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Powered by Autonomous AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="👁️" 
              title="Gemini Vision" 
              desc="Our custom vision processor extracts intelligence from images in milliseconds, identifying operatives and locations without human bias."
            />
            <FeatureCard 
              icon="🕸️" 
              title="Network Analysis" 
              desc="We map the invisible connections between karyakartas, identifying high-value targets and leadership hierarchies automatically."
            />
            <FeatureCard 
              icon="📍" 
              title="Geospatial Intelligence" 
              desc="Real-time hotspot tracking across Shaheen Bagh, Jasola, and Jamia Nagar provides localized threat assessments for citizens."
            />
          </div>
        </div>

        {/* Manifesto Statement */}
        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 select-none font-black italic">100%</div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">We Operate Without an Operator.</h2>
          <p className="text-zinc-500 text-sm max-w-2xl mx-auto leading-relaxed">
            NyayFauj is designed to be self-sustaining. The logic is hardcoded into the architecture, ensuring that the mission persists even if the founders are silenced. We are the digital shield of the periphery.
          </p>
          <div className="pt-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors" />)}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900/50 py-12 bg-black/40">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors">Return to Ops Center</Link>
        </div>
      </footer>

      <style jsx>{`
        .text-gradient-red {
          background: linear-gradient(to bottom right, #fff 20%, #ef4444 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-3xl p-8 space-y-6 hover:bg-zinc-900/50 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
