'use client';

import { useState, useEffect } from 'react';
import GlassCard from './GlassCard';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a few seconds before showing to not overwhelm immediately
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in md:bottom-8 md:left-auto md:right-8 md:w-96">
      <div className="bg-zinc-950/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 shadow-[0_0_40px_rgba(220,38,38,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-transparent" />
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-black text-white shrink-0 border border-red-500/50">
            NF
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">Install Secure Node</h3>
            <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest">
              Install the NyayFauj platform to your home screen for offline capability, instant tactical alerts, and zero-footprint reporting.
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleInstall}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2.5 rounded-lg transition-colors active:scale-95 hover-scan relative overflow-hidden"
              >
                Install Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
