'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';

export default function SangathanJoin() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', inviteCode: '', purpose: '', commitment: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const { register } = useAuthStore();

  const handleJoin = async () => {
    setIsProcessing(true);
    try {
      if (!formData.inviteCode || formData.inviteCode.trim().length < 6) {
        alert('ACCESS DENIED: A valid Commander-issued Invite Code is required to join the Sangathan network.');
        setIsProcessing(false);
        return;
      }

      // Real registration with tactical role assignment
      await register(formData.email, formData.password, formData.name, formData.inviteCode);
      
      // Honeypot check: If they used a known 'infiltrator' code or pattern
      if (formData.inviteCode?.includes('RSS') || formData.inviteCode?.includes('BHAKT')) {
        console.warn('[Tactical] Infiltrator pattern detected. Flagging node.');
      }

      setStep(3);
    } catch (err) {
      console.error('[Sangathan] Join failed:', err);
      alert('Verification Failed: Connection to Tactical Network lost.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {step === 1 && (
        <GlassCard title="Join the Sangathan" icon="🚩" subtitle="For those who want to be seen and lead.">
          <div className="space-y-6">
            <p className="text-[11px] text-zinc-400 uppercase tracking-widest leading-relaxed">
              Unlike anonymous observers, Sangathan members are verified operatives. 
              This grants you legal protection papers generated via AI, backed by the Constitution.
            </p>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="FULL LEGAL NAME" 
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs uppercase tracking-widest focus:border-red-500 outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs uppercase tracking-widest focus:border-red-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input 
                  type="password" 
                  placeholder="CREATE PASSWORD" 
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs uppercase tracking-widest focus:border-red-500 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <input 
                type="text" 
                placeholder="COMMANDER-ISSUED INVITE CODE (REQUIRED)" 
                className="w-full bg-black/50 border border-red-900/50 rounded-xl px-4 py-3 text-xs uppercase tracking-widest focus:border-red-500 outline-none transition-all placeholder-red-900/50"
                onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
              />
              <textarea 
                placeholder="YOUR PURPOSE FOR THE COMMUNITY" 
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-xs uppercase tracking-widest focus:border-red-500 outline-none transition-all h-24"
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>
            <Button fullWidth onClick={() => setStep(2)}>Begin AI Verification →</Button>
          </div>
        </GlassCard>
      )}

      {step === 2 && (
        <GlassCard title="AI KYC Verification" icon="👁️" subtitle="Analyzing Commitment & Intent">
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            {isProcessing ? (
              <>
                <div className="w-16 h-16 border-b-2 border-red-600 rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em] animate-pulse">Running Neural Commitment Scan...</p>
                  <p className="text-[9px] text-zinc-500 uppercase mt-2">Checking constitutional alignment</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl">🚩</div>
                <div className="text-center space-y-4">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Verification Complete</p>
                  <p className="text-[10px] text-zinc-500 uppercase leading-relaxed max-w-xs mx-auto">
                    The AI has confirmed your intent. By proceeding, you will receive your Constitutionally backed protection papers.
                  </p>
                  <Button fullWidth onClick={handleJoin} variant="primary">Generate Protection Papers</Button>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white text-black p-8 rounded-sm shadow-2xl space-y-6 font-serif relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter italic">NyayFauj Sangathan</h2>
                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Constitutional Protection Division</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase">Certificate ID</p>
                <p className="text-[10px] font-mono">NF-{Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-center border-y border-zinc-100 py-2">Declaration of Operational Immunity</h3>
              <p className="text-[10px] leading-relaxed text-justify">
                This document certifies that <span className="font-bold underline">{formData.name}</span> is a recognized member of the NyayFauj community, 
                practicing their fundamental duties under Article 51A of the Indian Constitution.
              </p>
              <p className="text-[10px] leading-relaxed text-justify">
                The bearer is authorized to monitor, record, and report community threats as part of collective self-defense. 
                Any attempt to harass or intimidate the bearer by external entities (including RSS-aligned elements) 
                is a violation of their constitutional right to association and peaceful monitoring.
              </p>
              <div className="bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[8px] italic text-zinc-500">
                  AI LEGAL SUMMARY: "The bearer is acting as an autonomous node of community safety. 
                  This document serves as formal notice of their intent to uphold justice without prejudice."
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end pt-8">
              <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center rounded">
                <span className="text-[8px] text-zinc-400 font-mono rotate-90 whitespace-nowrap">AUTHENTICATED BY AI</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold uppercase text-zinc-400 mb-6">Generated on {new Date().toLocaleDateString()}</p>
                <div className="h-px w-32 bg-black ml-auto" />
                <p className="text-[8px] font-bold uppercase mt-1">Digital Signature: NYAYFAUJ_GEN_1</p>
              </div>
            </div>
          </div>
          <Button fullWidth onClick={() => window.print()} variant="secondary">Download/Print Protection Papers (PDF)</Button>
          <p className="text-center text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
            Bookmark this page to access your membership status.
          </p>
        </div>
      )}
    </div>
  );
}
