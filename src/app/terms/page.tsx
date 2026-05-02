import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using the NyayFauj community monitoring platform.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <header>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Home</Link>
          <h1 className="text-2xl font-bold mt-4">Terms of Service</h1>
          <p className="text-sm text-zinc-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            By accessing or using NyayFauj, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Platform Purpose</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            NyayFauj is a community-driven platform for reporting and monitoring local safety incidents in the Okhla area of New Delhi. It is intended for civic awareness and community coordination, not for law enforcement, harassment, or vigilante activities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. User Responsibilities</h2>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Submit only accurate, truthful, and good-faith reports</li>
            <li>Do not submit false, misleading, or fabricated information</li>
            <li>Respect the privacy and dignity of all individuals</li>
            <li>Do not use the platform for harassment, defamation, or discrimination</li>
            <li>Comply with all applicable laws including India&apos;s IT Act, 2000</li>
            <li>Do not impersonate other individuals or entities</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Content &amp; Reporting</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            By submitting a report, you grant us a license to display, distribute, and archive that content on the platform. We reserve the right to:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Review, moderate, and remove any content</li>
            <li>Suspend or terminate accounts that violate these terms</li>
            <li>Cooperate with law enforcement when legally required</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Disclaimer</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of any reports or data. NyayFauj is not responsible for any decisions made based on the information provided on this platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            To the maximum extent permitted by law, NyayFauj and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">7. Dispute Resolution</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Any disputes arising from these terms shall be resolved through good-faith negotiation first. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">8. Account Termination</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We may suspend or terminate your access to the platform at any time, without notice, for conduct that we determine violates these Terms, is harmful to other users, or is otherwise objectionable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">9. Changes to Terms</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">10. Contact</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For questions about these terms, contact: <span className="text-red-400">legal@rssokhla.site</span>
          </p>
        </section>

        <div className="pt-8 border-t border-zinc-800">
          <Link href="/privacy" className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Read our Privacy Policy &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
