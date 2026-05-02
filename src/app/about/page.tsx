import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About NyayFauj — Okhla Community Monitor',
  description: 'Learn about NyayFauj, a community-powered safety monitoring platform for Okhla, New Delhi.',
  openGraph: {
    title: 'About NyayFauj — Okhla Community Monitor',
    description: 'Community-powered safety monitoring for Okhla, New Delhi.',
  },
  twitter: {
    card: 'summary',
    title: 'About NyayFauj',
    description: 'Community-powered safety monitoring for Okhla, New Delhi.',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-xs font-medium text-red-400">
            Community-Powered Safety
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Safety starts with<br /><span className="text-red-500">community awareness</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            NyayFauj is a platform for the Okhla community to report, track, and verify local safety incidents. Built by residents, for residents — empowering collective awareness through transparent, community-driven reporting.
          </p>

          <div className="flex items-center justify-center gap-6 text-zinc-600">
            <span className="text-sm">Open Source</span>
            <span className="text-sm">Community-Led</span>
            <span className="text-sm">Privacy-Focused</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="px-8 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl transition-all hover:bg-red-500 active:scale-95">
              View Live Monitor
            </Link>
            <Link href="/incidents/report" className="px-8 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-semibold rounded-xl hover:border-zinc-600 transition-all">
              Report an Incident
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 space-y-16 max-w-4xl">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-red-400">&ldquo;A safer community starts with informed citizens.&rdquo;</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                NyayFauj operates on the principle that community members are best positioned to identify and report local safety concerns. We provide the tools to make this possible.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Through decentralized reporting and community verification, we create a transparent record of incidents that helps everyone stay informed and safe. Every report contributes to a shared understanding of our neighborhood.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Anonymous Reporting"
            desc="Submit reports without revealing your identity. Your safety comes first."
            icon="&#x1F6E1;&#xFE0F;"
          />
          <FeatureCard
            title="Community Verification"
            desc="Reports are verified by community members to ensure accuracy and reliability."
            icon="&#x2705;"
          />
          <FeatureCard
            title="Real-Time Monitoring"
            desc="Stay updated with a live feed of reported incidents in your area."
            icon="&#x1F4E1;"
          />
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Join the Community</h2>
          <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
            NyayFauj is built on the belief that community safety is a shared responsibility. Whether you report incidents, verify reports, or simply stay informed — your participation matters.
          </p>
          <Link href="/sangathan" className="inline-block px-8 py-3 bg-white text-black text-sm font-semibold rounded-full hover:bg-red-600 hover:text-white transition-all">
            Get Involved
          </Link>
        </div>
      </section>

      <div className="border-t border-zinc-900/50 py-12 bg-black/40 text-center space-y-4">
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
        </div>
        <Link href="/" className="text-xs text-zinc-600 hover:text-red-500 transition-colors">
          Return to Home
        </Link>
      </div>
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/40 p-6 space-y-4 hover:bg-zinc-900/40 transition-all">
      <span className="text-2xl" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} />
      <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}
