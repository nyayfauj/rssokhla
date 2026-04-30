'use client';

import { useEffect, useState } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';

export default function DailyIntelBriefing() {
  const { incidents } = useIncidentsStore();
  const [summary, setSummary] = useState<string>('Analyzing latest intelligence nodes...');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis delay
    const timer = setTimeout(() => {
      if (incidents.length > 0) {
        setSummary(`Critical vigilance required. ${incidents.length} incidents logged in the last period. Focus remains on the Okhla-Shaheen Bagh corridor. Intelligence suggests stable but persistent monitoring levels.`);
      } else {
        setSummary("System optimal. No critical anomalies detected in the current surveillance cycle. Continue standard monitoring protocols.");
      }
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [incidents]);

  return (
    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="text-4xl">🤖</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Autonomous Intel Analysis</h3>
        </div>

        <div className={`space-y-2 transition-all duration-700 ${isAnalyzing ? 'blur-sm opacity-50' : 'blur-0 opacity-100'}`}>
          <p className="text-sm font-bold text-zinc-100 leading-relaxed italic">
            "{summary}"
          </p>
        </div>

        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
          <span>Vector: NF-CORE-PRO</span>
          <span>Update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
