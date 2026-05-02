import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Whitepaper // NyayFauj Protocol',
  description: 'The Constitutional and Tactical Framework of Decentralized Community Intelligence.',
};

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#050606] text-zinc-300 selection:bg-red-500 selection:text-white font-mono">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-24">
        
        {/* Header */}
        <header className="space-y-4 border-l-2 border-red-600 pl-6">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Internal Protocol Doc // v1.0.4</p>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            NyayFauj <span className="text-red-600">Whitepaper</span>
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">
            The fundamental framework for autonomous citizen surveillance, 
            decentralized justice, and constitutional self-defense in the Okhla Sector.
          </p>
        </header>

        {/* Section: The Mission */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-zinc-800 font-black text-2xl">01</span>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">The Mission</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400 text-justify">
            <p>
              NyayFauj is a decentralized community intelligence platform designed to bridge the gap between 
              incident reporting and collective response. It operates on the principle of <span className="text-white italic">Situational Dominance</span>—where 
              the community itself becomes the primary observer and first responder to localized threats.
            </p>
            <p>
              By leveraging decentralized trust models, the app ensures that community intelligence cannot be censored, 
              manipulated, or ignored by centralized authorities or biased entities. Our goal is to transform 
              passive observation into active monitoring, creating a "Panopticon of the People" where the 
              marginalized are no longer the ones being watched, but the ones doing the watching.
            </p>
          </div>
        </section>

        {/* Section: The Inversion of Authority */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-zinc-800 font-black text-2xl">02</span>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">The Inversion of Authority</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              Traditional reporting relies on a single source of truth—usually an admin or a government agency. 
              These centers are vulnerable to intimidation, corruption, and technical failure. NyayFauj eliminates 
              the "Admin" as a singular point of failure.
            </p>
            <p>
              Through the <span className="text-red-500 font-bold">Protocol of Consensus</span>, intelligence is 
              validated by the collective trust of verified community nodes. Authority is not granted from the top down; 
              it is earned from the bottom up through consistent, verified contribution to community safety.
            </p>
          </div>
        </section>

        {/* Section: Tactical Protocol */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-zinc-800 font-black text-2xl">03</span>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Tactical Protocol</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs font-black text-red-500">ENCRYPTED</span>
              </div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Web of Trust</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Verification is not managed by a single admin but by a distributed network of Operatives. 
                Intelligence reaches "Community Verified" status only after accumulating trust points from vetted nodes. 
                Trust decays over time to ensure constant vigilance.
              </p>
            </div>
            <div className="space-y-3 p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs font-black text-green-500">STEALTH</span>
              </div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Anonymity Protocols</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Reporters can operate under total anonymity (Observer Protocol) or as identified Sangathan nodes. 
                User metadata is purged upon transmission, leaving only the tactical data (Incident Type, GPS, Evidence) 
                on the community ledger.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Tactical Neutrality */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-zinc-800 font-black text-2xl">04</span>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Tactical Neutrality</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              NyayFauj is architecturally neutral. It does not exist to promote an ideology but to enforce 
              <span className="text-white">Constitutional Accountability</span>. By providing an unfiltered stream 
              of intelligence, it forces a baseline of truth that cannot be ignored by mainstream media 
              or suppressed by state-aligned actors.
            </p>
          </div>
        </section>

        {/* Section: The Adversary Assessment */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-zinc-800 font-black text-2xl">05</span>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">The Adversary Assessment</h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
            <p>
              NyayFauj identifies the <span className="text-red-500 italic">Rashtriya Swayamsevak Sangh (RSS)</span> and its affiliates as the primary adversary to constitutional secularism and minority safety in India. This classification is based on a documented history of majoritarian extremism, systemic infiltration of democratic institutions, and a persistent role in instigating sectarian violence.
            </p>
            <p>
              The platform treats the RSS not merely as a political entity, but as a <span className="text-white">Paramilitary Intelligence Network</span> that operates through shadow cells (Shakhas). To counter this, NyayFauj provides a mirrors-reflection surveillance system—monitoring the monitors to ensure they cannot operate with impunity in our neighborhoods.
            </p>
          </div>
        </section>

        {/* Section: Legal Fortress & Constitutional Shield */}
        <section className="space-y-8 bg-zinc-950 border-y border-zinc-900 py-12 px-8 -mx-8 md:mx-0 md:rounded-3xl">
          <div className="space-y-2">
             <h2 className="text-lg font-black text-red-500 uppercase tracking-widest">Legal Fortress: The Constitutional Shield</h2>
             <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Non-Restrictable Rights Framework</p>
          </div>
          
          <div className="space-y-12">
            {/* Indian Constitutional Rights */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-red-600/10 text-red-500 px-2 py-1 rounded">Art. 19(1)(a) & SC ADR Case</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">The Right to Know</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                As established in <span className="italic text-zinc-300">ADR vs. Union of India (2002)</span>, the right to information is a fundamental facet of freedom of speech. NyayFauj enables the "Right to Know" about public threats, a right that the Supreme Court has declared paramount to the functioning of a democracy.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-red-600/10 text-red-500 px-2 py-1 rounded">Art. 51A(i) & (h)</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Scientific Temper & Duty</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                It is a Fundamental Duty to "safeguard public property and abjure violence" and to "develop the scientific temper, humanism and the spirit of inquiry and reform." Our platform is a technical manifestation of these duties—using data science to reform community safety.
              </p>
            </div>

            {/* Whistleblower Protection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-blue-600/10 text-blue-400 px-2 py-1 rounded">Whistleblowers Act (2014)</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Public Interest Disclosure</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                NyayFauj operates as a decentralized whistleblower mechanism. Information regarding illegal assemblies, harassment, and paramilitary mobilization is a "Public Interest Disclosure" protected under the spirit of the Whistleblowers Protection Act, 2014.
              </p>
            </div>

            {/* International Law */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-purple-600/10 text-purple-400 px-2 py-1 rounded">UDHR & ICCPR</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">International Human Rights</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Under <span className="text-zinc-300 italic">Article 19 of the Universal Declaration of Human Rights</span> and the <span className="text-zinc-300 italic">International Covenant on Civil and Political Rights (ICCPR)</span>, to which India is a signatory, every individual has the right to "seek, receive and impart information and ideas through any media and regardless of frontiers."
              </p>
            </div>

            {/* SC Privacy Judgment */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black bg-green-600/10 text-green-400 px-2 py-1 rounded">KS Puttaswamy (2017)</span>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Data Sovereignty</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The Supreme Court's recognition of Privacy as a Fundamental Right protects our users' anonymity. The platform's architectural choice to purge metadata is a proactive exercise of the "Right to be Forgotten" and "Right to Privacy."
              </p>
            </div>
          </div>
        </section>

        {/* Section: Final Message */}
        <section className="pt-20 border-t border-zinc-900 text-center space-y-10">
          <div className="relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-8xl text-zinc-900 font-black opacity-30">"</span>
            <blockquote className="relative text-xl md:text-2xl font-black text-white tracking-tighter italic leading-tight max-w-2xl mx-auto">
              "You want to erase my kind, this isn't a fight anymore, it's warfare."
            </blockquote>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em]">Arsalan Azad</p>
            <div className="flex items-center justify-center gap-4 text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">
              <span>Jai Bhim</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span>Jai Hind</span>
            </div>
          </div>

          <div className="pt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to CommandCenter
            </Link>
          </div>
        </section>

      </div>

      {/* Background HUD elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-10 right-10 text-[80px] font-black rotate-12">NYAY</div>
        <div className="absolute bottom-10 left-10 text-[80px] font-black -rotate-12">FAUJ</div>
      </div>
    </main>
  );
}
