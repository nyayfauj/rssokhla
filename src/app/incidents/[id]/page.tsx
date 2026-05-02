// ─── Incident Detail Page ───────────────────────────────────

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import SeverityBadge from '@/components/incidents/SeverityBadge';
import { INCIDENT_CATEGORIES, STATUS_LABELS } from '@/lib/utils/constants';
import { formatDate, formatCoordinates } from '@/lib/utils/formatters';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { selectedIncident, isLoading, error, getIncident, verifyIncident } = useIncidentsStore();
  const { user, isAnonymous, role } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (id) getIncident(id);
  }, [id, getIncident]);

  const handleVerify = async () => {
    if (!user || isAnonymous) {
      addToast({ type: 'warning', message: 'Anonymous users cannot verify reports' });
      return;
    }
    setVerifying(true);
    try {
      await verifyIncident(id, user.$id, role);
      await getIncident(id);
      addToast({ type: 'success', message: 'Intel corroborated by your node.' });
    } catch (err) {
      addToast({ type: 'error', message: 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  };

  const incident = selectedIncident;

  if (isLoading || !incident) {
    return (
      <div className="space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton variant="rectangular" height="200px" />
        <Skeleton lines={4} />
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="danger" padding="lg">
        <div className="text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm text-red-400 mt-3">{error}</p>
          <Button variant="danger" size="sm" onClick={() => router.push('/incidents')} className="mt-4">
            Back to Incidents
          </Button>
        </div>
      </Card>
    );
  }

  const category = INCIDENT_CATEGORIES[incident.category];
  const status = STATUS_LABELS[incident.status];
  const alreadyVerified = user ? incident.verifiedBy.includes(user.$id) : false;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4">
        <button onClick={() => router.back()} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-red-500 transition-all">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Return to Stream
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-zinc-700">HASH: {incident.$id.toUpperCase()}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        </div>
      </div>

      {/* Main Intel */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Sector: {incident.locationId}
            </span>
            <SeverityBadge severity={incident.severity} />
            <div className="px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-[9px] font-black uppercase tracking-widest text-red-500">
              Status: {status.label.toUpperCase()}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
            {incident.title}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">
            Transmission Logged: {formatDate(incident.timestamp).toUpperCase()}
          </p>
        </div>

        {/* Intelligence Summary */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-20 group-hover:opacity-40 transition-all" />
          <div className="relative bg-[#050606] border border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded-full" /> Intelligence Summary
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium whitespace-pre-line">
              {incident.description}
            </p>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TacticalMetric label="Operational Zone" value={incident.landmark || "UNSPECIFIED"} sub={incident.locationId ? OKHLA_AREAS[incident.locationId as OkhlaArea]?.label : "UNKNOWN SECTOR"} />
          <TacticalMetric 
            label="Network Corroboration" 
            value={`${Math.min(Math.round(((incident.trustPoints || 0) / 10) * 100), 100)}% CONFIDENCE`} 
            sub={`${incident.trustPoints || 0} TRUST POINTS // ${incident.verificationCount} NODES`} 
            accent={(incident.trustPoints || 0) >= 10 ? "text-green-500" : "text-amber-500"}
          />
          <TacticalMetric label="Intel Category" value={category.label.toUpperCase()} sub={`THREAT PROTOCOL: ${incident.severity.toUpperCase()}`} />
          <TacticalMetric label="Source Identity" value={incident.isAnonymous ? "STEALTH PROTOCOL" : "SANGATHAN OPERATIVE"} sub={incident.isAnonymous ? "ANONYMOUS TRANSMISSION" : `OPERATIVE ID: ${incident.reporterId.slice(-8).toUpperCase()}`} />
        </div>

        {/* Tactical Evidence */}
        {incident.mediaUrls.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] flex items-center gap-2">
              Captured Evidence // {incident.mediaUrls.length} FILES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {incident.mediaUrls.map((url, i) => {
                const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)/i) || url.includes('/view');
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center group overflow-hidden hover:border-red-600/50 transition-all">
                    {isImage ? (
                      <img src={url} alt={`Evidence ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <>
                        <span className="text-3xl group-hover:scale-110 transition-transform">📄</span>
                        <span className="text-[8px] font-black text-zinc-700 mt-2 uppercase tracking-widest">Open Evidence</span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {!isAnonymous && (
            <button
              onClick={handleVerify}
              disabled={alreadyVerified || verifying}
              className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                alreadyVerified 
                  ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98] shadow-red-900/20'
              }`}
            >
              {verifying ? 'TRANSMITTING...' : alreadyVerified ? '✓ CORROBORATED' : 'Corroborate Intel'}
            </button>
          )}
          <button 
            onClick={() => { navigator.share?.({ title: incident.title, text: incident.description, url: window.location.href }); }}
            className="px-10 py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:border-zinc-600 hover:text-zinc-200 transition-all active:scale-95"
          >
            Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

function TacticalMetric({ label, value, sub, accent = "text-white" }: { label: string, value: string, sub: string, accent?: string }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 p-5 rounded-2xl space-y-1">
      <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</p>
      <h4 className={`text-sm font-black uppercase tracking-tight ${accent}`}>{value}</h4>
      <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{sub}</p>
    </div>
  );
}
