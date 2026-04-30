'use client';

import { useEffect, useState } from 'react';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

interface Props {
  profile: KaryakartaProfile;
}

export default function ProfileAssessment({ profile }: Props) {
  const [assessment, setAssessment] = useState('Synthesizing field data...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const risk = profile.threatLevel === 'critical' ? 'High Risk' : profile.threatLevel === 'high' ? 'Moderate Risk' : 'Low Priority';
      const knownActivities = profile.knownActivities || [];
      const activities = knownActivities.length > 0 ? knownActivities.join(', ') : 'unknown activities';
      
      setAssessment(`Subject is classified as ${risk} based on rank of ${profile.rank}. Primary operational vector involves ${activities}. Reliability score of ${profile.reliabilityScore}% suggests caution during field intercepts.`);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  return (
    <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 relative overflow-hidden group mt-4">
      <div className="absolute top-3 right-3 flex gap-1.5 items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
        <div className="text-[9px] font-black text-red-500/60 uppercase tracking-[0.2em]">Live Assessment</div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-black text-red-400 uppercase tracking-[0.3em] italic">Autonomous Vector Analysis</h4>
        <p className={`text-sm text-zinc-200 leading-relaxed italic transition-all duration-1000 ${loading ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
          "{assessment}"
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-red-500/10">
          <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Reference: NF-IA-v1.4</span>
          <span className="text-[9px] text-red-900 font-black uppercase tracking-[0.1em]">Internal Classified</span>
        </div>
      </div>
    </div>
  );
}
