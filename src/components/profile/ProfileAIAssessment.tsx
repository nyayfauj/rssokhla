'use client';

import { useEffect, useState } from 'react';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

interface Props {
  profile: KaryakartaProfile;
}

export default function ProfileAIAsessment({ profile }: Props) {
  const [assessment, setAssessment] = useState('Synthesizing field data...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const risk = profile.threatLevel === 'critical' ? 'High Risk' : profile.threatLevel === 'high' ? 'Moderate Risk' : 'Low Priority';
      const activities = profile.knownActivities.length > 0 ? profile.knownActivities.join(', ') : 'unknown activities';
      
      setAssessment(`Subject is classified as ${risk} based on rank of ${profile.rank}. Primary operational vector involves ${activities}. Reliability score of ${profile.reliabilityScore}% suggests caution during field intercepts.`);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  return (
    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-4 relative overflow-hidden group mt-3">
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-1 h-1 rounded-full bg-red-500 animate-ping"></div>
        <div className="text-[8px] font-black text-red-500/50 uppercase tracking-widest">Live Analysis</div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">AI Threat Assessment</h4>
        <p className={`text-xs text-zinc-300 leading-relaxed italic transition-all duration-1000 ${loading ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
          "{assessment}"
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-red-500/10">
          <span className="text-[8px] text-zinc-600 font-mono uppercase">Reference: NF-IA-v1.4</span>
          <span className="text-[8px] text-red-900 font-black uppercase">Classified Access Only</span>
        </div>
      </div>
    </div>
  );
}
