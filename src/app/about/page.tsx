import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NyayFauj, the autonomous community-driven safety monitor for Okhla.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-300 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden border-b border-zinc-800/40">
        <div className="absolute inset-0 bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Community First
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Defending <span className="text-gradient-red">Okhla</span> Through Intelligence
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            NyayFauj is an independent, autonomous monitoring platform designed to document, verify, and track organized threats within the Okhla community.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-16">
        
        {/* Mission */}
        <section className="grid sm:grid-cols-12 gap-8 items-start">
          <div className="sm:col-span-4">
            <h2 className="text-xl font-bold text-white sticky top-24">The Mission</h2>
          </div>
          <div className="sm:col-span-8 space-y-4 text-zinc-400 leading-relaxed text-base">
            <p>
              In recent years, coordinated activities targeting minority neighborhoods have required a new standard of community vigilance. NyayFauj was built to democratize safety by providing residents of Jamia Nagar, Shaheen Bagh, Zakir Nagar, and surrounding areas with a unified intelligence dashboard.
            </p>
            <p>
              Our goal is simple: ensure that no malicious recruitment drive, surveillance operation, or aggressive propaganda campaign goes undocumented. We turn community observations into actionable, verified public intelligence.
            </p>
          </div>
        </section>

        {/* How It Works & AI */}
        <section className="grid sm:grid-cols-12 gap-8 items-start">
          <div className="sm:col-span-4">
            <h2 className="text-xl font-bold text-white sticky top-24">Autonomous AI Intelligence</h2>
          </div>
          <div className="sm:col-span-8">
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 space-y-6">
              <p className="text-zinc-400 leading-relaxed text-base">
                NyayFauj operates as a completely independent machine. It does not rely on operators or external messaging platforms. Instead, it utilizes an advanced Vision AI to autonomously parse community reports.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-700">📸</div>
                  <div>
                    <h4 className="text-white font-semibold">1. Evidence Submission</h4>
                    <p className="text-sm text-zinc-500 mt-1">Users anonymously upload photos of suspicious activities, flyers, or individuals to the platform.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-900/20 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/30">🧠</div>
                  <div>
                    <h4 className="text-white font-semibold">2. Vision Analysis</h4>
                    <p className="text-sm text-zinc-500 mt-1">Our autonomous AI immediately scans the media. It reads text off banners, identifies organizational logos, and specifically extracts names of operatives.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-900/20 text-red-400 flex items-center justify-center flex-shrink-0 border border-red-500/30">🕸️</div>
                  <div>
                    <h4 className="text-white font-semibold">3. Database Cross-Referencing</h4>
                    <p className="text-sm text-zinc-500 mt-1">The AI checks the extracted names against our private, historical database of known <i>Karyakarta</i> profiles. It cross-references addresses, past work, and social media links, instantly linking repeat offenders.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anonymity Guarantee */}
        <section className="grid sm:grid-cols-12 gap-8 items-start">
          <div className="sm:col-span-4">
            <h2 className="text-xl font-bold text-white sticky top-24">The Anonymity Guarantee</h2>
          </div>
          <div className="sm:col-span-8 space-y-4 text-zinc-400 leading-relaxed text-base">
            <p>
              Your safety is the absolute priority. The NyayFauj application is entirely independent. We do not use Telegram bots, WhatsApp groups, or third-party social media integrations that could compromise your identity. 
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-red-500">
              <li><strong className="text-zinc-300">No IP Logging:</strong> We do not store your IP address when you submit an anonymous report.</li>
              <li><strong className="text-zinc-300">Device Fingerprinting:</strong> We use basic device signatures strictly to prevent spam and DDoS abuse. This data cannot be traced back to your real identity.</li>
              <li><strong className="text-zinc-300">End-to-End Control:</strong> All data is hosted on our secure, independent infrastructure.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-8 border-t border-zinc-800/40 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Protect Your Community</h2>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto">
            It takes all of us to keep Okhla safe. If you see something, document it safely and report it immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/anonymous" 
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] glow-red"
            >
              Report Incident Now
            </Link>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              View Live Map
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
