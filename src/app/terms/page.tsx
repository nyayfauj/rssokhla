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
            By accessing or using NyayFauj, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. These terms apply to all users, including Observers, Operatives, Verifiers, and Commanders.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Platform Purpose</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            NyayFauj is a community-driven platform for reporting and monitoring local safety incidents in the Okhla area of New Delhi. It is intended for civic awareness and community coordination, not for law enforcement, harassment, or vigilante activities.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            The platform serves as a tool for communities to document, share, and respond to safety concerns. It is not a substitute for professional law enforcement or emergency services. For emergencies, always contact 112 (Police) or 102 (Medical).
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
            <li>Do not attempt to breach platform security or access unauthorized data</li>
            <li>Do not use automated tools to scrape or extract data without permission</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Content &amp; Reporting</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            By submitting a report, you grant us a license to display, distribute, and archive that content on the platform. You retain ownership of your content, but we need these rights to operate the platform effectively.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            All reports go through a community verification process. Reports that fail verification or violate our guidelines may be removed. We reserve the right to:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside mt-2">
            <li>Review, moderate, and remove any content</li>
            <li>Suspend or terminate accounts that violate these terms</li>
            <li>Cooperate with law enforcement when legally required</li>
            <li>Share anonymized data for community safety research</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Verification & Trust System</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The platform uses a community-driven verification system. Reports accumulate Trust Points from verified community members. Users earn higher trust scores through consistent, accurate reporting and community validation.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            Abuse of the verification system (such as creating fake accounts to verify your own reports) is prohibited and may result in permanent ban.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Intellectual Property</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The NyayFauj platform, including its design, code, logo, and branding, is licensed under GPL-3.0. You may not use our branding or logo without permission. User-generated content remains the property of the user, subject to the license granted above.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">7. Disclaimer</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of any reports or data. NyayFauj is not responsible for any decisions made based on the information provided on this platform.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            We do not guarantee uninterrupted access. The platform may undergo maintenance, updates, or experience technical issues beyond our control.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">8. Limitation of Liability</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            To the maximum extent permitted by law, NyayFauj and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. This includes damages for loss of data, privacy breach (except where caused by our gross negligence), or any disputes arising from user-generated content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">9. Indemnification</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            You agree to indemnify and hold harmless NyayFauj and its contributors from any claims, damages, or expenses (including legal fees) arising from your violation of these terms or your use of the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">10. Dispute Resolution</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Any disputes arising from these terms shall be resolved through good-faith negotiation first. If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India. Where possible, we will attempt alternative dispute resolution mechanisms before litigation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">11. Account Termination</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We may suspend or terminate your access to the platform at any time, without notice, for conduct that we determine violates these Terms, is harmful to other users, or is otherwise objectionable. Upon termination, your right to use the platform ceases immediately.
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed mt-2">
            You may also terminate your account at any time by contacting us. Termination does not affect reports you&apos;ve already submitted, which may remain visible for community safety purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">12. Changes to Terms</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of significant changes through the platform or via email. Continued use of the platform after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">13. Severability</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">14. Contact</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For questions about these terms, contact:<br />
            <span className="text-red-400">legal@rssokhla.site</span><br />
            Response time: Within 72 hours for legal inquiries
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
