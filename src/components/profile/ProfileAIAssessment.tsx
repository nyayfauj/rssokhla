'use client';

import { useEffect, useState } from 'react';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

interface Props {
  profile: KaryakartaProfile;
}

export default function ProfileAssessment({ profile }: Props) {
  const [assessment, setAssessment] = useState('Synthesizing field data...');
  const [loading, setLoading] = useState(true);

  const proofsCount = (profile.sightings || []).length + (profile.linkedIncidentIds || []).length;
  const isDeepScanReady = proofsCount >= 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      const risk = profile.threatLevel === 'critical' ? 'High Risk' : profile.threatLevel === 'high' ? 'Moderate Risk' : 'Low Priority';
      const knownActivities = profile.knownActivities || [];
      const activities = knownActivities.length > 0 ? knownActivities.join(', ') : 'unknown activities';
      
      let baseAssessment = `Subject is classified as ${risk} based on rank of ${profile.rank}. Primary operational vector involves ${activities}.`;
      
      if (isDeepScanReady) {
        baseAssessment += ` DEEP SCAN ACTIVE: Additional public data found via OSINT scan. Social reach and network density are higher than initially reported. Reliability score of ${profile.reliabilityScore}% verified.`;
      } else {
        baseAssessment += ` Reliability score of ${profile.reliabilityScore}% suggests caution. DEEP SCAN PENDING: Need ${3 - proofsCount} more community proofs to trigger internet scan.`;
      }
      
      setAssessment(baseAssessment);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile, isDeepScanReady, proofsCount]);

  return (
    <div className={`bg-red-950/20 border rounded-2xl p-5 relative overflow-hidden group mt-4 transition-all ${isDeepScanReady ? 'border-red-500/40 ring-1 ring-red-500/20' : 'border-red-500/20'}`}>
      <div className="absolute top-3 right-3 flex gap-1.5 items-center">
        <div className={`w-1.5 h-1.5 rounded-full animate-ping ${isDeepScanReady ? 'bg-red-500' : 'bg-zinc-700'}`}></div>
        <div className="text-[9px] font-black text-red-500/60 uppercase tracking-[0.2em]">
          {isDeepScanReady ? 'Deep Scan Active' : 'Scan Pending'}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-red-400 uppercase tracking-[0.3em] italic">Autonomous Vector Analysis</h4>
        <p className={`text-sm text-zinc-200 leading-relaxed italic transition-all duration-1000 ${loading ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
          "{assessment}"
        </p>
        
        {/* Progress for Deep Scan */}
        {!isDeepScanReady && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              <span>Community Proofs</span>
              <span>{proofsCount}/3</span>
            </div>
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-1000" 
                style={{ width: `${(proofsCount / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-red-500/10">
          <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Reference: NF-IA-v1.5</span>
          <span className="text-[9px] text-red-900 font-black uppercase tracking-[0.1em]">
            {isDeepScanReady ? 'Enhanced Intelligence' : 'Preliminary Data'}
          </span>
        </div>
      </div>
    </div>
  );
}
