'use client';

import { useState, useCallback } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';

export default function SOSButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const { createIncident } = useIncidentsStore();
  const addToast = useUIStore((s) => s.addToast);
  const { user, isAuthenticated } = useAuthStore();

  // If not authenticated, hide the SOS button (only for verified operatives)
  if (!isAuthenticated) return null;

  const handleSOS = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }

    setIsBroadcasting(true);
    setIsConfirming(false);

    try {
      // Get exact GPS coordinates
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true, timeout: 5000, maximumAge: 0 
        });
      });

      await createIncident({
        title: 'URGENT: OPERATIVE SOS',
        description: `SOS Beacon triggered by ${user?.name || 'Operative'}. Immediate assistance required at these coordinates.`,
        category: 'other',
        severity: 'critical',
        isAnonymous: false,
        coordinates: [pos.coords.latitude, pos.coords.longitude],
        locationId: 'other', // We could reverse-geocode here, but speed is priority
        landmark: 'Exact GPS Attached',
        tags: ['SOS', 'EMERGENCY', 'OPERATIVE_IN_DANGER'],
        media: [],
      }, user?.$id || 'unknown', false);

      addToast({ type: 'success', message: 'SOS BROADCASTED. HELP IS ON THE WAY.' });
    } catch (error) {
      console.error('SOS Failed:', error);
      // Fallback if GPS fails
      await createIncident({
        title: 'URGENT: OPERATIVE SOS (NO GPS)',
        description: `SOS Beacon triggered by ${user?.name || 'Operative'}. GPS coordinates unavailable. Please contact immediately.`,
        category: 'other',
        severity: 'critical',
        isAnonymous: false,
        coordinates: [],
        locationId: 'other',
        landmark: 'Location Unknown',
        tags: ['SOS', 'EMERGENCY'],
        media: [],
      }, user?.$id || 'unknown', false);
      addToast({ type: 'success', message: 'SOS SENT. GPS FAILED.' });
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-8 md:right-8 group">
      <button
        onClick={handleSOS}
        disabled={isBroadcasting}
        className={`relative flex items-center justify-center rounded-full shadow-2xl transition-all outline-none ${
          isBroadcasting 
            ? 'w-14 h-14 bg-red-900 border-2 border-red-500 animate-pulse' 
            : isConfirming
              ? 'w-auto px-6 h-14 bg-red-600 border-2 border-red-400 hover-scan'
              : 'w-14 h-14 bg-zinc-900/80 border-2 border-red-600 hover:bg-red-950 backdrop-blur-md'
        }`}
        aria-label="SOS Panic Button"
      >
        {isBroadcasting ? (
          <span className="text-xl">📡</span>
        ) : isConfirming ? (
          <span className="text-xs font-black uppercase tracking-widest text-white animate-pulse">
            CONFIRM SOS 🚨
          </span>
        ) : (
          <span className="text-xl text-red-500 group-hover:scale-110 transition-transform">🆘</span>
        )}

        {/* Radar Ping Effect when active/confirming */}
        {(isConfirming || isBroadcasting) && (
          <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
        )}
      </button>
    </div>
  );
}
