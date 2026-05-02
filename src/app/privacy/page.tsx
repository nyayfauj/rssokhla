import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for NyayFauj — how we collect, use, and protect your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <header>
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">&larr; Back to Home</Link>
          <h1 className="text-2xl font-bold mt-4">Privacy Policy</h1>
          <p className="text-sm text-zinc-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Introduction</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            NyayFauj (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) is a community-driven safety monitoring application for Okhla, New Delhi. This Privacy Policy explains how we collect, use, store, and share information when you use our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Information We Collect</h2>
          <h3 className="text-base font-medium text-zinc-300">2.1 Information You Provide</h3>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Account information (email, name) when you register</li>
            <li>Incident reports including descriptions, locations, and media</li>
            <li>Profile information for community members who opt in</li>
            <li>Communications and correspondence with us</li>
          </ul>
          <h3 className="text-base font-medium text-zinc-300">2.2 Information Collected Automatically</h3>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Device information (device type, operating system, browser)</li>
            <li>Approximate location data (when you submit reports)</li>
            <li>Usage data (pages viewed, features accessed)</li>
            <li>Service worker and local storage data for offline functionality</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Provide and improve the community monitoring platform</li>
            <li>Process and display incident reports to the community</li>
            <li>Moderate content for accuracy and appropriateness</li>
            <li>Send alerts and notifications about important community events</li>
            <li>Ensure platform security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Data Storage &amp; Security</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We use Appwrite as our backend infrastructure provider. Data is encrypted in transit using TLS/HTTPS. We implement access controls and role-based permissions to limit who can view and modify data. While we strive to protect your information, no system is completely secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Data Sharing</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We do not sell your personal information. Incident reports may be visible to other users of the platform for community awareness. We may share information if required by law, to protect rights and safety, or in connection with a merger or acquisition.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Your Rights</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Under India&apos;s Digital Personal Data Protection Act (DPDPA) 2023, you have the right to:
          </p>
          <ul className="text-sm text-zinc-400 space-y-1 list-disc list-inside">
            <li>Access your personal data held by us</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request erasure of your personal data</li>
            <li>Withdraw consent at any time</li>
            <li>Grievance redressal through our Grievance Officer</li>
          </ul>
          <p className="text-sm text-zinc-400 leading-relaxed">
            To exercise these rights, contact us at <span className="text-red-400">privacy@rssokhla.site</span>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">7. Data Retention</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We retain incident reports and community data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your personal data at any time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">8. Children&apos;s Privacy</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Our platform is not intended for children under 18. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">9. Changes to This Policy</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We may update this policy from time to time. We will notify users of significant changes through the platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">10. Contact</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            For questions about this policy or your data, contact:<br />
            <span className="text-red-400">privacy@rssokhla.site</span><br />
            Grievance Officer: NyayFauj Community
          </p>
        </section>

        <div className="pt-8 border-t border-zinc-800">
          <Link href="/terms" className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Read our Terms of Service &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
